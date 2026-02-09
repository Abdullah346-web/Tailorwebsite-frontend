import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import AnimatedDivider from '../components/AnimatedDivider';

const Contact = () => {
  const [formRef, isFormVisible] = useIntersectionObserver();
  const [cardsRef, isCardsVisible] = useIntersectionObserver();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact Form Data:', formData);
    alert('Message sent successfully! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="bg-black min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 relative overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            We'd love to hear from you
          </p>
        </div>
      </section>

      <AnimatedDivider />

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black" ref={formRef}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`relative group ${isFormVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            {/* Gradient Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-gray-900 border border-yellow-500/20 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none resize-none"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-4 rounded-lg font-bold text-lg hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/30"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <AnimatedDivider />

      {/* Contact Information */}
      <section className="py-20 bg-black" ref={cardsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`bg-gray-900 border border-gray-800 p-6 rounded-lg hover:border-yellow-500/50 transition-all group overflow-hidden ${isCardsVisible ? 'animate-fade-in-up animate-stagger-1' : 'opacity-0'}`}>
              <div className="flex items-start">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">📍</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">Address</h3>
                  <p className="text-gray-400">
                    Shop 15, Main Market<br />
                    Tariq Road, Karachi<br />
                    Pakistan
                  </p>
                </div>
              </div>
            </div>

            <div className={`bg-gray-900 border border-gray-800 p-6 rounded-lg hover:border-yellow-500/50 transition-all group ${isCardsVisible ? 'animate-fade-in-up animate-stagger-2' : 'opacity-0'}`}>
              <div className="flex items-start">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">📞</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">Phone</h3>
                  <p className="text-gray-400">+92 300 1234567</p>
                  <p className="text-gray-400">+92 21 12345678</p>
                </div>
              </div>
            </div>

            <div className={`bg-gray-900 border border-gray-800 p-6 rounded-lg hover:border-yellow-500/50 transition-all group overflow-hidden ${isCardsVisible ? 'animate-fade-in-up animate-stagger-3' : 'opacity-0'}`}>
              <div className="flex items-start">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform flex-shrink-0">📧</div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">Email</h3>
                  <p className="text-gray-400 break-all text-sm">info@bismillahtailors.com</p>
                  <p className="text-gray-400 break-all text-sm">support@bismillahtailors.com</p>
                </div>
              </div>
            </div>

            <div className={`bg-gray-900 border border-gray-800 p-6 rounded-lg hover:border-yellow-500/50 transition-all group overflow-hidden ${isCardsVisible ? 'animate-fade-in-up animate-stagger-4' : 'opacity-0'}`}>
              <div className="flex items-start">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform flex-shrink-0">⏰</div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">Hours</h3>
                  <p className="text-gray-400">Mon - Sat</p>
                  <p className="text-gray-400">9:00 AM - 8:00 PM</p>
                  <p className="text-gray-400 mt-2">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
