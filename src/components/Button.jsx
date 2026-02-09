const Button = ({ children, onClick, variant = 'primary' }) => {
  const baseStyles = "px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-400 hover:to-blue-400 shadow-lg shadow-purple-500/40",
    secondary: "border-2 border-purple-500 text-violet-400 hover:bg-purple-500/10 hover:border-violet-400",
    outline: "bg-transparent border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:border-violet-400"
  };

  const buttonClass = `${baseStyles} ${variants[variant]}`;

  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export default Button;
