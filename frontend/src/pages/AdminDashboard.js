import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Users, TrendingUp, DollarSign, UserCheck, UserX, Download, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, membersRes, transactionsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/admin/members`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/admin/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats(statsRes.data);
      setMembers(membersRes.data.members);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.get(`${API}/admin/export-csv`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'members_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-gold-400 mb-2" data-testid="admin-dashboard-heading">
                Admin Dashboard
              </h1>
              <p className="font-manrope text-gray-400">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-transparent border border-red-600/50 text-red-400 hover:bg-red-900/20 font-manrope px-6 py-2 rounded-sm transition-all"
              data-testid="admin-logout-button"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div className="glass-card p-6" data-testid="stat-total-members">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-gold-400" size={32} />
              </div>
              <div className="font-cinzel text-3xl font-bold text-gold-400 mb-1">
                {stats?.total_members || 0}
              </div>
              <div className="font-manrope text-sm text-gray-400">Total Members</div>
            </div>

            <div className="glass-card p-6" data-testid="stat-monthly-recurring">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="text-green-500" size={32} />
              </div>
              <div className="font-cinzel text-3xl font-bold text-gold-400 mb-1">
                ₹{stats?.total_monthly_recurring || 0}
              </div>
              <div className="font-manrope text-sm text-gray-400">Monthly Recurring</div>
            </div>

            <div className="glass-card p-6" data-testid="stat-lifetime-funds">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="text-gold-400" size={32} />
              </div>
              <div className="font-cinzel text-3xl font-bold text-gold-400 mb-1">
                ₹{stats?.total_lifetime_funds || 0}
              </div>
              <div className="font-manrope text-sm text-gray-400">Lifetime Funds</div>
            </div>

            <div className="glass-card p-6" data-testid="stat-active-memberships">
              <div className="flex items-center justify-between mb-4">
                <UserCheck className="text-green-500" size={32} />
              </div>
              <div className="font-cinzel text-3xl font-bold text-gold-400 mb-1">
                {stats?.active_memberships || 0}
              </div>
              <div className="font-manrope text-sm text-gray-400">Active</div>
            </div>

            <div className="glass-card p-6" data-testid="stat-cancelled-memberships">
              <div className="flex items-center justify-between mb-4">
                <UserX className="text-red-500" size={32} />
              </div>
              <div className="font-cinzel text-3xl font-bold text-gold-400 mb-1">
                {stats?.cancelled_memberships || 0}
              </div>
              <div className="font-manrope text-sm text-gray-400">Cancelled</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/10">
            <button
              onClick={() => setActiveTab('overview')}
              className={`font-cinzel pb-4 px-2 transition-colors ${
                activeTab === 'overview'
                  ? 'text-gold-400 border-b-2 border-gold-400'
                  : 'text-gray-500 hover:text-gold-400'
              }`}
              data-testid="tab-overview"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`font-cinzel pb-4 px-2 transition-colors ${
                activeTab === 'members'
                  ? 'text-gold-400 border-b-2 border-gold-400'
                  : 'text-gray-500 hover:text-gold-400'
              }`}
              data-testid="tab-members"
            >
              Members
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`font-cinzel pb-4 px-2 transition-colors ${
                activeTab === 'transactions'
                  ? 'text-gold-400 border-b-2 border-gold-400'
                  : 'text-gray-500 hover:text-gold-400'
              }`}
              data-testid="tab-transactions"
            >
              Transactions
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="glass-card p-8" data-testid="overview-section">
              <h2 className="font-cinzel text-2xl font-semibold text-gold-300 mb-6">Dashboard Overview</h2>
              <div className="space-y-4 font-manrope text-gray-400">
                <p>Total registered members: <span className="text-gold-400 font-semibold">{stats?.total_members}</span></p>
                <p>Active subscriptions: <span className="text-green-500 font-semibold">{stats?.active_memberships}</span></p>
                <p>Monthly recurring revenue: <span className="text-gold-400 font-semibold">₹{stats?.total_monthly_recurring}</span></p>
                <p>Total funds collected: <span className="text-gold-400 font-semibold">₹{stats?.total_lifetime_funds}</span></p>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="glass-card p-8" data-testid="members-section">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-cinzel text-2xl font-semibold text-gold-300">Members List</h2>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 btn-primary text-white font-manrope text-sm px-6 py-2 rounded-sm"
                  data-testid="export-csv-button"
                >
                  <Download size={18} />
                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Name</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Email</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Phone</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Plan</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Amount</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="font-manrope text-gray-300 py-3 px-4">{member.name}</td>
                        <td className="font-manrope text-gray-400 py-3 px-4">{member.email}</td>
                        <td className="font-manrope text-gray-400 py-3 px-4">{member.phone}</td>
                        <td className="font-manrope text-gray-300 py-3 px-4">
                          {member.membership?.plan_name || 'N/A'}
                        </td>
                        <td className="font-manrope text-gold-400 py-3 px-4">
                          {member.membership ? `₹${member.membership.plan_amount}` : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {member.membership ? (
                            <span
                              className={`font-manrope text-xs px-3 py-1 rounded-full ${
                                member.membership.status === 'active'
                                  ? 'bg-green-900/30 text-green-400'
                                  : member.membership.status === 'pending'
                                  ? 'bg-yellow-900/30 text-yellow-400'
                                  : 'bg-red-900/30 text-red-400'
                              }`}
                            >
                              {member.membership.status}
                            </span>
                          ) : (
                            <span className="font-manrope text-gray-500 text-xs">No membership</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="glass-card p-8" data-testid="transactions-section">
              <h2 className="font-cinzel text-2xl font-semibold text-gold-300 mb-6">Transaction History</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Member</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Email</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Amount</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Status</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Date</th>
                      <th className="text-left font-cinzel text-gold-300 py-3 px-4">Payment ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="font-manrope text-gray-300 py-3 px-4">
                          {transaction.user_name || 'N/A'}
                        </td>
                        <td className="font-manrope text-gray-400 py-3 px-4">
                          {transaction.user_email || 'N/A'}
                        </td>
                        <td className="font-manrope text-gold-400 py-3 px-4">₹{transaction.amount}</td>
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
                        <td className="font-manrope text-gray-400 py-3 px-4">
                          {new Date(transaction.payment_date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="font-manrope text-gray-500 text-xs py-3 px-4">
                          {transaction.razorpay_payment_id || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
