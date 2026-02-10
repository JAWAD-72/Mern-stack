#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class FundraisingAPITester:
    def __init__(self, base_url="https://zahra-giving.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.user_token = None
        self.admin_token = None
        self.test_user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def log_result(self, test_name, success, message="", response_data=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}: PASSED - {message}")
        else:
            print(f"❌ {test_name}: FAILED - {message}")
        
        self.results.append({
            "test_name": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        })

    def make_request(self, method, endpoint, data=None, headers=None, expected_status=None):
        """Make HTTP request and return response"""
        url = f"{self.api_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=default_headers, timeout=30)

            # Check expected status if provided
            if expected_status and response.status_code != expected_status:
                return False, f"Expected status {expected_status}, got {response.status_code}", {}

            return True, response.status_code, response.json() if response.content else {}

        except requests.exceptions.RequestException as e:
            return False, f"Request error: {str(e)}", {}
        except json.JSONDecodeError:
            return False, f"Invalid JSON response", {}

    def test_user_registration(self):
        """Test user registration"""
        test_email = f"testuser_{datetime.now().strftime('%Y%m%d_%H%M%S')}@test.com"
        user_data = {
            "name": "Test User",
            "email": test_email,
            "phone": "9876543210",
            "password": "testpass123"
        }

        success, status_code, response = self.make_request('POST', 'auth/register', user_data, expected_status=200)
        
        if success and 'access_token' in response:
            self.user_token = response['access_token']
            self.test_user_id = response.get('user', {}).get('id')
            self.log_result("User Registration", True, f"User registered with email {test_email}")
            return True
        else:
            self.log_result("User Registration", False, f"Status: {status_code}, Response: {response}")
            return False

    def test_user_login(self):
        """Test user login - using admin credentials since we know they exist"""
        login_data = {
            "email": "Baqir@gmail.com",
            "password": "Baqir@123"
        }

        success, status_code, response = self.make_request('POST', 'auth/login', login_data, expected_status=200)
        
        if success and 'access_token' in response:
            # This should be admin user, store admin token
            if response.get('user', {}).get('role') == 'admin':
                self.admin_token = response['access_token']
                self.log_result("Admin Login", True, f"Admin logged in successfully")
            else:
                self.log_result("Admin Login", False, f"Expected admin role, got {response.get('user', {}).get('role')}")
            return True
        else:
            self.log_result("Admin Login", False, f"Status: {status_code}, Response: {response}")
            return False

    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.admin_token:
            self.log_result("Get Current User", False, "No token available")
            return False

        headers = {'Authorization': f'Bearer {self.admin_token}'}
        success, status_code, response = self.make_request('GET', 'auth/me', headers=headers, expected_status=200)
        
        if success and 'email' in response:
            self.log_result("Get Current User", True, f"Retrieved user info for {response.get('email')}")
            return True
        else:
            self.log_result("Get Current User", False, f"Status: {status_code}, Response: {response}")
            return False

    def test_admin_stats(self):
        """Test admin statistics endpoint"""
        if not self.admin_token:
            self.log_result("Admin Stats", False, "No admin token available")
            return False

        headers = {'Authorization': f'Bearer {self.admin_token}'}
        success, status_code, response = self.make_request('GET', 'admin/stats', headers=headers, expected_status=200)
        
        required_fields = ['total_members', 'total_monthly_recurring', 'total_lifetime_funds', 'active_memberships', 'cancelled_memberships']
        
        if success and all(field in response for field in required_fields):
            self.log_result("Admin Stats", True, f"Retrieved stats: {response}")
            return True
        else:
            self.log_result("Admin Stats", False, f"Status: {status_code}, Missing fields or error: {response}")
            return False

    def test_admin_members(self):
        """Test admin members list endpoint"""
        if not self.admin_token:
            self.log_result("Admin Members List", False, "No admin token available")
            return False

        headers = {'Authorization': f'Bearer {self.admin_token}'}
        success, status_code, response = self.make_request('GET', 'admin/members', headers=headers, expected_status=200)
        
        if success and 'members' in response:
            members_count = len(response['members'])
            self.log_result("Admin Members List", True, f"Retrieved {members_count} members")
            return True
        else:
            self.log_result("Admin Members List", False, f"Status: {status_code}, Response: {response}")
            return False

    def test_admin_transactions(self):
        """Test admin transactions list endpoint"""
        if not self.admin_token:
            self.log_result("Admin Transactions List", False, "No admin token available")
            return False

        headers = {'Authorization': f'Bearer {self.admin_token}'}
        success, status_code, response = self.make_request('GET', 'admin/transactions', headers=headers, expected_status=200)
        
        if success and 'transactions' in response:
            transactions_count = len(response['transactions'])
            self.log_result("Admin Transactions List", True, f"Retrieved {transactions_count} transactions")
            return True
        else:
            self.log_result("Admin Transactions List", False, f"Status: {status_code}, Response: {response}")
            return False

    def test_membership_endpoints_user(self):
        """Test membership endpoints with user token"""
        if not self.user_token:
            self.log_result("User Membership Check", False, "No user token available")
            return False

        # Test get my membership
        headers = {'Authorization': f'Bearer {self.user_token}'}
        success, status_code, response = self.make_request('GET', 'memberships/my-membership', headers=headers, expected_status=200)
        
        if success:
            self.log_result("User Membership Check", True, f"Membership status: {response}")
            return True
        else:
            self.log_result("User Membership Check", False, f"Status: {status_code}, Response: {response}")
            return False

    def test_payment_history(self):
        """Test payment history endpoint"""
        if not self.user_token:
            self.log_result("Payment History", False, "No user token available")
            return False

        headers = {'Authorization': f'Bearer {self.user_token}'}
        success, status_code, response = self.make_request('GET', 'payments/history', headers=headers, expected_status=200)
        
        if success and 'transactions' in response:
            transactions_count = len(response['transactions'])
            self.log_result("Payment History", True, f"Retrieved {transactions_count} transactions")
            return True
        else:
            self.log_result("Payment History", False, f"Status: {status_code}, Response: {response}")
            return False

    def test_membership_create(self):
        """Test membership creation endpoint"""
        if not self.user_token:
            self.log_result("Membership Creation", False, "No user token available")
            return False

        membership_data = {
            "plan_name": "Basic",
            "plan_amount": 100
        }

        headers = {'Authorization': f'Bearer {self.user_token}'}
        success, status_code, response = self.make_request('POST', 'memberships/create', membership_data, headers=headers, expected_status=200)
        
        if success and 'membership_id' in response and 'razorpay_key' in response:
            self.log_result("Membership Creation", True, f"Membership created: {response}")
            return True
        else:
            # Check if user already has membership (400 error is expected in that case)
            if status_code == 400 and "already have an active membership" in str(response):
                self.log_result("Membership Creation", True, "User already has membership (expected)")
                return True
            else:
                self.log_result("Membership Creation", False, f"Status: {status_code}, Response: {response}")
                return False

    def test_csv_export(self):
        """Test CSV export endpoint"""
        if not self.admin_token:
            self.log_result("CSV Export", False, "No admin token available")
            return False

        headers = {'Authorization': f'Bearer {self.admin_token}'}
        
        try:
            response = requests.get(f"{self.api_url}/admin/export-csv", headers=headers, timeout=30)
            
            if response.status_code == 200 and 'text/csv' in response.headers.get('Content-Type', ''):
                self.log_result("CSV Export", True, f"CSV exported successfully, size: {len(response.content)} bytes")
                return True
            else:
                self.log_result("CSV Export", False, f"Status: {response.status_code}, Content-Type: {response.headers.get('Content-Type')}")
                return False
                
        except Exception as e:
            self.log_result("CSV Export", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Anjuman-e-Bagh-e-Zehra Backend API Tests")
        print("=" * 60)

        # Authentication tests
        print("\n📋 Testing Authentication...")
        self.test_user_registration()
        self.test_user_login()
        self.test_get_current_user()

        # User endpoints tests
        print("\n👤 Testing User Endpoints...")
        self.test_membership_endpoints_user()
        self.test_payment_history()
        self.test_membership_create()

        # Admin endpoints tests
        print("\n🔐 Testing Admin Endpoints...")
        self.test_admin_stats()
        self.test_admin_members()
        self.test_admin_transactions()
        self.test_csv_export()

        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    """Main test runner"""
    tester = FundraisingAPITester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())