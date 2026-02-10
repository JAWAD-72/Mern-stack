import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const plans = [
  {
    name: 'Basic',
    amount: 100,
    description: 'Support essential community services',
    features: [
      'Monthly contribution of ₹100',
      'Support charitable activities',
      'Access to community events',
      'Monthly newsletter',
    ],
  },
  {
    name: 'Supporter',
    amount: 200,
    description: 'Enhanced support for religious programs',
    features: [
      'Monthly contribution of ₹200',
      'Support religious gatherings',
      'Priority event notifications',
      'Recognition in annual report',
      'All Basic benefits',
    ],
    popular: true,
  },
  {
    name: 'Patron',
    amount: 500,
    description: 'Significant impact on community welfare',
    features: [
      'Monthly contribution of ₹500',
      'Major program sponsorship',
      'Special invitations to events',
      'Personalized impact reports',
      'All Supporter benefits',
    ],
  },
  {
    name: 'Guardian',
    amount: 1000,
    description: 'Leading the path of community service',
    features: [
      'Monthly contribution of ₹1000',
      'Premium event access',
      'Direct consultation opportunities',
      'Legacy donor recognition',
      'All Patron benefits',
    ],
  },
];

const MembershipPlansPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    if (!user) {
      toast.info('Please login to select a membership plan');
      navigate('/login', { state: { selectedPlan: plan } });
      return;
    }

    if (user.role === 'admin') {
      toast.error('Admin accounts cannot purchase memberships');
      return;
    }

    navigate('/dashboard', { state: { selectedPlan: plan } });
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 fade-in">
            <h1 className="font-cinzel text-5xl md:text-6xl font-bold tracking-tight text-gold-400 mb-6" data-testid="plans-heading">
              Membership Plans
            </h1>
            <p className="font-manrope text-lg text-gray-400 max-w-2xl mx-auto">
              Choose a plan that resonates with your commitment to community service. All contributions are tax-deductible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`flex flex-col bg-gradient-to-b from-gray-900 to-black border ${
                  plan.popular ? 'border-gold-400/40' : 'border-gold-600/20'
                } p-8 rounded-lg hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.15)] relative`}
                data-testid={`plan-card-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gold-400 text-black font-cinzel text-xs uppercase tracking-wider px-4 py-1 rounded-full font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-cinzel text-2xl font-semibold text-gold-300 mb-2">{plan.name}</h3>
                  <p className="font-manrope text-sm text-gray-500">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-cinzel text-5xl font-bold text-gold-400">₹{plan.amount}</span>
                    <span className="font-manrope text-gray-500">/month</span>
                  </div>
                </div>

                <ul className="flex-grow space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="text-green-500 flex-shrink-0 mt-1" size={18} />
                      <span className="font-manrope text-sm text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full font-cinzel tracking-widest uppercase text-sm py-3 rounded-sm transition-all duration-300 ${
                    plan.popular
                      ? 'btn-primary text-white'
                      : 'bg-transparent border border-gold-600/50 text-gold-500 hover:bg-gold-900/20'
                  }`}
                  data-testid={`select-plan-${plan.name.toLowerCase()}`}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>

          <div className="mt-16 glass-card p-8 max-w-3xl mx-auto">
            <h3 className="font-cinzel text-xl font-semibold text-gold-300 mb-4">Important Information</h3>
            <ul className="space-y-3 font-manrope text-sm text-gray-400">
              <li className="flex gap-3">
                <span className="text-gold-400">•</span>
                <span>All memberships are auto-renewed monthly through secure Razorpay subscriptions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold-400">•</span>
                <span>You can cancel your membership anytime from your dashboard</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold-400">•</span>
                <span>100% of your contribution goes towards community service and religious activities</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold-400">•</span>
                <span>Payment receipts and history available in your dashboard</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MembershipPlansPage;
