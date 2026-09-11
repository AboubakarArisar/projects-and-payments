/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Logo } from "../components/ui/Logo";
import { BRAND } from "../constant/brand";

// Split-screen auth layout: brand panel + form card.
export const AuthShell = ({ children }) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    {/* Brand panel */}
    <div className="relative hidden overflow-hidden border-r border-line bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
      <Logo />
      <div className="relative">
        <p className="mb-6 text-sm font-semibold text-brand-300">A little less chaos. A little more progress.</p>
        <h2 className="font-display text-6xl font-extrabold leading-[1.05] tracking-[-0.05em] text-ink-strong">
          Make room
          <br />
          <span className="text-brand-400">for good work.</span>
        </h2>
        <p className="mt-6 max-w-sm text-lg text-muted">Projects, people, and payments. Together in a workspace that gets out of your way.</p>
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
