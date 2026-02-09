import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginView, setLoginView] = useState('login');
  const { user, login, signup, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [submitError, setSubmitError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'gallery', 'contact'];
      let currentActive = 'home';

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            currentActive = sectionId;
          }
        }
      }

      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut for admin login: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowLoginModal(true);
        setLoginView('admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Main form submission handler
   * Routes to different handlers based on loginView
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitLoading(true);

    const run = async () => {
      // Signup: Submit form
      if (loginView === 'signup') {
        await signup(formData.fullName, formData.email, formData.password);
        alert('Your signup request has been sent! Your account will be activated once the admin approves your request.');
        setFormData({ email: '', password: '', fullName: '' });
        setLoginView('login');
        return;
      }
      
      // Admin Login
      if (loginView === 'admin') {
        await login(formData.email, formData.password, true);
        setFormData({ email: '', password: '', fullName: '' });
        return;
      }
      
      // Regular User Login
      await login(formData.email, formData.password);
      setFormData({ email: '', password: '', fullName: '' });
    };

    run()
      .then(() => {
        if (loginView !== 'signup') {
          setShowLoginModal(false);
          setLoginView('login');
          setIsOpen(false);
          // Scroll to dashboard
          setTimeout(() => {
            const el = document.getElementById('user-dashboard');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      })
      .catch((err) => setSubmitError(err.message || 'Action failed'))
      .finally(() => setSubmitLoading(false));
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setLoginView('login');
    setSignupRequestId(null);
    setFormData({ email: '', password: '', fullName: '', otp: '', resetToken: '', newPassword: '' });
    setSubmitError(null);
    setSubmitLoading(false);
  };

  return (
    <>
      <nav className={`bg-[#0b0b12]/90 border-b border-purple-500/20 fixed w-full top-0 z-50 transition-all duration-300 overflow-hidden ${showLoginModal ? 'blur-sm backdrop-blur-none' : 'backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection('home')}
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-500 to-blue-500 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer flex-shrink-0"
            >
              BISMILLAH TAILORS
            </button>

            {/* Desktop Menu + Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-6">
              {!user && (
                <>
                  <button onClick={() => scrollToSection('home')} className={`transition-colors cursor-pointer font-medium px-2 ${activeSection === 'home' ? 'text-violet-400 border-b-2 border-violet-400 pb-1' : 'text-gray-300 hover:text-violet-400'}`}>Home</button>
                  <button onClick={() => scrollToSection('about')} className={`transition-colors cursor-pointer font-medium px-2 ${activeSection === 'about' ? 'text-violet-400 border-b-2 border-violet-400 pb-1' : 'text-gray-300 hover:text-violet-400'}`}>About</button>
                  <button onClick={() => scrollToSection('services')} className={`transition-colors cursor-pointer font-medium px-2 ${activeSection === 'services' ? 'text-violet-400 border-b-2 border-violet-400 pb-1' : 'text-gray-300 hover:text-violet-400'}`}>Services</button>
                  <button onClick={() => scrollToSection('gallery')} className={`transition-colors cursor-pointer font-medium px-2 ${activeSection === 'gallery' ? 'text-violet-400 border-b-2 border-violet-400 pb-1' : 'text-gray-300 hover:text-violet-400'}`}>Gallery</button>
                  <button onClick={() => scrollToSection('contact')} className={`transition-colors cursor-pointer font-medium px-2 ${activeSection === 'contact' ? 'text-violet-400 border-b-2 border-violet-400 pb-1' : 'text-gray-300 hover:text-violet-400'}`}>Contact</button>
                </>
              )}

              {/* Auth Buttons */}
              {user ? (
                <button
                  onClick={logout}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-purple-500/30"
                >
                  Logout
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setSubmitError(null);
                    setShowLoginModal(!showLoginModal);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-purple-500/30"
                >
                  Login
                </button>
              )}
            </div>
            <div className="lg:hidden flex items-center gap-3">
              {user ? (
                <button
                  onClick={logout}
                  className="text-sm px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-blue-400 transition-all"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-violet-400 hover:text-violet-300 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && !user && (
          <div className={`lg:hidden bg-[#0b0b12]/95 border-t border-purple-500/20 transition-all duration-300 ${showLoginModal ? 'blur-sm backdrop-blur-none' : 'backdrop-blur-md'}`}>
            <div className="px-4 pt-2 pb-3 space-y-1 max-w-full overflow-hidden">
              <button onClick={() => scrollToSection('home')} className={`block w-full text-left px-3 py-2 rounded-lg transition cursor-pointer font-medium ${activeSection === 'home' ? 'bg-purple-500/20 text-violet-400 border-l-2 border-violet-400' : 'text-gray-300 hover:bg-purple-500/10 hover:text-violet-400'}`}>Home</button>
              <button onClick={() => scrollToSection('about')} className={`block w-full text-left px-3 py-2 rounded-lg transition cursor-pointer font-medium ${activeSection === 'about' ? 'bg-purple-500/20 text-violet-400 border-l-2 border-violet-400' : 'text-gray-300 hover:bg-purple-500/10 hover:text-violet-400'}`}>About</button>
              <button onClick={() => scrollToSection('services')} className={`block w-full text-left px-3 py-2 rounded-lg transition cursor-pointer font-medium ${activeSection === 'services' ? 'bg-purple-500/20 text-violet-400 border-l-2 border-violet-400' : 'text-gray-300 hover:bg-purple-500/10 hover:text-violet-400'}`}>Services</button>
              <button onClick={() => scrollToSection('gallery')} className={`block w-full text-left px-3 py-2 rounded-lg transition cursor-pointer font-medium ${activeSection === 'gallery' ? 'bg-purple-500/20 text-violet-400 border-l-2 border-violet-400' : 'text-gray-300 hover:bg-purple-500/10 hover:text-violet-400'}`}>Gallery</button>
              <button onClick={() => scrollToSection('contact')} className={`block w-full text-left px-3 py-2 rounded-lg transition cursor-pointer font-medium ${activeSection === 'contact' ? 'bg-purple-500/20 text-violet-400 border-l-2 border-violet-400' : 'text-gray-300 hover:bg-purple-500/10 hover:text-violet-400'}`}>Contact</button>
              <div className="border-t border-purple-500/20 mt-2 pt-2 space-y-2">
                <button 
                  onClick={() => {
                    setSubmitError(null);
                    setShowLoginModal(!showLoginModal);
                  }}
                  className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-400 hover:to-blue-400 transition"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[60] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={closeModal}
          ></div>

          <div className="relative bg-[#0b0b12] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 w-full max-w-md mx-auto px-4 p-8 transform transition-all duration-300 scale-100 opacity-100 z-[70]">
            
            {loginView === 'login' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">Login</h2>
                  <button onClick={closeModal} className="text-gray-400 hover:text-purple-400 transition-colors">✕</button>
                </div>

                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/40 text-red-200 rounded-lg p-3 text-sm">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-900 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all outline-none" placeholder="Enter your email" />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-900 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all outline-none" placeholder="Enter your password" />
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-bold hover:from-purple-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-60" disabled={submitLoading}>
                    {submitLoading ? 'Processing...' : 'Login'}
                  </button>
                </form>

                <div className="flex items-center justify-between space-x-4 text-sm pt-6 mt-6 border-t border-purple-500/20">
                  <button onClick={() => { setSubmitError(null); setLoginView('signup'); }} className="text-purple-400 hover:text-purple-300 transition-colors">Sign Up</button>
                </div>

                <button onClick={closeModal} className="w-full mt-4 px-4 py-2 border border-purple-500/30 text-gray-400 rounded-lg hover:border-purple-500/60 hover:text-purple-400 transition-all">Back</button>
              </div>
            )}

            {loginView === 'signup' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">Create Account</h2>
                  <button onClick={closeModal} className="text-gray-400 hover:text-purple-400 transition-colors">✕</button>
                </div>

                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/40 text-red-200 rounded-lg p-3 text-sm">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-900 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all outline-none" placeholder="Enter your full name" />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-900 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all outline-none" placeholder="Enter your email" />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-900 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all outline-none" placeholder="Create a password (min 6 chars)" />
                  </div>

                  <p className="text-xs text-gray-400">Your request will be sent to admin for approval</p>

                  <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-bold hover:from-purple-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-60" disabled={submitLoading}>
                    {submitLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>

                <button onClick={() => { setSubmitError(null); setLoginView('login'); }} className="w-full mt-4 px-4 py-2 border border-purple-500/30 text-gray-400 rounded-lg hover:border-purple-500/60 hover:text-purple-400 transition-all">Back</button>
              </div>
            )}

            {loginView === 'admin' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/40">
                      <Lock className="text-purple-400" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-purple-400 transition-colors">✕</button>
                </div>

                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/40 text-red-200 rounded-lg p-3 text-sm">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-900 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all outline-none" placeholder="Enter admin email" />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-900 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all outline-none" placeholder="Enter admin password" />
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-bold hover:from-purple-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-60" disabled={submitLoading}>
                    {submitLoading ? 'Processing...' : 'Login as Admin'}
                  </button>
                </form>

                <button onClick={() => { setSubmitError(null); setLoginView('login'); }} className="w-full mt-4 px-4 py-2 border border-purple-500/30 text-gray-400 rounded-lg hover:border-purple-500/60 hover:text-purple-400 transition-all">Back</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
