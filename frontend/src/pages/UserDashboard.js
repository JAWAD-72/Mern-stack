import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { CreditCard, Calendar, TrendingUp, AlertCircle, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UserDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [membership, setMembership] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);

  const plans = [
    { name: 'Basic', amount: 100 },
    { name: 'Supporter', amount: 200 },
    { name: 'Patron', amount: 500 },
    { name: 'Guardian', amount: 1000 },
  ];

  useEffect(() => {
    fetchDashboardData();
    
    // Check if redirected with selected plan
    if (location.state?.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
      setShowPlanModal(true);
    }
  }, [location]);

  const fetchDashboardData = async () => {
    try {
      const [membershipRes, transactionsRes] = await Promise.all([
        axios.get(`${API}/memberships/my-membership`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/payments/history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setMembership(membershipRes.data.membership);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    setProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setProcessing(false);
        return;
      }

      // Create membership in backend
      const response = await axios.post(
        `${API}/memberships/create`,
        {
          plan_name: selectedPlan.name,
          plan_amount: selectedPlan.amount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { membership_id, razorpay_key, plan_name, amount } = response.data;

      // Initialize Razorpay
      const options = {
        key: razorpay_key,
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Anjuman-e-Bagh-e-Zehra',
        description: `${plan_name} Membership`,
        image: 'https://images.unsplash.com/photo-1761639935382-43452f278898?w=200',
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: '#D4AF37',
        },
        handler: async function (response) {
          // Payment successful, confirm membership
          try {
            await axios.post(
              `${API}/memberships/confirm`,
              {
                subscription_id: response.razorpay_payment_id,
                payment_id: response.razorpay_payment_id,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            toast.success('Membership activated successfully!');
            setShowPlanModal(false);
            setSelectedPlan(null);
            fetchDashboardData();
          } catch (error) {
            toast.error('Payment received but activation failed. Please contact support.');
            console.error(error);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to initiate subscription');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelMembership = async () => {
    if (!window.confirm('Are you sure you want to cancel your membership?')) {
      return;
    }

    try {
      await axios.post(
        `${API}/memberships/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Membership cancelled successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to cancel membership');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-gold-400 font-cinzel text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-gold-400 mb-2" data-testid="user-dashboard-heading">
              My Dashboard
            </h1>
            <p className="font-manrope text-gray-400">Welcome back, {user?.name}</p>
          </div>

          {/* Membership Status */}
          {membership ? (
            <div className="glass-card p-8 mb-8" data-testid="membership-card">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="font-cinzel text-2xl font-semibold text-gold-300 mb-2">
                    Current Membership
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="font-cinzel text-3xl font-bold text-gold-400">
                      {membership.plan_name}
                    </span>
                    <span
                      className={`font-manrope text-xs px-3 py-1 rounded-full ${
                        membership.status === 'active'
                          ? 'bg-green-900/30 text-green-400'
                          : membership.status === 'pending'
                          ? 'bg-yellow-900/30 text-yellow-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}
                    >
                      {membership.status}
                    </span>
                  </div>
                </div>

                {membership.status === 'active' && (
                  <button
                    onClick={handleCancelMembership}
                    className="bg-red-900/20 border border-red-900/50 text-red-400 hover:bg-red-900/40 font-manrope text-sm px-6 py-2 rounded-sm transition-all"
                    data-testid="cancel-membership-button"
                  >
                    Cancel Membership
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center">
                    <CreditCard className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <div className="font-manrope text-sm text-gray-500">Monthly Amount</div>
                    <div className="font-cinzel text-xl font-semibold text-gold-400">
                      ₹{membership.plan_amount}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center">
                    <Calendar className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <div className="font-manrope text-sm text-gray-500">Start Date</div>
                    <div className="font-manrope text-base font-semibold text-gray-300">
                      {new Date(membership.start_date).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center">
                    <TrendingUp className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <div className="font-manrope text-sm text-gray-500">Subscription ID</div>
                    <div className="font-manrope text-xs text-gray-400 truncate max-w-[150px]">
                      {membership.razorpay_subscription_id || 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 mb-8 text-center" data-testid="no-membership-card">
              <AlertCircle className="text-gold-400 mx-auto mb-4" size={48} />
              <h2 className="font-cinzel text-2xl font-semibold text-gold-300 mb-2">
                No Active Membership
              </h2>
              <p className="font-manrope text-gray-400 mb-6">
                Select a plan to start supporting our community
              </p>
              <button
                onClick={() => navigate('/plans')}
                className="btn-primary text-white font-cinzel tracking-widest uppercase text-sm px-8 py-3 rounded-sm"
                data-testid="view-plans-button"
              >
                View Plans
              </button>
            </div>
          )}

          {/* Payment History */}
          <div className="glass-card p-8" data-testid="payment-history-section">
            <h2 className="font-cinzel text-2xl font-semibold text-gold-300 mb-6">
              Payment History
            </h2>

            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Date</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Amount</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Status</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Payment ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="font-manrope text-gray-300 py-3 px-4">
                          {new Date(transaction.payment_date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="font-manrope text-gold-400 py-3 px-4">
                          ₹{transaction.amount}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-manrope text-xs px-3 py-1 rounded-full ${
                              transaction.payment_status === 'success'
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-red-900/30 text-red-400'
                            }`}
                          >
                            {transaction.payment_status}
                          </span>
                        </td>
                        <td className="font-manrope text-gray-500 text-xs py-3 px-4 truncate max-w-xs">
                          {transaction.razorpay_payment_id || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="font-manrope text-gray-500">No payment history available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plan Selection Modal */}
      {showPlanModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6" data-testid="plan-modal">
          <div className="glass-card max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setShowPlanModal(false);
                setSelectedPlan(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gold-400"
              data-testid="close-modal-button"
            >
              <X size={24} />
            </button>

            <h3 className="font-cinzel text-2xl font-bold text-gold-400 mb-4">
              Confirm Subscription
            </h3>

            <div className="mb-6">
              <p className="font-manrope text-gray-400 mb-2">Selected Plan:</p>
              <p className="font-cinzel text-3xl font-bold text-gold-400">{selectedPlan.name}</p>
              <p className="font-manrope text-lg text-gray-300 mt-2">
                ₹{selectedPlan.amount} / month
              </p>
            </div>

            <div className="bg-gold-400/5 border border-gold-400/20 rounded-sm p-4 mb-6">
              <p className="font-manrope text-sm text-gray-400">
                This is a recurring monthly subscription. You will be charged ₹{selectedPlan.amount} every month automatically. You can cancel anytime from your dashboard.
              </p>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={processing}
              className="w-full btn-primary text-white font-cinzel tracking-widest uppercase text-sm py-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="subscribe-button"
            >
              {processing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserDashboard;
