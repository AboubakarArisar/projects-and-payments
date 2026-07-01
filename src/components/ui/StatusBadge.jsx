/* eslint-disable react/prop-types */
import { cn } from "../../lib/cn";

// Maps every project + task status to a consistent color language.
const STATUS_STYLES = {
  BACKLOG: "bg-slate-500/15 text-slate-300 ring-slate-400/30",
  IN_PROGRESS: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  PENDING: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
  TESTING: "bg-teal-500/15 text-teal-300 ring-teal-400/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  TODO: "bg-slate-500/15 text-slate-300 ring-slate-400/30",
  DONE: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
};

export const Badge = ({ className, children, tone = "brand" }) => {
  const tones = {
    brand: "bg-brand-500/15 text-brand-300 ring-brand-400/30",
    neutral: "bg-elevated text-muted ring-line",
    success: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
    danger: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, className }) => {
  const label = String(status || "")
    .replace(/_/g, " ")
    .toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset",
        STATUS_STYLES[status] || STATUS_STYLES.BACKLOG,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
};

export default StatusBadge;
