const AnimatedDivider = () => {
  return (
    <div className="w-full flex items-center justify-center py-12 my-8">
      <div className="flex items-center justify-center">
        <div className="relative h-[2px] w-32 sm:w-40 overflow-hidden rounded-full bg-gradient-to-r from-transparent via-purple-500 to-blue-400">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-transparent blur-lg opacity-70 animate-pulse"></div>
        </div>
        <div className="mx-3 sm:mx-4 h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 shadow-[0_0_20px_rgba(99,102,241,0.7)] animate-ping"></div>
        <div className="relative h-[2px] w-32 sm:w-40 overflow-hidden rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-transparent blur-lg opacity-70 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedDivider;
