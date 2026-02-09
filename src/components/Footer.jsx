const Footer = () => {
  return (
    <footer className="bg-[#0b0b12] border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-violet-500 to-blue-500 bg-clip-text text-transparent mb-4">
              BISMILLAH TAILORS
            </h3>
            <p className="text-gray-400">
              Premium tailoring services with perfection & trust since 2004.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-violet-400 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-violet-400 transition-colors cursor-pointer">Home</button></li>
              <li><button className="hover:text-violet-400 transition-colors cursor-pointer">About</button></li>
              <li><button className="hover:text-violet-400 transition-colors cursor-pointer">Services</button></li>
              <li><button className="hover:text-violet-400 transition-colors cursor-pointer">Gallery</button></li>
              <li><button className="hover:text-violet-400 transition-colors cursor-pointer">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-violet-400 mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📞 +92 300 1234567</li>
              <li>📧 info@bismillahtailors.com</li>
              <li>📍 Karachi, Pakistan</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-violet-400 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-500/20 hover:border border-purple-500 transition-all">
                <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-500/20 hover:border border-purple-500 transition-all">
                <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.521 17.674c-.604.306-1.235.578-1.887.803.651-.781 1.215-1.66 1.646-2.607.432.187.839.409 1.215.663-.316.559-.706 1.078-1.161 1.54zm-2.686-4.174c.072 1.16-.34 2.302-1.143 3.13.806-.152 1.575-.45 2.258-.882-.306-.926-.84-1.767-1.507-2.451.097.205.176.416.252.635-.101.226-.212.449-.331.667zm4.309-5.424c-.604.306-1.235.578-1.887.803.651-.781 1.215-1.66 1.646-2.607.432.187.839.409 1.215.663-.316.559-.706 1.078-1.161 1.54z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-500/20 hover:border border-purple-500 transition-all">
                <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-purple-500/20 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; 2026 Bismillah Tailors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
