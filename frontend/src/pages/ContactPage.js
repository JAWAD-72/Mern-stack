import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for your message! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 fade-in">
            <h1 className="font-cinzel text-5xl md:text-6xl font-bold tracking-tight text-gold-400 mb-6" data-testid="contact-heading">
              Contact Us
            </h1>
            <p className="font-manrope text-lg text-gray-400">We're here to answer your questions and assist you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="font-cinzel text-2xl font-semibold text-gold-300 mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="glass-card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg font-medium text-gold-200 mb-1">Email</h3>
                    <p className="font-manrope text-gray-400">info@anjumanbaghezehra.org</p>
                    <p className="font-manrope text-gray-400">support@anjumanbaghezehra.org</p>
                  </div>
                </div>

                <div className="glass-card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg font-medium text-gold-200 mb-1">Phone</h3>
                    <p className="font-manrope text-gray-400">+91 (123) 456-7890</p>
                    <p className="font-manrope text-gray-400">+91 (098) 765-4321</p>
                  </div>
                </div>

                <div className="glass-card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg font-medium text-gold-200 mb-1">Address</h3>
                    <p className="font-manrope text-gray-400">
                      Anjuman-e-Bagh-e-Zehra<br />
                      Community Center<br />
                      Your City, State - 123456<br />
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8">
              <h2 className="font-cinzel text-2xl font-semibold text-gold-300 mb-6">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="contact-form">
                <div>
                  <label htmlFor="name" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope"
                    placeholder="Your name"
                    data-testid="contact-name-input"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope"
                    placeholder="your@email.com"
                    data-testid="contact-email-input"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope"
                    placeholder="Message subject"
                    data-testid="contact-subject-input"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-manrope text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    required
                    className="w-full bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/50 transition-all duration-200 px-4 py-3 rounded-sm font-manrope resize-none"
                    placeholder="Your message..."
                    data-testid="contact-message-input"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-white font-cinzel tracking-widest uppercase text-sm py-3 rounded-sm"
                  data-testid="contact-submit-button"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
