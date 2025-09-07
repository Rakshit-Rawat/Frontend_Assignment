import { motion } from "framer-motion";

const Loader = ({ text = "Loading..." }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } },
    pulse: {
      opacity: [1, 0.7, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <motion.div
            className="absolute inset-0 border-4 border-t-transparent rounded-full"
            style={{
              borderImage: "linear-gradient(to right, #3B82F6, #A855F7) 1",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-10"></div>
        </div>
        <motion.h2
          variants={textVariants}
          animate="pulse"
          className="text-xl font-semibold text-gray-100 mb-2"
        >
          {text}
        </motion.h2>
        <motion.p
          variants={textVariants}
          className="text-gray-400"
        >
          Please wait while we load the page
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loader;