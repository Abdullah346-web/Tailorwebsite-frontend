import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import ImageCard from './ImageCard';
import bridalElegance from '../assets/bridal elegance.jpeg';
import eveningGown from '../assets/gown.jpeg';
import doriPipen from '../assets/dori pipen.jpeg';
import simpleStyle from '../assets/simple.jpeg';
import formalAttire from '../assets/formal attire.jpeg';
import bridalMaxi from '../assets/bridal maxi.jpeg';
import customDesign from '../assets/custom designs.jpeg';
import weddingLuxe from '../assets/wedding luxe.jpeg';
import sariBiouse from '../assets/sari blouse.jpeg';
import kidsWear from '../assets/kids wear.jpeg';
import silkSuits from '../assets/silk suits.jpeg';
import alterations from '../assets/alterations.png';

const Gallery = () => {
  const [ref, isVisible] = useIntersectionObserver();
  // Gallery images - 12 cards
  const galleryImages = [
    {
      image: bridalElegance,
      name: "Bridal Elegance"
    },
    {
      image: eveningGown,
      name: "Evening Gown"
    },
    {
      image: doriPipen,
      name: "Dori Pipen Dress"
    },
    {
      image: simpleStyle,
      name: "Simple Suits"
    },
    {
      image: formalAttire,
      name: "Formal Attire"
    },
    {
      image: bridalMaxi,
      name: "Bridal Maxi"
    },
    {
      image: customDesign,
      name: "Custom Design"
    },
    {
      image: weddingLuxe,
      name: "Wedding Luxe"
    },
    {
      image: sariBiouse,
      name: "Sari Blouse"
    },
    {
      image: kidsWear,
      name: "Kids Wear"
    },
    {
      image: silkSuits,
      name: "Silk Suits"
    },
    {
      image: alterations,
      name: "Alterations"
    }
  ];

  return (
    <section id="gallery" className="relative py-24 bg-[#0b0b12] overflow-hidden" ref={ref}>
      {/* Premium Background Glow Effects */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px]"></div>

      {/* Section Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <p className="text-xs uppercase tracking-[0.35em] text-purple-200/80">Gallery</p>
          <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">Our Custom Designs & Creations</h2>
        </div>

        {/* Gallery Grid - 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {galleryImages.map((item, index) => (
            <div key={index} className={`${isVisible ? 'animate-fade-in-up animate-stagger-' + ((index % 5) + 1) : 'opacity-0'}`}>
              <ImageCard
                image={item.image}
                name={item.name}
                delay={index * 80} // Staggered animation
              />
            </div>
          ))}
        </div>

        {/* Bottom Accent */}
        <div className={`mt-20 text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={isVisible ? { animationDelay: '0.5s' } : {}}>
          <p className="text-gray-500 text-base md:text-lg font-light italic">
            Each piece crafted with precision, passion, and perfection
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500/60 animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500/60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
