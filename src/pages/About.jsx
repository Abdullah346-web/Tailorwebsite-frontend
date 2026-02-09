import AnimatedDivider from '../components/AnimatedDivider';
import TeamCard from '../components/TeamCard';

const About = () => {
  const team = [
    {
      name: "Muhammad Bilal",
      role: "Master Tailor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      description: "20+ years of expertise in premium tailoring and custom suits"
    },
    {
      name: "Ahmed Ali",
      role: "Senior Tailor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      description: "Specialist in wedding attire and formal wear with 15 years experience"
    },
    {
      name: "Hassan Khan",
      role: "Design Consultant",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      description: "Expert in modern cuts, contemporary designs and fabric selection"
    },
    {
      name: "Usman Farooq",
      role: "Tailor",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
      description: "Precision stitching specialist with attention to every detail"
    }
  ];

  return (
    <div className="bg-black min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              About Us
            </span>
          </h1>
          <p className="text-xl text-gray-400">Crafting excellence since 2004</p>
        </div>
      </section>

      <AnimatedDivider />

      {/* Owner Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Owner Image */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gray-900 rounded-2xl p-2 border border-yellow-500/20">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600" 
                  alt="Owner"
                  className="rounded-xl w-full object-cover h-[500px]"
                />
              </div>
            </div>

            {/* Owner Info */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Meet the Owner</h2>
              <h3 className="text-2xl text-yellow-400 font-semibold">Muhammad Bilal - Founder & Master Tailor</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                With over 20 years of experience in the tailoring industry, Muhammad Bilal founded 
                BISMILLAH TAILORS in 2004 with a vision to provide premium quality stitching services 
                with perfection and trust.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                His dedication to craftsmanship and customer satisfaction has made BISMILLAH TAILORS 
                a trusted name in Karachi. Every garment is treated with the utmost care and attention 
                to detail, ensuring that our clients always look their best.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="bg-gray-800 border border-yellow-500/20 rounded-lg p-4 flex-1">
                  <p className="text-3xl font-bold text-yellow-400">20+</p>
                  <p className="text-gray-400">Years Experience</p>
                </div>
                <div className="bg-gray-800 border border-yellow-500/20 rounded-lg p-4 flex-1">
                  <p className="text-3xl font-bold text-yellow-400">5000+</p>
                  <p className="text-gray-400">Happy Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatedDivider />

      {/* Team Members Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Professional Team</h2>
            <p className="text-gray-400 text-lg">Expert craftsmen dedicated to excellence</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <TeamCard key={index} {...member} />
            ))}
          </div>
        </div>
      </section>

      <AnimatedDivider />

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl text-center hover:border-yellow-500/50 transition-all duration-300 group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⭐</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">Quality</h3>
              <p className="text-gray-400">
                We never compromise on the quality of materials or craftsmanship
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl text-center hover:border-yellow-500/50 transition-all duration-300 group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🤝</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">Trust</h3>
              <p className="text-gray-400">
                Building lasting relationships through honest and reliable service
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl text-center hover:border-yellow-500/50 transition-all duration-300 group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">💎</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">Excellence</h3>
              <p className="text-gray-400">
                Striving for perfection in every stitch and every detail
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
