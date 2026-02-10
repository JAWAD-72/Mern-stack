from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import razorpay
from fastapi.responses import StreamingResponse
import io
import csv


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"

# Razorpay client
razorpay_client = razorpay.Client(auth=(
    os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_key'),
    os.environ.get('RAZORPAY_KEY_SECRET', 'secret')
))

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== MODELS ====================

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    role: str
    created_at: str

class MembershipPlanRequest(BaseModel):
    plan_name: str
    plan_amount: int

class MembershipResponse(BaseModel):
    id: str
    user_id: str
    plan_name: str
    plan_amount: int
    razorpay_subscription_id: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    status: str

class TransactionResponse(BaseModel):
    id: str
    user_id: str
    membership_id: str
    razorpay_payment_id: Optional[str] = None
    amount: int
    payment_status: str
    payment_date: str
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None

class AdminStatsResponse(BaseModel):
    total_members: int
    total_monthly_recurring: int
    total_lifetime_funds: int
    active_memberships: int
    cancelled_memberships: int

class RazorpaySubscriptionCreate(BaseModel):
    subscription_id: str
    payment_id: Optional[str] = None

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register")
async def register_user(user: UserRegister):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user.password)
    
    user_doc = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "password_hash": hashed_password,
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create access token
    access_token = create_access_token({"user_id": user_id, "email": user.email})
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "user": {
            "id": user_id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": "user"
        }
    }

@api_router.post("/auth/login")
async def login_user(credentials: UserLogin):
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token({"user_id": user["id"], "email": user["email"]})
    
    return {
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "role": user["role"]
        }
    }

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "phone": current_user["phone"],
        "role": current_user["role"],
        "created_at": current_user["created_at"]
    }


# ==================== MEMBERSHIP ENDPOINTS ====================

@api_router.post("/memberships/create")
async def create_membership(
    plan_request: MembershipPlanRequest,
    current_user: dict = Depends(get_current_user)
):
    # Check if user already has an active membership
    existing_membership = await db.memberships.find_one({
        "user_id": current_user["id"],
        "status": "active"
    })
    
    if existing_membership:
        raise HTTPException(status_code=400, detail="You already have an active membership")
    
    # Create Razorpay subscription plan (in real scenario, plans should be pre-created)
    # For now, we'll create a simple subscription
    try:
        # Create a plan if not exists (simplified for demo)
        # In production, you should create plans once and reuse them
        
        membership_id = str(uuid.uuid4())
        
        # Store membership with pending status
        membership_doc = {
            "id": membership_id,
            "user_id": current_user["id"],
            "plan_name": plan_request.plan_name,
            "plan_amount": plan_request.plan_amount,
            "razorpay_subscription_id": None,
            "start_date": datetime.now(timezone.utc).isoformat(),
            "end_date": None,
            "status": "pending"
        }
        
        await db.memberships.insert_one(membership_doc)
        
        # Return Razorpay key and membership details for frontend to complete payment
        return {
            "membership_id": membership_id,
            "razorpay_key": os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_key'),
            "plan_name": plan_request.plan_name,
            "amount": plan_request.plan_amount
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create membership: {str(e)}")

@api_router.post("/memberships/confirm")
async def confirm_membership(
    subscription_data: RazorpaySubscriptionCreate,
    current_user: dict = Depends(get_current_user)
):
    # Find the pending membership
    membership = await db.memberships.find_one({
        "user_id": current_user["id"],
        "status": "pending"
    })
    
    if not membership:
        raise HTTPException(status_code=404, detail="No pending membership found")
    
    # Update membership with subscription details
    await db.memberships.update_one(
        {"id": membership["id"]},
        {
            "$set": {
                "razorpay_subscription_id": subscription_data.subscription_id,
                "status": "active",
                "start_date": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    # Create initial transaction record
    transaction_id = str(uuid.uuid4())
    transaction_doc = {
        "id": transaction_id,
        "user_id": current_user["id"],
        "membership_id": membership["id"],
        "razorpay_payment_id": subscription_data.payment_id,
        "amount": membership["plan_amount"],
        "payment_status": "success",
        "payment_date": datetime.now(timezone.utc).isoformat()
    }
    
    await db.transactions.insert_one(transaction_doc)
    
    return {"message": "Membership activated successfully"}

@api_router.get("/memberships/my-membership")
async def get_my_membership(current_user: dict = Depends(get_current_user)):
    membership = await db.memberships.find_one(
        {"user_id": current_user["id"], "status": {"$in": ["active", "pending"]}},
        {"_id": 0}
    )
    
    if not membership:
        return {"membership": None}
    
    return {"membership": membership}

@api_router.post("/memberships/cancel")
async def cancel_membership(current_user: dict = Depends(get_current_user)):
    membership = await db.memberships.find_one({
        "user_id": current_user["id"],
        "status": "active"
    })
    
    if not membership:
        raise HTTPException(status_code=404, detail="No active membership found")
    
    # Update membership status
    await db.memberships.update_one(
        {"id": membership["id"]},
        {
            "$set": {
                "status": "cancelled",
                "end_date": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {"message": "Membership cancelled successfully"}


# ==================== PAYMENT ENDPOINTS ====================

@api_router.get("/payments/history")
async def get_payment_history(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("payment_date", -1).to_list(100)
    
    return {"transactions": transactions}


# ==================== ADMIN ENDPOINTS ====================

@api_router.get("/admin/stats")
async def get_admin_stats(admin_user: dict = Depends(get_admin_user)):
    # Total members
    total_members = await db.users.count_documents({"role": "user"})
    
    # Active and cancelled memberships
    active_memberships = await db.memberships.count_documents({"status": "active"})
    cancelled_memberships = await db.memberships.count_documents({"status": "cancelled"})
    
    # Total monthly recurring
    active_memberships_list = await db.memberships.find(
        {"status": "active"},
        {"_id": 0, "plan_amount": 1}
    ).to_list(1000)
    total_monthly_recurring = sum(m["plan_amount"] for m in active_memberships_list)
    
    # Total lifetime funds
    all_transactions = await db.transactions.find(
        {"payment_status": "success"},
        {"_id": 0, "amount": 1}
    ).to_list(10000)
    total_lifetime_funds = sum(t["amount"] for t in all_transactions)
    
    return {
        "total_members": total_members,
        "total_monthly_recurring": total_monthly_recurring,
        "total_lifetime_funds": total_lifetime_funds,
        "active_memberships": active_memberships,
        "cancelled_memberships": cancelled_memberships
    }

@api_router.get("/admin/members")
async def get_all_members(admin_user: dict = Depends(get_admin_user)):
    users = await db.users.find(
        {"role": "user"},
        {"_id": 0, "password_hash": 0}
    ).to_list(1000)
    
    # Get membership info for each user
    for user in users:
        membership = await db.memberships.find_one(
            {"user_id": user["id"]},
            {"_id": 0}
        )
        user["membership"] = membership
    
    return {"members": users}

@api_router.get("/admin/transactions")
async def get_all_transactions(admin_user: dict = Depends(get_admin_user)):
    transactions = await db.transactions.find({}, {"_id": 0}).sort("payment_date", -1).to_list(1000)
    
    # Enrich with user data
    for transaction in transactions:
        user = await db.users.find_one(
            {"id": transaction["user_id"]},
            {"_id": 0, "name": 1, "email": 1, "phone": 1}
        )
        if user:
            transaction["user_name"] = user["name"]
            transaction["user_email"] = user["email"]
            transaction["user_phone"] = user["phone"]
    
    return {"transactions": transactions}

@api_router.get("/admin/export-csv")
async def export_members_csv(admin_user: dict = Depends(get_admin_user)):
    # Get all members with membership data
    users = await db.users.find(
        {"role": "user"},
        {"_id": 0, "password_hash": 0}
    ).to_list(1000)
    
    # Prepare CSV data
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "Name", "Email", "Phone", "Plan Name", "Plan Amount", 
        "Membership Status", "Start Date", "Subscription ID"
    ])
    
    # Write data
    for user in users:
        membership = await db.memberships.find_one(
            {"user_id": user["id"]},
            {"_id": 0}
        )
        
        writer.writerow([
            user["name"],
            user["email"],
            user["phone"],
            membership["plan_name"] if membership else "N/A",
            membership["plan_amount"] if membership else 0,
            membership["status"] if membership else "N/A",
            membership["start_date"] if membership else "N/A",
            membership.get("razorpay_subscription_id", "N/A") if membership else "N/A"
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=members_export.csv"
        }
    )


# ==================== WEBHOOK ENDPOINT ====================

@api_router.post("/payments/webhook")
async def razorpay_webhook(request: dict):
    # In production, verify webhook signature
    # For now, we'll accept all webhooks
    
    event = request.get("event")
    payload = request.get("payload", {})
    
    if event == "subscription.charged":
        # Record successful payment
        payment_entity = payload.get("payment", {}).get("entity", {})
        subscription_id = payload.get("subscription", {}).get("entity", {}).get("id")
        
        # Find membership
        membership = await db.memberships.find_one({"razorpay_subscription_id": subscription_id})
        
        if membership:
            transaction_id = str(uuid.uuid4())
            transaction_doc = {
                "id": transaction_id,
                "user_id": membership["user_id"],
                "membership_id": membership["id"],
                "razorpay_payment_id": payment_entity.get("id"),
                "amount": payment_entity.get("amount", 0) // 100,  # Convert paise to rupees
                "payment_status": "success",
                "payment_date": datetime.now(timezone.utc).isoformat()
            }
            
            await db.transactions.insert_one(transaction_doc)
    
    return {"status": "ok"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== SEED ADMIN USER ====================

@app.on_event("startup")
async def create_admin_user():
    # Check if admin exists
    admin_exists = await db.users.find_one({"email": "Baqir@gmail.com"})
    
    if not admin_exists:
        admin_id = str(uuid.uuid4())
        hashed_password = hash_password("Baqir@123")
        
        admin_doc = {
            "id": admin_id,
            "name": "Baqir Admin",
            "email": "Baqir@gmail.com",
            "phone": "9999999999",
            "password_hash": hashed_password,
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.users.insert_one(admin_doc)
        logger.info("Admin user created successfully")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
