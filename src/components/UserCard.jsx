import { useState } from 'react';

const UserCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div
        className="relative w-80 h-96 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:rotate-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-90'}`}></div>
        
        {/* Profile Image Container */}
        <div className="relative z-10 flex flex-col items-center pt-8">
          <div className={`relative transition-transform duration-700 ${isHovered ? 'scale-110 rotate-6' : 'scale-100'}`}>
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              <img
                src="https://ui-avatars.com/api/?name=John+Doe&size=128&background=4F46E5&color=fff&bold=true"
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Online Status Badge */}
            <div className={`absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white transition-all duration-300 ${isHovered ? 'scale-125 animate-ping' : ''}`}></div>
          </div>

          {/* User Info */}
          <div className="text-center mt-6 px-6">
            <h2 className={`text-2xl font-bold text-white transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}`}>
              John Doe
            </h2>
            <p className={`text-blue-100 mt-2 transition-all duration-500 delay-75 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'}`}>
              Full Stack Developer
            </p>
            <p className={`text-sm text-blue-50 mt-3 transition-all duration-500 delay-100 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-70'}`}>
              Building amazing web experiences with modern technologies
            </p>
          </div>

          {/* Stats Section */}
          <div className={`flex gap-6 mt-6 transition-all duration-500 delay-150 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">2.5K</p>
              <p className="text-xs text-blue-100">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">1.2K</p>
              <p className="text-xs text-blue-100">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">89</p>
              <p className="text-xs text-blue-100">Posts</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-4 mt-6 transition-all duration-500 delay-200 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button className="px-6 py-2 bg-white text-purple-600 rounded-full font-semibold hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Follow
            </button>
            <button className="px-6 py-2 bg-purple-700 text-white rounded-full font-semibold hover:bg-purple-800 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Message
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full opacity-10 transition-all duration-1000 ${isHovered ? 'scale-150' : 'scale-100'}`}></div>
        <div className={`absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full opacity-10 transition-all duration-1000 ${isHovered ? 'scale-150' : 'scale-100'}`}></div>
      </div>
    </div>
  );
};

export default UserCard;
