import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Heart, Users, TrendingUp, Shield } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-50"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1761639935382-43452f278898?crop=entropy&cs=srgb&fm=jpg&q=85')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050505]"></div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-4xl mx-auto fade-in">
            <div className="mb-6 inline-block">
              <span className="font-manrope text-gold-400 text-sm uppercase tracking-widest border border-gold-400/30 px-6 py-2 rounded-full">
                Ya Zahra (SA)
              </span>
            </div>
            <h1 className="font-cinzel text-5xl md:text-7xl font-bold tracking-tight text-gold-400 mb-6" data-testid="hero-heading">
              Anjuman-e-Bagh-e-Zehra
            </h1>
            <p className="font-manrope text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              Join our blessed community in supporting religious activities, charitable works, and spiritual gatherings. Your monthly contribution helps us serve the faith and community with dignity and devotion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/plans"
                className="btn-primary text-white font-cinzel tracking-widest uppercase text-sm px-10 py-4 rounded-sm"
                data-testid="hero-cta-button"
              >
                Become a Member
              </Link>
              <Link
                to="/about"
                className="bg-transparent border border-gold-600/50 text-gold-500 hover:bg-gold-900/20 font-cinzel tracking-widest uppercase text-sm px-10 py-4 rounded-sm transition-all duration-300"
                data-testid="hero-learn-more-button"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-cinzel text-4xl md:text-5xl font-semibold tracking-tight text-gold-300 mb-4">
              Why Join Us
            </h2>
            <p className="font-manrope text-lg text-gray-400">Be part of a blessed community dedicated to faith and service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-8 hover:border-gold-500/30 transition-all duration-500 group" data-testid="feature-card-charity">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center group-hover:bg-gold-400/20 transition-all">
                  <Heart className="text-gold-400" size={32} />
                </div>
              </div>
              <h3 className="font-cinzel text-xl font-medium text-gold-200 mb-3">Charitable Works</h3>
              <p className="font-manrope text-sm text-gray-400 leading-relaxed">
                Support food distribution, medical aid, and financial assistance to those in need within our community.
              </p>
            </div>

            <div className="glass-card p-8 hover:border-gold-500/30 transition-all duration-500 group" data-testid="feature-card-gatherings">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center group-hover:bg-gold-400/20 transition-all">
                  <Users className="text-gold-400" size={32} />
                </div>
              </div>
              <h3 className="font-cinzel text-xl font-medium text-gold-200 mb-3">Majlis & Gatherings</h3>
              <p className="font-manrope text-sm text-gray-400 leading-relaxed">
                Fund religious programs, Muharram commemorations, and spiritual gatherings throughout the year.
              </p>
            </div>

            <div className="glass-card p-8 hover:border-gold-500/30 transition-all duration-500 group" data-testid="feature-card-transparent">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center group-hover:bg-gold-400/20 transition-all">
                  <TrendingUp className="text-gold-400" size={32} />
                </div>
              </div>
              <h3 className="font-cinzel text-xl font-medium text-gold-200 mb-3">100% Transparent</h3>
              <p className="font-manrope text-sm text-gray-400 leading-relaxed">
                Track every contribution through your dashboard. Complete transparency in how funds are utilized.
              </p>
            </div>

            <div className="glass-card p-8 hover:border-gold-500/30 transition-all duration-500 group" data-testid="feature-card-secure">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center group-hover:bg-gold-400/20 transition-all">
                  <Shield className="text-gold-400" size={32} />
                </div>
              </div>
              <h3 className="font-cinzel text-xl font-medium text-gold-200 mb-3">Secure Payments</h3>
              <p className="font-manrope text-sm text-gray-400 leading-relaxed">
                Safe and secure auto-debit subscriptions through Razorpay. Cancel anytime from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-maroon-950/5 to-[#050505]"></div>
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-cinzel text-4xl md:text-5xl font-semibold tracking-tight text-gold-300 mb-6">
            Start Your Monthly Contribution
          </h2>
          <p className="font-manrope text-lg text-gray-400 leading-relaxed mb-8">
            Choose a membership plan that resonates with your heart. Every contribution, no matter the amount, makes a profound difference in our community's spiritual and charitable endeavors.
          </p>
          <Link
            to="/plans"
            className="btn-primary text-white font-cinzel tracking-widest uppercase text-sm px-12 py-4 rounded-sm inline-block"
            data-testid="cta-membership-button"
          >
            View Membership Plans
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
