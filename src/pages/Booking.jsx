import { useState } from 'react';
import AnimatedDivider from '../components/AnimatedDivider';

const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dressType: '',
    measurements: '',
    preferredDate: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Booking request submitted successfully! We will contact you soon.');
    setFormData({
      name: '',
      phone: '',
      email: '',
      dressType: '',
      measurements: '',
      preferredDate: ''
    });
  };

  return (
    <div className="bg-black min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Book an Appointment
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Schedule your visit and let us create something special for you.
            Fill out the form below and our team will get in touch with you shortly.
          </p>
        </div>
      </section>

      <AnimatedDivider />

      {/* Booking Form */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative group">
            {/* Gradient Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-gray-900 border border-yellow-500/20 rounded-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Dress Type *</label>
                  <select
                    name="dressType"
                    value={formData.dressType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
                  >
                    <option value="">Select dress type</option>
                    <option value="suit">Premium Suit</option>
                    <option value="shirt">Formal Shirt</option>
                    <option value="kurta">Kurta Shalwar</option>
                    <option value="sherwani">Sherwani</option>
                    <option value="waistcoat">Waistcoat</option>
                    <option value="pants">Pants/Trousers</option>
                    <option value="alteration">Alterations</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Measurements / Requirements</label>
                  <textarea
                    name="measurements"
                    value={formData.measurements}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none resize-none"
                    placeholder="Provide any measurements you have or specific requirements..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Preferred Date *</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-4 rounded-lg font-bold text-lg hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/30"
                >
                  Submit Booking Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <AnimatedDivider />

      {/* Contact Info Cards */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg text-center hover:border-yellow-500/50 transition-all">
              <div className="text-4xl mb-3">📞</div>
              <h3 className="font-semibold text-white mb-2">Phone</h3>
              <p className="text-gray-400">+92 300 1234567</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg text-center hover:border-yellow-500/50 transition-all">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-400">info@bismillahtailors.com</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg text-center hover:border-yellow-500/50 transition-all">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="font-semibold text-white mb-2">Hours</h3>
              <p className="text-gray-400">Mon-Sat: 9AM-8PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
