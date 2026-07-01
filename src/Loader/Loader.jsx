import { motion } from "framer-motion";
import { SyncLoader } from "react-spinners";

// Full-screen overlay loader (used by data tables), themed dark.
const CustomLoader = () => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SyncLoader color="#3b82f6" loading size={14} />
    </motion.div>
  </motion.div>
);

export default CustomLoader;
