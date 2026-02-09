import { motion } from 'framer-motion';

const FilterTabs = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <motion.button
          key={filter.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeFilter === filter.id
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50'
              : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-purple-500/60'
          }`}
        >
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterTabs;
