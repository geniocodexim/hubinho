
import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, Watch, Headphones } from 'lucide-react';

const Logo = () => {
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.2, rotate: 10, transition: { type: 'spring', stiffness: 400, damping: 10 } }
  };

  return (
    <motion.div
      className="w-12 h-12 relative flex items-center justify-center"
      whileHover="hover"
      initial="hidden"
      animate="visible"
      variants={{
        hover: { scale: 1.1, transition: { type: 'spring', stiffness: 300 } }
      }}
    >
      <motion.div
        className="absolute top-0 left-0"
        variants={iconVariants}
        whileHover="hover"
      >
        <Smartphone className="w-5 h-5 text-[#FF8A00]" />
      </motion.div>
      <motion.div
        className="absolute top-0 right-0"
        variants={iconVariants}
        whileHover="hover"
      >
        <Laptop className="w-5 h-5 text-[#FFB84D]" />
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0"
        variants={iconVariants}
        whileHover="hover"
      >
        <Watch className="w-5 h-5 text-[#FF8A00]" />
      </motion.div>
      <motion.div
        className="absolute bottom-0 right-0"
        variants={iconVariants}
        whileHover="hover"
      >
        <Headphones className="w-5 h-5 text-[#FFB84D]" />
      </motion.div>
    </motion.div>
  );
};

export default Logo;
