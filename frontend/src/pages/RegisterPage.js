import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.phone, formData.password);
      toast.success('Registration successful! Welcome to our community.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed. Please try again.');
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
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold tracking-tight text-gold-400 mb-4" data-testid="register-heading">
              Join Our Community
            </h1>
            <p className="font-manrope text-base text-gray-400">Create an account to become a member</p>
          </div>

          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-5" data-testid="register-form">
              <div>
                <label htmlFor="name" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope"
                  placeholder="Your full name"
                  data-testid="name-input"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope"
                  placeholder="your@email.com"
                  data-testid="email-input"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope"
                  placeholder="10-digit phone number"
                  data-testid="phone-input"
                />
              </div>

              <div>
                <label htmlFor="password" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope"
                    placeholder="At least 6 characters"
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

              <div>
                <label htmlFor="confirmPassword" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope"
                  placeholder="Re-enter password"
                  data-testid="confirm-password-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-white font-cinzel tracking-widest uppercase text-sm py-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="register-submit-button"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-manrope text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-gold-400 hover:text-gold-300 transition-colors" data-testid="login-link">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
