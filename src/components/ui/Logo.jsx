/* eslint-disable react/prop-types */
import { BRAND } from "../../constant/brand";
import { cn } from "../../lib/cn";

// Brand mark — the logo image from /public/logo.png.
export const LogoMark = ({ className }) => (
  <img
    src="/logo.png"
    alt={`${BRAND.name} logo`}
    className={cn("inline-block rounded-xl object-contain", className)}
  />
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
