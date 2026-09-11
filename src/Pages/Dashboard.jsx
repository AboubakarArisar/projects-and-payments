import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowDownCircle, FiArrowUpCircle, FiDollarSign, FiPlus, FiArrowRight, FiCheckCircle, FiClock, FiCpu } from "react-icons/fi";
import { useTitle } from "../hooks/useTitle";
import { URL } from "../constant";
import { formatDate, formatMoney } from "../lib/format";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Button } from "../components/ui/Button";
import { StatusBadge } from "../components/ui/StatusBadge";

export default function Dashboard() {
  useTitle("Dashboard");
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    Promise.all(["projects", "tasks", "members", "transactions"].map(endpoint =>
      axios.get(`${URL}/${endpoint}`, { signal: controller.signal }).then(response => response.data)
    )).then(([projects, tasks, members, transactions]) => {
      setData({ projects, tasks, members, transactions });
    }).catch(err => {
      if (!controller.signal.aborted) {
        console.error("Could not load dashboard:", err);
        setError(true);
      }
    });
    return () => controller.abort();
  }, [attempt]);

  const header = <PageHeader title="Your workspace" subtitle="A clear view of the work ahead." actions={<Button onClick={() => navigate("/prEntry")}><FiPlus /> New project</Button>} />;
  if (error) return <>{header}<div role="alert" className="card p-8"><h2 className="text-lg font-bold">Your workspace could not load.</h2><p className="mb-5 mt-2 text-muted">Check your connection and try again. Your saved work is unchanged.</p><Button onClick={() => setAttempt(a => a + 1)}>Try again</Button></div></>;
  if (!data) return <>{header}<div aria-label="Loading workspace" role="status" className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map(i => <div key={i} className="card h-36 animate-pulse" />)}</div><div className="card mt-7 h-72 animate-pulse" /></>;

  const { projects, tasks, members, transactions } = data;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const openTasks = tasks.filter(task => task.status !== "DONE");
  const upcoming = openTasks.filter(task => task.deadline).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const overdue = upcoming.filter(task => String(task.deadline).slice(0, 10) < today);
  const incoming = transactions.filter(t => t.transactionType === "IN").reduce((sum, t) => sum + Number(t.transactionAmount || 0), 0);
  const outgoing = transactions.filter(t => t.transactionType === "OUT").reduce((sum, t) => sum + Number(t.transactionAmount || 0), 0);

  return (
    <>
      {header}
      <div className="mb-7 flex flex-wrap gap-x-6 gap-y-2 border-y border-line py-3 text-sm text-muted">
        <span><strong className="text-ink">{projects.filter(p => p.status !== "COMPLETED").length}</strong> active projects</span>
        <span><strong className="text-ink">{openTasks.length}</strong> open tasks</span>
        <button onClick={() => navigate("/teams")} className="hover:text-ink focus-ring"><strong className="text-ink">{members.length}</strong> team members</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Money in" value={formatMoney(incoming)} tone="emerald" icon={<FiArrowDownCircle />} hint="Total received" onClick={() => navigate("/incomingPayments")} />
        <StatCard label="Money out" value={formatMoney(outgoing)} tone="rose" icon={<FiArrowUpCircle />} hint="Total spent" onClick={() => navigate("/outgoingPayments")} />
        <StatCard label="Net balance" value={formatMoney(incoming - outgoing)} icon={<FiDollarSign />} hint="Received minus spent" onClick={() => navigate("/totalPayments")} />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4"><div className="flex items-center gap-3"><FiClock className="text-brand-300" /><h2 className="font-bold">Needs attention</h2></div><span className={`text-sm ${overdue.length ? "text-rose-300" : "text-muted"}`}>{overdue.length} overdue</span></div>
          {upcoming.length ? <div className="divide-y divide-line">{upcoming.slice(0, 5).map(task => {
            const projectId = typeof task.project === "object" ? task.project?._id : task.project;
            const projectName = projects.find(p => p._id === projectId)?.name || "Task";
            const isOverdue = String(task.deadline).slice(0, 10) < today;
            return <button key={task._id} onClick={() => navigate(projectId ? `/projects/${projectId}` : "/projects")} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-elevated/50 focus-ring"><span className="min-w-0"><span className="block truncate text-sm font-semibold">{task.name}</span><span className="mt-1 block truncate text-xs text-muted">{projectName}</span></span><span className={`shrink-0 text-xs ${isOverdue ? "text-rose-300" : "text-muted"}`}>{isOverdue ? "Overdue · " : "Due "}{formatDate(task.deadline)}</span></button>;
          })}</div> : <div className="px-6 py-12 text-center"><FiCheckCircle className="mx-auto mb-4 h-7 w-7 text-emerald-300" /><h3 className="font-semibold">Room to focus.</h3><p className="mt-2 text-sm text-muted">No open tasks with deadlines. Open a project to plan your next steps.</p><Button variant="ghost" className="mt-4" onClick={() => navigate("/projects")}>View projects <FiArrowRight /></Button></div>}
        </section>
        <aside className="card flex flex-col items-start p-6">
          <FiCpu className="mb-5 h-6 w-6 text-brand-300" /><p className="text-xs font-semibold uppercase tracking-widest text-muted">A head start</p><h2 className="mt-2 text-2xl font-extrabold leading-tight">Client notes.<br />Meet your next project.</h2><p className="mb-6 mt-3 text-sm leading-relaxed text-muted">Turn a messy brief into a clear scope, or meeting notes into tasks. Review everything before adding it.</p><Button variant="secondary" className="mt-auto" onClick={() => navigate("/ai")}>Open AI tools <FiArrowRight /></Button>
        </aside>
      </div>
      <section className="mt-9">
        <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Projects</h2><Button variant="ghost" onClick={() => navigate("/projects")}>View board <FiArrowRight /></Button></div>
        {projects.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.slice(0, 6).map(project => {
          const projectTasks = tasks.filter(task => (typeof task.project === "object" ? task.project?._id : task.project) === project._id);
          const done = projectTasks.filter(task => task.status === "DONE").length;
          return <button key={project._id} onClick={() => navigate(`/projects/${project._id}`)} className="card p-5 text-left transition-colors hover:border-brand-400/60 focus-ring"><div className="mb-4"><StatusBadge status={project.status} /></div><h3 className="truncate font-bold">{project.name}</h3><p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-muted">{project.description}</p><div className="mb-2 mt-5 flex justify-between gap-2 text-xs text-muted"><span>{done}/{projectTasks.length} tasks complete</span><span>{project.deadline ? formatDate(project.deadline) : "No deadline"}</span></div><progress className="project-progress" value={done} max={projectTasks.length || 1} aria-label={`${project.name} task completion`} /></button>;
        })}</div> : <div className="card px-6 py-12 text-center"><h3 className="text-lg font-bold">A fresh start for your next project.</h3><p className="mb-5 mt-2 text-sm text-muted">Add a project, then break the work into a few clear next steps.</p><Button onClick={() => navigate("/prEntry")}><FiPlus /> Create your first project</Button></div>}
      </section>
    </>
  );
}

