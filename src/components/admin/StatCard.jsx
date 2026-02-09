import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color = 'purple', delay = 0 }) => {
  const colorClasses = {
    purple: 'from-purple-600/20 to-purple-900/20 border-purple-500/30 text-purple-300',
    blue: 'from-blue-600/20 to-blue-900/20 border-blue-500/30 text-blue-300',
    green: 'from-green-600/20 to-green-900/20 border-green-500/30 text-green-300',
    orange: 'from-orange-600/20 to-orange-900/20 border-orange-500/30 text-orange-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-white/10 text-${color}-300`}>
            <Icon className="w-8 h-8" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
