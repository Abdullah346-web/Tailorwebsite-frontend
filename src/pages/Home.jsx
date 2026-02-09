import Hero from '../components/Hero';
import AnimatedDivider from '../components/AnimatedDivider';
import ServiceCard from '../components/ServiceCard';
import TeamCard from '../components/TeamCard';
import Button from '../components/Button';
import Gallery from '../components/Gallery';

const Home = () => {
  const services = [
    {
      icon: "👔",
      title: "Premium Suits",
      description: "Custom-tailored suits crafted with precision and premium fabrics for a perfect fit"
    },
    {
      icon: "👕",
      title: "Formal Shirts",
      description: "Elegant formal shirts designed for professional excellence and comfort"
    },
    {
      icon: "🥻",
      title: "Traditional Wear",
      description: "Kurta, Shalwar Kameez and traditional Pakistani attire with modern touch"
    },
    {
      icon: "✂️",
      title: "Expert Alterations",
      description: "Professional alterations and repairs to make your clothes fit perfectly"
    }
  ];

  const team = [
    {
      name: "Muhammad Bilal",
      role: "Master Tailor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      description: "20+ years of expertise in premium tailoring"
    },
    {
      name: "Ahmed Ali",
      role: "Senior Tailor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      description: "Specialist in wedding and formal attire"
    },
    {
      name: "Hassan Khan",
      role: "Design Consultant",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      description: "Expert in modern cuts and contemporary designs"
    },
    {
      name: "Usman Farooq",
      role: "Tailor",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
      description: "Precision stitching and attention to detail"
    }
  ];

  return (
    <div className="bg-black min-h-screen">
      <Hero />
      
      <AnimatedDivider />
      
      {/* Services Preview Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-gray-400 text-lg">Excellence in every stitch</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      <AnimatedDivider />

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Professional Team</h2>
            <p className="text-gray-400 text-lg">Expert craftsmen at your service</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <TeamCard key={index} {...member} />
            ))}
          </div>
        </div>
      </section>

      <AnimatedDivider />

      {/* Gallery Section */}
      <Gallery />

      {/* CTA Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-10">Book your appointment today and experience premium tailoring</p>
          <Button to="/contact" variant="primary">Contact Us</Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
