import { useState, useEffect, useRef } from 'react';

const ImageCard = ({ image, name, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-xl transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Gradient Border Wrapper */}
      <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-purple-500/60 group-hover:via-blue-500/60 group-hover:to-purple-500/60 transition-all duration-500">
        
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#0b0b12]/80">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900/50 to-blue-900/20 animate-pulse"></div>
          )}

          {/* Actual Image */}
          <img
            src={image}
            alt={name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-[1.08]`}
          />

          {/* Premium Gradient Overlay - appears on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Outer Glow Effect */}
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600/0 via-blue-500/0 to-purple-600/0 group-hover:from-purple-600/40 group-hover:via-blue-500/40 group-hover:to-purple-600/40 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

          {/* Sparkle Icon - top right */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/60 backdrop-blur-sm">
              <span className="text-white text-base">✨</span>
            </div>
          </div>

          {/* Name Overlay - bottom with elegant typography */}
          {name && (
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-all duration-500">
              <h3 className="text-white font-bold text-xl tracking-wide text-center drop-shadow-2xl uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
                {name}
              </h3>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-2"></div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Shadow Effect */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-gradient-to-r from-purple-600/0 via-purple-600/40 to-purple-600/0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default ImageCard;
