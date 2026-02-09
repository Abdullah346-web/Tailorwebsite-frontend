const StepCard = ({ number, icon, title, description, delay = 0, isVisible = true }) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-[#0f0f17] border border-purple-500/10 shadow-xl transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} group-hover:-translate-y-2 group-hover:scale-105 group-hover:shadow-[0_20px_60px_-25px_rgba(99,102,241,0.65)]`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Glow and gradient frame */}
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-500/40 via-purple-400/20 to-blue-500/40 opacity-30 group-hover:opacity-60 transition duration-500"></div>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600/10 via-blue-500/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

      <div className="relative flex flex-col items-center text-center gap-4 p-8">
        {/* Step Number */}
        <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
          {number}
        </div>

        {/* Icon */}
        {icon && (
          <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-r from-purple-500 to-blue-500 group-hover:scale-110 transition-transform duration-500">
            <div className="h-full w-full rounded-full bg-[#0f0f17] flex items-center justify-center text-3xl">
              {icon}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white group-hover:text-violet-200 transition-colors">{title}</h3>
          <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">{description}</p>
        </div>

        {/* Hover accent line */}
        <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};

export default StepCard;
