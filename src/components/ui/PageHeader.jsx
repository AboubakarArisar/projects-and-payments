/* eslint-disable react/prop-types */
import { cn } from "../../lib/cn";

export const PageHeader = ({ title, subtitle, actions, className }) => (
  <div
    className={cn(
      "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
      className
    )}
  >
    <div>
      <h1 className="font-display text-3xl font-bold text-ink-strong">
        {title}
      </h1>
      {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
  </div>
);

export default PageHeader;
