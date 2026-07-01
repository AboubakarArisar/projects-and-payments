/* eslint-disable react/prop-types */
import { cn } from "../../lib/cn";

const control =
  "w-full rounded-xl border border-line bg-bg/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus-ring focus-visible:border-brand-500/60";

export const Label = ({ htmlFor, children, className }) => (
  <label
    htmlFor={htmlFor}
    className={cn("mb-1.5 block text-sm font-medium text-ink", className)}
  >
    {children}
  </label>
);

export const Input = ({ className, ...props }) => (
  <input className={cn(control, className)} {...props} />
);

export const Textarea = ({ className, ...props }) => (
  <textarea className={cn(control, "resize-none", className)} {...props} />
);

export const Select = ({ className, children, ...props }) => (
  <select className={cn(control, "appearance-none", className)} {...props}>
    {children}
  </select>
);

// Convenience wrapper: label + control + optional hint.
export const Field = ({ label, htmlFor, hint, children, className }) => (
  <div className={cn("mb-4", className)}>
    {label && <Label htmlFor={htmlFor}>{label}</Label>}
    {children}
    {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
  </div>
);

export default Field;
