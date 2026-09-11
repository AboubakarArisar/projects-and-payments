/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

// Dashboard KPI tile. tone drives the accent glow/icon color.
const tones = {
  emerald: {
    ring: "hover:border-emerald-500/40",
    glow: "from-emerald-500/20",
    icon: "bg-emerald-500/15 text-emerald-300",
    value: "text-emerald-300",
  },
  rose: {
    ring: "hover:border-rose-500/40",
    glow: "from-rose-500/20",
    icon: "bg-rose-500/15 text-rose-300",
    value: "text-rose-300",
  },
  brand: {
    ring: "hover:border-brand-500/40",
    glow: "from-brand-500/20",
    icon: "bg-brand-500/15 text-brand-300",
    value: "text-ink-strong",
  },
};

export const StatCard = ({
  label,
  value,
  icon,
  tone = "brand",
  onClick,
  hint,
}) => {
  const t = tones[tone] || tones.brand;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "card group relative overflow-hidden p-5 text-left transition-colors focus-ring",
        t.ring
      )}
    >
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className={cn("mt-3 font-display text-3xl font-extrabold tracking-tight tabular-nums", t.value)}>
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </div>
        {icon && (
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              t.icon
            )}
          >
            {icon}
          </span>
        )}
      </div>
    </motion.button>
  );
};

export default StatCard;
