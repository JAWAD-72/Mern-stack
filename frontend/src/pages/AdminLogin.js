import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = await login(email, password);
      
      if (userData.role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        return;
      }
      
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Admin login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-8 fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-400/10 mb-4">
              <Shield className="text-gold-400" size={40} />
            </div>
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold tracking-tight text-gold-400 mb-4" data-testid="admin-login-heading">
              Admin Access
            </h1>
            <p className="font-manrope text-base text-gray-400">Secure login for administrators only</p>
          </div>

          <div className="glass-card p-8 border-gold-400/20">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
              <div>
                <label htmlFor="email" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope"
                  placeholder="admin@email.com"
                  data-testid="admin-email-input"
                />
              </div>

              <div>
                <label htmlFor="password" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope"
                    placeholder="Enter admin password"
                    data-testid="admin-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gold-400"
                    data-testid="admin-toggle-password"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-white font-cinzel tracking-widest uppercase text-sm py-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="admin-login-submit-button"
              >
                {loading ? 'Logging in...' : 'Admin Login'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gold-400/5 border border-gold-400/20 rounded-sm">
              <p className="font-manrope text-xs text-gray-500 text-center">
                Demo Admin: Baqir@gmail.com / Baqir@123
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLogin;
