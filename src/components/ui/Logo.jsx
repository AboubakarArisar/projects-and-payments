/* eslint-disable react/prop-types */
import { BRAND } from "../../constant/brand";
import { cn } from "../../lib/cn";

// Gradient "ledger bars" mark + wordmark.
export const LogoMark = ({ className }) => (
  <span
    className={cn(
      "inline-flex items-center justify-center rounded-xl bg-brand-gradient shadow-glow",
      className
    )}
  >
    <svg viewBox="0 0 24 24" fill="none" className="h-2/3 w-2/3 text-white">
      <path
        d="M5 14v4M12 9v9M19 5v13"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

export const Logo = ({ collapsed = false, className }) => (
  <div className={cn("flex items-center gap-2.5", className)}>
    <LogoMark className="h-9 w-9" />
    {!collapsed && (
      <span className="font-display text-lg font-bold tracking-tight text-ink-strong">
        {BRAND.name}
      </span>
    )}
  </div>
);

export default Logo;
