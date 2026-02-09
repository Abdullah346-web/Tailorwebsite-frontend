import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const typeStyles = {
    success: 'bg-green-900/90 border-green-500/40 text-green-200',
    error: 'bg-red-900/90 border-red-500/40 text-red-200',
    info: 'bg-blue-900/90 border-blue-500/40 text-blue-200',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          className={`fixed top-5 right-5 px-4 py-3 rounded-lg border ${typeStyles[type]} shadow-lg z-50`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
