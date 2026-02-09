import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import TeamSection from './TeamSection';
import zulfiqarImg from '../assets/zulfiqar.jpeg';

const About = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div className="bg-[#0b0b12]">
      {/* Owner Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900/50 to-[#0b0b12]" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Owner Image */}
            <div className={`relative group ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gray-900 rounded-2xl p-2 border border-purple-500/20">
                <img 
                  src={zulfiqarImg} 
                  alt="Owner"
                  className="rounded-xl w-full object-cover object-top h-[500px]"
                />
              </div>
            </div>

            {/* Owner Info */}
            <div className={`space-y-6 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-white">Meet the Owner</h2>
              <h3 className="text-2xl text-violet-400 font-semibold">Muhammad Zulfiqar - Founder & Master Tailor</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                With over 20 years of experience in the tailoring industry, Muhammad Zulfiqar founded 
                BISMILLAH TAILORS in 2004 with a vision to provide premium quality stitching services 
                with perfection and trust.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                His dedication to craftsmanship and customer satisfaction has made BISMILLAH TAILORS 
                a trusted name in Karachi. Every garment is treated with the utmost care and attention 
                to detail, ensuring that our clients always look their best.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="bg-gray-800 border border-purple-500/20 rounded-lg p-4 flex-1">
                  <p className="text-3xl font-bold text-violet-400">20+</p>
                  <p className="text-gray-400">Years Experience</p>
                </div>
                <div className="bg-gray-800 border border-purple-500/20 rounded-lg p-4 flex-1">
                  <p className="text-3xl font-bold text-violet-400">500+</p>
                  <p className="text-gray-400">Happy Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TeamSection />
    </div>
  );
};

export default About;
