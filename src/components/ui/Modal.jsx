/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { cn } from "../../lib/cn";

// Centered modal with backdrop. Render it conditionally from the parent
// (e.g. {open && <Modal .../>}).
export const Modal = ({ title, subtitle, onClose, children, footer, size = "md" }) => {
  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 16, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "card relative w-full overflow-hidden p-0 shadow-2xl",
          widths[size]
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-strong">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-elevated hover:text-ink"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-line px-6 py-4">
            {footer}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Modal;
