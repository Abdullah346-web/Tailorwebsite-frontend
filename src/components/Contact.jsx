import { useState } from 'react';

const Contact = () => {
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
    <div className="bg-[#0b0b12]">
      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900/50 to-[#0b0b12]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Get in Touch</h2>
            <p className="text-gray-400">We'd love to hear from you</p>
          </div>

          <div className="relative group">
            {/* Gradient Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-gray-900 border border-purple-500/20 rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
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
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
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
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none resize-none"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-400 hover:to-blue-400 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/40"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-900 border border-purple-500/20 p-6 rounded-lg hover:border-purple-500/70 transition-all group">
              <div className="flex items-start">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform flex-shrink-0">📍</div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">Address</h3>
                  <p className="text-gray-400 text-sm break-words">
                    Shop 15, Main Market<br />
                    Tariq Road, Karachi<br />
                    Pakistan
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-purple-500/20 p-6 rounded-lg hover:border-purple-500/70 transition-all group">
              <div className="flex items-start">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform flex-shrink-0">📞</div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">Phone</h3>
                  <p className="text-gray-400 text-sm break-words">+92 300 1234567</p>
                  <p className="text-gray-400 text-sm break-words">+92 21 12345678</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-purple-500/20 p-6 rounded-lg hover:border-purple-500/70 transition-all group">
              <div className="flex items-start">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform flex-shrink-0">📧</div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">Email</h3>
                  <p className="text-gray-400 text-sm break-words">info@bismillahtailors.com</p>
                  <p className="text-gray-400 text-sm break-words">support@bismillahtailors.com</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-purple-500/20 p-6 rounded-lg hover:border-purple-500/70 transition-all group">
              <div className="flex items-start">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform flex-shrink-0">⏰</div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">Hours</h3>
                  <p className="text-gray-400 text-sm break-words">Mon - Sat</p>
                  <p className="text-gray-400 text-sm break-words">9:00 AM - 8:00 PM</p>
                  <p className="text-gray-400 text-sm mt-1 break-words">Sunday: Closed</p>
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
