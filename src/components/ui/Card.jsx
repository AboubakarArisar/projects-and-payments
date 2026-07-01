/* eslint-disable react/prop-types */
import { cn } from "../../lib/cn";

export const Card = ({ className, children, ...props }) => (
  <div className={cn("card p-5", className)} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action, className }) => (
  <div className={cn("flex items-start justify-between gap-4 mb-4", className)}>
    <div>
      <h3 className="text-base font-semibold text-ink-strong">{title}</h3>
      {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default Card;
