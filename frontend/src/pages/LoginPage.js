import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = await login(email, password);
      toast.success('Login successful!');
      
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const selectedPlan = location.state?.selectedPlan;
        if (selectedPlan) {
          navigate('/dashboard', { state: { selectedPlan } });
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
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
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold tracking-tight text-gold-400 mb-4" data-testid="login-heading">
              Welcome Back
            </h1>
            <p className="font-manrope text-base text-gray-400">Login to access your dashboard</p>
          </div>

          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
              <div>
                <label htmlFor="email" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope"
                  placeholder="your@email.com"
                  data-testid="email-input"
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
                    placeholder="Enter your password"
                    data-testid="password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gold-400"
                    data-testid="toggle-password"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-white font-cinzel tracking-widest uppercase text-sm py-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="login-submit-button"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-manrope text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-gold-400 hover:text-gold-300 transition-colors" data-testid="register-link">
                  Register here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link to="/admin/login" className="font-manrope text-sm text-gray-500 hover:text-gold-400 transition-colors" data-testid="admin-login-link">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
