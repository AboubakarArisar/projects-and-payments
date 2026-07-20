import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiTrello, FiUsers, FiDollarSign, FiX } from "react-icons/fi";
import axios from "axios";
import { URL } from "../constant";

// Global search across projects, team members, and transactions.
// Data is fetched once on first focus and filtered client-side.
export function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const loaded = useRef(false);

  const loadData = async () => {
    if (loaded.current) return;
    loaded.current = true;
    setLoading(true);
    try {
      const [projects, members, transactions] = await Promise.all([
        axios.get(`${URL}/projects`).then((r) => r.data).catch(() => []),
        axios.get(`${URL}/members`).then((r) => r.data).catch(() => []),
        axios.get(`${URL}/transactions`).then((r) => r.data).catch(() => []),
      ]);
      setData({ projects, members, transactions });
    } finally {
      setLoading(false);
    }
  };

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!data || !q) return { projects: [], members: [], transactions: [] };
    const has = (s) => (s || "").toLowerCase().includes(q);
    return {
      projects: data.projects.filter((p) => has(p.name) || has(p.description)).slice(0, 5),
      members: data.members.filter((m) => has(m.name) || has(m.position) || has(m.email)).slice(0, 5),
      transactions: data.transactions
        .filter((t) => has(t.transactionTitle) || has(t.transactionDescription))
        .slice(0, 5),
    };
  }, [data, q]);

  const total =
    results.projects.length + results.members.length + results.transactions.length;

  const go = (path) => {
    setOpen(false);
    setQuery("");
    navigate(path);
  };

  return (
    <div ref={ref} className="relative hidden max-w-md flex-1 sm:block">
      <div className="flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-3 py-2 text-sm text-muted transition-colors focus-within:border-brand-500/40">
        <FiSearch className="h-4 w-4 shrink-0" />
        <input
          className="w-full bg-transparent text-ink placeholder:text-muted/60 focus:outline-none"
          placeholder="Search projects, members, transactions…"
          value={query}
          onFocus={() => {
            loadData();
            setOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="shrink-0 rounded p-0.5 hover:text-ink"
            aria-label="Clear search"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && q && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
          {loading ? (
            <p className="px-4 py-6 text-center text-sm text-muted">Searching…</p>
          ) : total === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted">
              No matches for “{query}”.
            </p>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto py-1.5">
              <Group
                title="Projects"
                icon={FiTrello}
                items={results.projects}
                render={(p) => ({
                  label: p.name,
                  sub: p.description,
                  onClick: () => go(`/projects/${p._id}`),
                })}
              />
              <Group
                title="Team"
                icon={FiUsers}
                items={results.members}
                render={(m) => ({
                  label: m.name,
                  sub: m.position,
                  onClick: () => go("/teams"),
                })}
              />
              <Group
                title="Transactions"
                icon={FiDollarSign}
                items={results.transactions}
                render={(t) => ({
                  label: t.transactionTitle,
                  sub: t.transactionDescription,
                  onClick: () => go("/totalPayments"),
                })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function Group({ title, icon: Icon, items, render }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted/70">
        {title}
      </p>
      {items.map((it, i) => {
        const { label, sub, onClick } = render(it);
        return (
          <button
            key={i}
            onClick={onClick}
            className="flex w-full items-start gap-3 px-4 py-2 text-left transition-colors hover:bg-elevated"
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
            <span className="min-w-0">
              <span className="block truncate text-sm text-ink">{label || "Untitled"}</span>
              {sub && <span className="block truncate text-xs text-muted">{sub}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default GlobalSearch;
