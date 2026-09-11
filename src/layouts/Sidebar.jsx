/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiTrello,
  FiUsers,
  FiDollarSign,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiCpu,
} from "react-icons/fi";
import { Logo } from "../components/ui/Logo";
import { cn } from "../lib/cn";

const nav = [
  {
    section: "Workspace",
    items: [
      { to: "/dashboard", label: "Overview", icon: FiGrid },
      { to: "/projects", label: "Projects", icon: FiTrello },
      { to: "/teams", label: "Team", icon: FiUsers },
    ],
  },
  {
    section: "AI",
    items: [{ to: "/ai", label: "AI Assistant", icon: FiCpu }],
  },
  {
    section: "Payments",
    items: [
      { to: "/totalPayments", label: "All transactions", icon: FiDollarSign },
      { to: "/incomingPayments", label: "Incoming", icon: FiArrowDownCircle },
      { to: "/outgoingPayments", label: "Outgoing", icon: FiArrowUpCircle },
    ],
  },
];

const linkClass = ({ isActive }) =>
  cn(
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
    isActive
      ? "bg-brand-500/15 text-ink-strong ring-1 ring-inset ring-brand-500/30"
      : "text-muted hover:bg-elevated/60 hover:text-ink"
  );

// Inner nav content, reused by the desktop rail and the mobile drawer.
export const SidebarContent = ({ onNavigate }) => (
  <div className="flex h-full flex-col gap-6">
    <div className="px-2 pt-1">
      <NavLink to="/dashboard" onClick={onNavigate} aria-label="Go to dashboard">
        <Logo />
      </NavLink>
    </div>

    <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
      {nav.map((group) => (
        <div key={group.section}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            {group.section}
          </p>
          <div className="space-y-1">
            {group.items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={linkClass}
                onClick={onNavigate}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        isActive
                          ? "text-brand-300"
                          : "text-muted group-hover:text-ink"
                      )}
                    />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>

    <div className="rounded-xl border border-line bg-elevated/40 p-3 text-xs text-muted">
      <p className="font-medium text-ink">One thing at a time.</p>
      <p className="mt-1 leading-relaxed">Open your overview to find the next task that needs your attention.</p>
    </div>
  </div>
);

export default SidebarContent;
