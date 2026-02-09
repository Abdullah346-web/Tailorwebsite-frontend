import Button from './Button';
import bridalImage from '../assets/bridal.webp';

const Hero = () => {
  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#0b0b12] pt-32 pb-20 overflow-hidden">
      {/* Background Gradient Glow */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-violet-500 to-blue-500 bg-clip-text text-transparent">
                Welcome to
              </span>
              <span className="block text-white mt-2">BISMILLAH TAILORS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400">
              Premium stitching with perfection & trust
            </p>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => handleScrollToSection('services')}
                className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-400 hover:to-blue-400 shadow-lg shadow-purple-500/40"
              >
                Our Services
              </button>
              <button 
                onClick={() => handleScrollToSection('gallery')}
                className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border-2 border-purple-500 text-violet-400 hover:bg-purple-500/10 hover:border-violet-400"
              >
                View Gallery
              </button>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-gray-900 rounded-2xl p-2 border border-purple-500/20">
              <img 
                src={bridalImage}
                alt="Bridal outfit showcase"
                className="rounded-xl w-full object-cover h-96 md:h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
