import ServiceCard from '../components/ServiceCard';
import AnimatedDivider from '../components/AnimatedDivider';

const Services = () => {
  const services = [
    {
      icon: "👔",
      title: "Premium Suit Stitching",
      description: "Custom-made suits with premium fabrics, perfect fitting, and attention to every detail for a distinguished look"
    },
    {
      icon: "🤵",
      title: "Wedding Suits & Sherwani",
      description: "Special occasion attire designed to make your big day unforgettable with elegant designs and premium quality"
    },
    {
      icon: "👕",
      title: "Formal Shirts",
      description: "Premium quality formal shirts with perfect collar and cuff styling for professional excellence"
    },
    {
      icon: "👔",
      title: "Casual Wear",
      description: "Comfortable and stylish casual shirts and pants for everyday wear with modern cuts"
    },
    {
      icon: "🥻",
      title: "Kurta Shalwar",
      description: "Traditional Pakistani wear with contemporary designs and comfortable fabrics"
    },
    {
      icon: "👘",
      title: "Waistcoats",
      description: "Elegant waistcoats to complement your formal and semi-formal outfits"
    },
    {
      icon: "👖",
      title: "Pants & Trousers",
      description: "Custom-fitted pants with various styles including formal, casual, and traditional"
    },
    {
      icon: "✂️",
      title: "Alterations & Repairs",
      description: "Expert alterations and repairs to make your existing clothes fit perfectly"
    }
  ];

  return (
    <div className="bg-black min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Our Tailoring Services
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Comprehensive tailoring solutions for every occasion
          </p>
        </div>
      </section>

      <AnimatedDivider />

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      <AnimatedDivider />

      {/* Process Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gray-900 border-2 border-yellow-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-yellow-500 group-hover:shadow-lg group-hover:shadow-yellow-500/20 transition-all duration-300">
                <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Consultation</h3>
              <p className="text-gray-400">Discuss your requirements and preferences with our experts</p>
            </div>
            <div className="text-center group">
              <div className="bg-gray-900 border-2 border-yellow-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-yellow-500 group-hover:shadow-lg group-hover:shadow-yellow-500/20 transition-all duration-300">
                <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Measurement</h3>
              <p className="text-gray-400">Precise measurements taken for perfect fit and comfort</p>
            </div>
            <div className="text-center group">
              <div className="bg-gray-900 border-2 border-yellow-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-yellow-500 group-hover:shadow-lg group-hover:shadow-yellow-500/20 transition-all duration-300">
                <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Crafting</h3>
              <p className="text-gray-400">Expert tailoring with premium materials and attention to detail</p>
            </div>
            <div className="text-center group">
              <div className="bg-gray-900 border-2 border-yellow-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-yellow-500 group-hover:shadow-lg group-hover:shadow-yellow-500/20 transition-all duration-300">
                <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">4</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Delivery</h3>
              <p className="text-gray-400">Final fitting and quality check before delivery</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
