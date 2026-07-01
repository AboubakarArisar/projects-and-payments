/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors focus-ring disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants = {
  // Neutral, high-contrast primary (white on dark) — clean SaaS look, no color pop.
  primary:
    "bg-slate-100 text-slate-900 hover:bg-white shadow-sm",
  secondary:
    "bg-elevated text-ink border border-line hover:bg-elevated/70 hover:text-ink-strong",
  ghost: "text-muted hover:text-ink-strong hover:bg-elevated/60",
  danger:
    "bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20",
  outline:
    "border border-brand-500/50 text-brand-300 hover:bg-brand-500/10",
};

const sizes = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-5 py-3",
  icon: "p-2",
};

export const Button = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => (
  <motion.button
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.97 }}
    className={cn(base, variants[variant], sizes[size], className)}
    {...props}
  >
    {children}
  </motion.button>
);

export default Button;
