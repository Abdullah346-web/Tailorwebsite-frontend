const TeamCard = ({ name, role, image, description, experience, skills, delay = 0, isVisible = true }) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-[#0f0f17] border border-purple-500/10 shadow-xl transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} group-hover:-translate-y-2 group-hover:scale-105 group-hover:shadow-[0_20px_60px_-25px_rgba(99,102,241,0.65)]`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Glow and gradient frame */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-500/40 via-purple-400/20 to-blue-500/40 opacity-30 group-hover:opacity-60 transition duration-500"></div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 via-blue-500/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

      <div className="relative flex flex-col items-center text-center gap-5 px-8 py-10">
        {/* Circular avatar with gradient ring */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur opacity-50 group-hover:opacity-80 transition duration-500"></div>
          <div className="relative h-24 w-24 rounded-full p-[2px] bg-gradient-to-r from-purple-500 to-blue-500">
            <div className="h-full w-full rounded-full bg-[#0f0f17] p-1">
              <img
                src={image}
                alt={name}
                className="h-full w-full rounded-full object-cover object-top group-hover:blur-sm transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Content - Always visible */}
        <div className="space-y-1 group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-xl font-bold text-white group-hover:text-violet-200 transition-colors">{name}</h3>
          <p className="text-sm font-semibold text-purple-300">{role}</p>
          <p className="text-sm leading-relaxed text-gray-400">{description}</p>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 py-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Experience */}
          <div className="text-center">
            <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{experience}+</p>
            <p className="text-xs uppercase tracking-widest text-white mt-1">Years Experience</p>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {skills.map((skill, idx) => (
              <span key={idx} className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/50 hover:bg-purple-500/50 transition">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
