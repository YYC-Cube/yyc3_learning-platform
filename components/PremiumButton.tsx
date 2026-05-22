import React from 'react';
import { motion } from 'motion/react';

interface PremiumButtonProps {
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'outline';
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({ onClick, className = "", variant = 'primary' }) => {
  if (variant === 'outline') {
    return (
      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`px-6 py-2 border border-blue-500 text-blue-400 rounded-full font-medium transition-colors cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.1)] ${className}`}
      >
        解锁 - 250€
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: "#3b82f6" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition-all cursor-pointer ${className}`}
    >
      解锁 - 250€
    </motion.button>
  );
};
