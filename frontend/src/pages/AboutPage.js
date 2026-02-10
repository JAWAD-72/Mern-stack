import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 fade-in">
            <h1 className="font-cinzel text-5xl md:text-6xl font-bold tracking-tight text-gold-400 mb-6" data-testid="about-heading">
              About Anjuman-e-Bagh-e-Zehra
            </h1>
            <div className="w-24 h-1 bg-gold-400 mx-auto mb-8"></div>
          </div>

          <div className="glass-card p-8 md:p-12 mb-8">
            <div className="prose prose-invert max-w-none">
              <p className="font-manrope text-lg text-gray-300 leading-relaxed mb-6">
                Anjuman-e-Bagh-e-Zehra is a religious organization dedicated to serving the Shia Muslim community through faith, charity, and unity. Named in honor of Bibi Fatima Zahra (SA), our organization carries forward the blessed legacy of compassion, service, and devotion.
              </p>

              <h2 className="font-cinzel text-2xl md:text-3xl font-medium text-gold-200 mb-4 mt-12">
                Our Mission
              </h2>
              <p className="font-manrope text-base text-gray-400 leading-relaxed mb-6">
                We strive to create a supportive and spiritually enriching environment for our community members. Through regular religious gatherings, charitable activities, and educational programs, we aim to strengthen faith and foster unity among believers.
              </p>

              <h2 className="font-cinzel text-2xl md:text-3xl font-medium text-gold-200 mb-4 mt-12">
                What We Do
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gold-400 mt-2"></div>
                  <p className="font-manrope text-base text-gray-400 leading-relaxed">
                    <strong className="text-gold-300">Religious Programs:</strong> Organize Majlis, Milad, and commemorations of Muharram and other significant Islamic events.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gold-400 mt-2"></div>
                  <p className="font-manrope text-base text-gray-400 leading-relaxed">
                    <strong className="text-gold-300">Charitable Services:</strong> Provide food, medical assistance, and financial support to underprivileged community members.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gold-400 mt-2"></div>
                  <p className="font-manrope text-base text-gray-400 leading-relaxed">
                    <strong className="text-gold-300">Educational Initiatives:</strong> Conduct Islamic education classes for children and adults to strengthen understanding of faith.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gold-400 mt-2"></div>
                  <p className="font-manrope text-base text-gray-400 leading-relaxed">
                    <strong className="text-gold-300">Community Support:</strong> Create a network of mutual assistance and brotherhood among community members.
                  </p>
                </div>
              </div>

              <h2 className="font-cinzel text-2xl md:text-3xl font-medium text-gold-200 mb-4 mt-12">
                Why Your Support Matters
              </h2>
              <p className="font-manrope text-base text-gray-400 leading-relaxed mb-6">
                Your monthly contribution is an act of Sadaqah Jariyah (continuous charity) that benefits the entire community. Every rupee donated helps us maintain our religious spaces, support those in need, and keep our spiritual traditions alive for future generations.
              </p>

              <div className="mt-12 p-6 bg-maroon-950/20 border border-maroon-800/30 rounded-lg">
                <p className="font-cinzel text-lg text-gold-300 text-center italic">
                  "The best of people are those who are most beneficial to people."
                  <span className="block text-sm text-gray-500 mt-2">- Prophet Muhammad (SAWW)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
