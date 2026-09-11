import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheck, FiTrello, FiDollarSign, FiUsers, FiCpu } from "react-icons/fi";
import { useTitle } from "../hooks/useTitle";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";
import Footer from "../layouts/Footer";

const capabilities = [
  { icon: FiTrello, title: "A clear path to done.", text: "Break projects into tasks, move work across your board, and keep deadlines in sight." },
  { icon: FiDollarSign, title: "Keep your money in view.", text: "Record incoming and outgoing payments with one ledger and a clear net balance." },
  { icon: FiUsers, title: "Know who's working on what.", text: "Keep your team and project assignments together, without the back-and-forth." },
  { icon: FiCpu, title: "Turn notes into next steps.", text: "Use AI to structure client requirements, draft proposals, and turn meeting notes into tasks." },
];

export default function Home() {
  useTitle();
  const navigate = useNavigate();
  return (
    <div>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-10">
          <Logo />
          <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-6">
            <a href="#workspace" className="hidden text-sm text-muted hover:text-ink sm:block">The workspace</a>
            <Button variant="ghost" onClick={() => navigate("/login")}>Sign in</Button>
            <Button onClick={() => navigate("/register")}>Get started <FiArrowRight /></Button>
          </nav>
        </div>
      </header>
      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-16 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:px-10 lg:pb-20 lg:pt-24">
          <div>
            <p className="mb-6 text-sm font-semibold text-brand-300">For freelancers. For small teams. For the work ahead.</p>
            <h1 className="max-w-4xl text-[clamp(3rem,6.5vw,6rem)] font-extrabold leading-[1.04] tracking-[-0.055em]">Less juggling.<br /><span className="text-brand-400">More building.</span></h1>
          </div>
          <div className="max-w-md pb-1">
            <p className="text-lg leading-relaxed text-muted">Your projects, people, and payments. One place to keep the work moving.</p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Button size="lg" onClick={() => navigate("/register")}>Start your workspace <FiArrowRight /></Button>
              <a href="#workspace" className="text-sm font-semibold text-ink underline decoration-line underline-offset-8 hover:decoration-brand-400">Take a look</a>
            </div>
          </div>
        </section>
        <section id="workspace" aria-label="Example Steward workspace" className="mx-auto max-w-7xl scroll-mt-6 px-5 lg:px-10">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <div className="flex items-center gap-3"><FiTrello className="text-brand-400" /><span className="text-sm font-semibold">Your next big thing</span></div>
              <span className="text-xs text-muted">Example workspace</span>
            </div>
            <div className="grid md:grid-cols-[170px_1fr]">
              <div className="hidden border-r border-line p-4 md:block" aria-hidden="true">
                <p className="mb-4 px-3 text-xs text-muted">WORKSPACE</p>
                {["Overview", "Projects", "Team", "Payments", "AI Assistant"].map(label => <div key={label} className={`mb-1 rounded-lg px-3 py-2 text-sm ${label === "Projects" ? "bg-brand-500/15 text-brand-200" : "text-muted"}`}>{label}</div>)}
              </div>
              <div className="min-w-0 p-4 sm:p-7">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Website launch</h2><span className="rounded-full border border-line px-3 py-1 text-xs text-muted">3 tasks · 1 completed</span></div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { status: "To do", name: "Write the homepage copy", description: "A clear story for the next chapter.", date: "Due Sep 18", color: "text-muted" },
                    { status: "In progress", name: "Build the project pages", description: "Make the work speak for itself.", date: "Due Sep 16", color: "text-brand-300" },
                    { status: "Done", name: "Define the visual direction", description: "Typography, color, and a little personality.", date: "Completed", color: "text-emerald-300" },
                  ].map(task => <div key={task.status} className="rounded-xl bg-bg/60 p-3"><div className={`mb-4 flex items-center justify-between text-sm ${task.color}`}><span>{task.status}</span><span className="text-xs">1</span></div><div className="rounded-xl border border-line bg-surface p-4"><h3 className="text-sm font-bold leading-relaxed">{task.name}</h3><p className="mt-2 text-sm text-muted">{task.description}</p><div className="mt-6 border-t border-line pt-3 text-xs text-muted">{task.date}</div></div></div>)}
                </div>
                <div className="mt-6 flex items-center gap-3 text-sm text-muted"><FiCheck className="shrink-0 text-emerald-300" /> A little more progress. A little less chaos.</div>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><h2 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">The work is complicated.<br />Your workspace should be simple.</h2><p className="max-w-sm text-muted">From the first client message to the final task, keep the important things together.</p></div>
          <div className="grid gap-0 overflow-hidden rounded-2xl border border-line sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(({icon: Icon, title, text}) => <article key={title} className="border-b border-line p-7 last:border-b-0 sm:border-r lg:border-b-0"><Icon className="mb-8 h-6 w-6 text-brand-300" /><h3 className="text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{text}</p></article>)}
          </div>
        </section>
        <section className="border-t border-line bg-surface">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-16 sm:flex-row sm:items-center lg:px-10"><div><p className="mb-3 text-sm text-brand-300">Make room for your best work.</p><h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your next chapter starts here.</h2></div><Button size="lg" onClick={() => navigate("/register")}>Get started free <FiArrowRight /></Button></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

