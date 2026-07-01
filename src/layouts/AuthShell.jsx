/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Logo } from "../components/ui/Logo";
import { BRAND } from "../constant/brand";

// Split-screen auth layout: brand panel + form card.
export const AuthShell = ({ children }) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    {/* Brand panel */}
    <div className="relative hidden overflow-hidden border-r border-line bg-surface/40 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="pointer-events-none absolute inset-0 bg-brand-radial" />
      <Logo />
      <div className="relative">
        <h2 className="font-display text-4xl font-bold leading-tight text-ink-strong">
          Run projects.
          <br />
          <span className="gradient-text">Track every payment.</span>
        </h2>
        <p className="mt-4 max-w-md text-muted">{BRAND.pitch}</p>
      </div>
      <p className="relative text-xs text-muted/70">
        © {new Date().getFullYear()} {BRAND.name}
      </p>
    </div>

    {/* Form side */}
    <div className="flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        {children}
      </motion.div>
    </div>
  </div>
);

export default AuthShell;
