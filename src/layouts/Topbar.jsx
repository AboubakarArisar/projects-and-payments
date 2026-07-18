/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu, FiLogOut, FiUser, FiSettings, FiSearch } from "react-icons/fi";
import { logoutUser } from "../redux/actions/action";
import { cn } from "../lib/cn";

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

export const Topbar = ({ onOpenSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user?.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the user menu on route change and on any click/escape outside it,
  // so it can never linger over another page.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const name = user?.userName || user?.email || "Guest";

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-muted hover:bg-elevated hover:text-ink lg:hidden focus-ring"
          aria-label="Open menu"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        {/* Search (visual for now) */}
        <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-line bg-surface/60 px-3 py-2 text-sm text-muted sm:flex">
          <FiSearch className="h-4 w-4" />
          <input
            className="w-full bg-transparent text-ink placeholder:text-muted/60 focus:outline-none"
            placeholder="Search projects, members, transactions…"
          />
        </div>

        {/* User menu — pinned to the far right */}
        <div ref={menuRef} className="relative ml-auto">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-xl border border-line bg-surface/60 py-1.5 pl-1.5 pr-3 text-sm hover:border-brand-500/40 focus-ring"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15 text-xs font-bold text-brand-300 ring-1 ring-inset ring-brand-500/25">
              {initials(name)}
            </span>
            <span className="hidden max-w-[10rem] truncate font-medium text-ink sm:block">
              {name}
            </span>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-surface shadow-card"
              >
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate text-sm font-medium text-ink-strong">
                      {name}
                    </p>
                    {user?.email && (
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    )}
                  </div>
                  <div className="p-1.5">
                    {[
                      { label: "Profile", icon: FiUser },
                      { label: "Settings", icon: FiSettings },
                    ].map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-elevated hover:text-ink"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    ))}
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm",
                        "text-rose-300 hover:bg-rose-500/10"
                      )}
                    >
                      <FiLogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
