/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiTrello,
  FiUsers,
  FiDollarSign,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiPlusCircle,
  FiUserPlus,
  FiFilePlus,
} from "react-icons/fi";
import { Logo } from "../components/ui/Logo";
import { cn } from "../lib/cn";

const nav = [
  {
    section: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: FiGrid },
      { to: "/projects", label: "Projects", icon: FiTrello },
      { to: "/teams", label: "Team", icon: FiUsers },
    ],
  },
  {
    section: "Payments",
    items: [
      { to: "/totalPayments", label: "All transactions", icon: FiDollarSign },
      { to: "/incomingPayments", label: "Incoming", icon: FiArrowDownCircle },
      { to: "/outgoingPayments", label: "Outgoing", icon: FiArrowUpCircle },
    ],
  },
  {
    section: "Create",
    items: [
      { to: "/prEntry", label: "New project", icon: FiPlusCircle },
      { to: "/addMember", label: "New member", icon: FiUserPlus },
      { to: "/transactionEntry", label: "New transaction", icon: FiFilePlus },
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
      <Logo />
    </div>

    <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
      {nav.map((group) => (
        <div key={group.section}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted/70">
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
      <p className="font-medium text-ink">Need a hand?</p>
      <p className="mt-0.5">Drag project cards to change their status.</p>
    </div>
  </div>
);

export default SidebarContent;
