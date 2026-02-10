import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/90 border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-cinzel text-xl font-bold text-gold-400 mb-4">
              Anjuman-e-Bagh-e-Zehra
            </h3>
            <p className="text-gray-400 font-manrope leading-relaxed">
              Supporting our community through faith, charity, and unity. Every contribution helps us serve better.
            </p>
          </div>

          <div>
            <h4 className="font-cinzel text-lg font-semibold text-gold-300 mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-400 hover:text-gold-400 transition-colors font-manrope">
                Home
              </Link>
              <Link to="/about" className="text-gray-400 hover:text-gold-400 transition-colors font-manrope">
                About Us
              </Link>
              <Link to="/plans" className="text-gray-400 hover:text-gold-400 transition-colors font-manrope">
                Membership Plans
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-gold-400 transition-colors font-manrope">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-cinzel text-lg font-semibold text-gold-300 mb-4">Contact Info</h4>
            <div className="flex flex-col gap-2 text-gray-400 font-manrope">
              <p>Email: info@anjumanbaghezehra.org</p>
              <p>Phone: +91 (123) 456-7890</p>
              <p>Address: Your City, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 text-center">
          <p className="text-gray-500 font-manrope flex items-center justify-center gap-2">
            Made with <Heart size={16} className="text-maroon-600" fill="currentColor" /> for the community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
