import { useState, useEffect } from "react";
import { useTitle } from "../hooks/useTitle";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FiZap,
  FiFolderPlus,
  FiCopy,
  FiCheckSquare,
  FiPlus,
  FiClock,
  FiTrash2,
} from "react-icons/fi";
import { URL } from "../constant";
import { notify } from "../lib/notify";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Field, Input, Select } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/StatusBadge";

const TABS = [
  { key: "analyzer", label: "Requirement Analyzer" },
  { key: "proposal", label: "Proposal" },
  { key: "gig", label: "Gig" },
  { key: "reply", label: "Client Reply" },
  { key: "notes", label: "Meeting Notes" },
];

const today = () => new Date().toISOString().slice(0, 10);
const lines = (s) => (s || "").split("\n").map((l) => l.trim()).filter(Boolean);

const postAi = async (path, body) => {
  const { data } = await axios.post(`${URL}/ai/${path}`, body);
  return data;
};
const aiError = (error, fallback) => {
  console.error(error);
  notify(error.response?.data?.error || fallback, "error");
};
const copy = (text) =>
  navigator.clipboard
    ?.writeText(text)
    .then(() => notify("Copied to clipboard", "success"))
    .catch(() => notify("Could not copy", "error"));

const CONTROL =
  "w-full rounded-xl border border-line bg-bg/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus-ring focus-visible:border-brand-500/60 resize-none";

/* ── Read-only presentation blocks ────────────────────────────────── */

const Section = ({ title, children }) => (
  <div className="space-y-2">
    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted/70">
      {title}
    </h4>
    {children}
  </div>
);

const Prose = ({ text }) => (
  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
    {text || "—"}
  </p>
);

const Bullets = ({ items }) =>
  items.length ? (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-muted">—</p>
  );

const TextField = ({ title, value }) => (
  <Section title={title}>
    <Prose text={value} />
  </Section>
);

const ListField = ({ title, items }) => (
  <Section title={title}>
    <Bullets items={items} />
  </Section>
);

// Big input + generate button, with an optional control slot (e.g. tone).
function InputPanel({ label, hint, placeholder, value, onChange, onRun, loading, cta, extra }) {
  return (
    <Card className="p-6">
      <Field label={label} htmlFor="ai-input" hint={hint}>
        <textarea
          id="ai-input"
          rows="6"
          className={CONTROL}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        {extra && <div className="mr-auto">{extra}</div>}
        <Button className={extra ? "" : "ml-auto"} onClick={onRun} disabled={loading || !value.trim()}>
          <FiZap className="h-4 w-4" />
          {loading ? "Generating…" : cta}
        </Button>
      </div>
    </Card>
  );
}

// Compact inline tone picker for prose generators.
const TonePicker = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted">Tone</span>
    <Select value={value} onChange={onChange} className="w-40">
      {TONES.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </Select>
  </div>
);

// Result shell: chips left, actions + New right.
function ResultCard({ chips, onNew, actions, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
          <div className="flex flex-wrap gap-2">{chips}</div>
          <div className="ml-auto flex flex-wrap gap-2">
            {actions}
            <Button variant="ghost" size="sm" onClick={onNew}>
              <FiPlus className="h-3.5 w-3.5" /> New
            </Button>
          </div>
        </div>
        {children}
      </Card>
    </motion.div>
  );
}

/* ── History (per tab, persisted in MongoDB) ──────────────────────── */

const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

function useAiHistory(tab) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let active = true;
    axios
      .get(`${URL}/ai/history`, { params: { tab } })
      .then((r) => active && setHistory(r.data))
      .catch((e) => console.error("Error loading history:", e));
    return () => {
      active = false;
    };
  }, [tab]);

  const save = async (title, input, data) => {
    try {
      const { data: entry } = await axios.post(`${URL}/ai/history`, { tab, title, input, data });
      setHistory((h) => [entry, ...h]);
    } catch (e) {
      console.error("Error saving history:", e);
    }
  };
  const remove = async (id) => {
    try {
      await axios.delete(`${URL}/ai/history/${id}`);
      setHistory((h) => h.filter((x) => x._id !== id));
    } catch (e) {
      console.error("Error deleting history:", e);
    }
  };
  const clear = async () => {
    try {
      await axios.delete(`${URL}/ai/history`, { params: { tab } });
      setHistory([]);
    } catch (e) {
      console.error("Error clearing history:", e);
    }
  };
  return { history, save, remove, clear };
}

function HistoryBar({ history, onSelect, onRemove, onClear }) {
  if (!history.length) return null;
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted/70">
          <FiClock className="h-3.5 w-3.5" /> History
        </div>
        <button onClick={onClear} className="text-xs text-muted transition-colors hover:text-rose-300">
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((h) => (
          <div
            key={h._id}
            className="group flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 transition-colors hover:border-brand-500/40"
          >
            <button onClick={() => onSelect(h)} className="text-left">
              <span className="block max-w-[220px] truncate text-xs font-medium text-ink">
                {h.title || "Untitled"}
              </span>
              <span className="text-[11px] text-muted">
                {timeAgo(new Date(h.createdAt).getTime())}
              </span>
            </button>
            <button
              onClick={() => onRemove(h._id)}
              className="text-muted opacity-0 transition-opacity hover:text-rose-300 group-hover:opacity-100"
              aria-label="Remove"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

const Panel = ({ children }) => <div className="space-y-5">{children}</div>;

/* ── Feature 1 — Requirement Analyzer ─────────────────────────────── */
function RequirementAnalyzer() {
  const navigate = useNavigate();
  const hist = useAiHistory("analyzer");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [project, setProject] = useState(null); // editable create-project form

  const apply = (d) => {
    setData(d);
    setProject({
      name: (d.summary || "").split(/[.\n]/)[0].slice(0, 60),
      startDate: today(),
      deadline: today(),
      payment: (d.suggestedBudgetRange?.match(/[\d,]+/)?.[0] || "").replace(/,/g, ""),
    });
  };
  const setP = (key) => (e) => setProject((p) => ({ ...p, [key]: e.target.value }));

  const analyze = async () => {
    setLoading(true);
    try {
      const d = await postAi("analyze-requirements", { text: input });
      apply(d);
      hist.save(d.summary?.split(/[.\n]/)[0].slice(0, 50) || input.slice(0, 50), input, d);
    } catch (e) {
      aiError(e, "Failed to analyze. Try again.");
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setData(null);
    setProject(null);
    setInput("");
  };
  const load = (h) => {
    setInput(h.input);
    apply(h.data);
  };

  const createProject = async () => {
    setSaving(true);
    const description = [
      data.summary,
      data.requestedFeatures?.length && `\nRequested features:\n${data.requestedFeatures.join("\n")}`,
    ]
      .filter(Boolean)
      .join("\n");
    try {
      const res = await axios.post(`${URL}/projects`, {
        name: project.name,
        startDate: project.startDate,
        deadline: project.deadline,
        description,
        payment: project.payment ? Number(project.payment) : undefined,
      });
      if (res.status !== 201) throw new Error("bad status");
      notify(`${project.name} was created`, "success");
      navigate("/projects");
    } catch (e) {
      aiError(e, "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel>
      <InputPanel
        label="Client message"
        hint="Paste a WhatsApp chat, email, or meeting notes. Gemini extracts the scope — nothing is saved until you say so."
        placeholder="e.g. Hi, we need a website for our bakery with online ordering and a way to take payments…"
        value={input}
        onChange={setInput}
        onRun={analyze}
        loading={loading}
        cta="Analyze"
      />
      <HistoryBar history={hist.history} onSelect={load} onRemove={hist.remove} onClear={hist.clear} />

      {data && (
        <ResultCard
          onNew={reset}
          chips={[
            <Badge key="c" tone="brand">Complexity: {data.estimatedComplexity}</Badge>,
            <Badge key="t" tone="neutral">Timeline: {data.suggestedTimeline}</Badge>,
            <Badge key="b" tone="neutral">Budget: {data.suggestedBudgetRange}</Badge>,
          ]}
        >
          <TextField title="Summary" value={data.summary} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ListField title="Requested features" items={data.requestedFeatures || []} />
            <ListField title="Missing / unclear" items={data.missingRequirements || []} />
          </div>
          <ListField title="Questions to ask" items={data.questionsToAsk || []} />

          <div className="rounded-xl border border-line bg-elevated/30 p-4">
            <p className="mb-3 text-sm font-medium text-ink">Create a project from this</p>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Field label="Project name" htmlFor="a-name">
                <Input id="a-name" value={project.name} onChange={setP("name")} />
              </Field>
              <Field label="Budget" htmlFor="a-pay">
                <Input id="a-pay" type="number" min="0" value={project.payment} onChange={setP("payment")} />
              </Field>
              <Field label="Start date" htmlFor="a-start">
                <Input id="a-start" type="date" value={project.startDate} onChange={setP("startDate")} />
              </Field>
              <Field label="Deadline" htmlFor="a-dead">
                <Input id="a-dead" type="date" value={project.deadline} onChange={setP("deadline")} />
              </Field>
            </div>
            <div className="flex justify-end">
              <Button onClick={createProject} disabled={saving || !project.name.trim()}>
                <FiFolderPlus className="h-4 w-4" />
                {saving ? "Creating…" : "Create project"}
              </Button>
            </div>
          </div>
        </ResultCard>
      )}
    </Panel>
  );
}

/* ── Feature 2 — Proposal Generator ───────────────────────────────── */
function ProposalGenerator() {
  const hist = useAiHistory("proposal");
  const [input, setInput] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const run = async () => {
    setLoading(true);
    try {
      const d = await postAi("proposal", { text: input, tone });
      setData(d);
      hist.save(`${tone} · ${input.slice(0, 40)}`, input, d);
    } catch (e) {
      aiError(e, "Failed to generate proposal");
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setData(null);
    setInput("");
  };
  const load = (h) => {
    setInput(h.input);
    setData(h.data);
  };

  const asText = () =>
    [
      data.greeting,
      data.requirementUnderstanding,
      data.solution,
      `Deliverables:\n${(data.deliverables || []).map((d) => `• ${d}`).join("\n")}`,
      `Timeline: ${data.timeline}`,
      `Pricing: ${data.pricingPlaceholder}`,
      data.closing,
    ].join("\n\n");

  return (
    <Panel>
      <InputPanel
        label="Project brief or requirements"
        hint="Paste what the client wants. Pick a tone, and Gemini drafts a proposal you can copy and send."
        placeholder="e.g. Client needs a landing page + booking form for a dental clinic, live in 3 weeks…"
        value={input}
        onChange={setInput}
        onRun={run}
        loading={loading}
        cta="Generate proposal"
        extra={<TonePicker value={tone} onChange={(e) => setTone(e.target.value)} />}
      />
      <HistoryBar history={hist.history} onSelect={load} onRemove={hist.remove} onClear={hist.clear} />

      {data && (
        <ResultCard
          onNew={reset}
          chips={[
            <Badge key="tone" tone="brand">{tone}</Badge>,
            <Badge key="t" tone="neutral">Timeline: {data.timeline}</Badge>,
          ]}
          actions={
            <Button variant="secondary" size="sm" onClick={() => copy(asText())}>
              <FiCopy className="h-3.5 w-3.5" /> Copy
            </Button>
          }
        >
          <TextField title="Greeting" value={data.greeting} />
          <TextField title="Requirement understanding" value={data.requirementUnderstanding} />
          <TextField title="Solution" value={data.solution} />
          <ListField title="Deliverables" items={data.deliverables || []} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField title="Timeline" value={data.timeline} />
            <TextField title="Pricing" value={data.pricingPlaceholder} />
          </div>
          <TextField title="Closing" value={data.closing} />
        </ResultCard>
      )}
    </Panel>
  );
}

/* ── Feature 3 — Gig Generator ────────────────────────────────────── */
const PKG_KEYS = ["basic", "standard", "premium"];

function GigGenerator() {
  const hist = useAiHistory("gig");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [gig, setGig] = useState(null);

  const run = async () => {
    setLoading(true);
    try {
      const d = await postAi("gig", { text: input });
      setGig(d);
      hist.save(d.title?.slice(0, 50) || input.slice(0, 50), input, d);
    } catch (e) {
      aiError(e, "Failed to generate gig");
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setGig(null);
    setInput("");
  };
  const load = (h) => {
    setInput(h.input);
    setGig(h.data);
  };

  return (
    <Panel>
      <InputPanel
        label="Service you offer"
        hint="Describe the gig. Gemini writes SEO copy, tags, FAQs, and three tiered packages."
        placeholder="e.g. I build fast, responsive React landing pages for startups…"
        value={input}
        onChange={setInput}
        onRun={run}
        loading={loading}
        cta="Generate gig"
      />
      <HistoryBar history={hist.history} onSelect={load} onRemove={hist.remove} onClear={hist.clear} />

      {gig && (
        <ResultCard onNew={reset} chips={[]}>
          <Section title="Gig title">
            <p className="text-base font-semibold text-ink-strong">{gig.title}</p>
          </Section>
          <TextField title="SEO description" value={gig.seoDescription} />
          <TextField title="Short description" value={gig.shortDescription} />

          <Section title="Search tags">
            <div className="flex flex-wrap gap-1.5">
              {(gig.tags || []).filter(Boolean).map((t, i) => (
                <Badge key={i} tone="neutral">{t}</Badge>
              ))}
            </div>
          </Section>

          <Section title="Packages">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PKG_KEYS.map((key) => {
                const p = gig.packages?.[key];
                if (!p) return null;
                return (
                  <div key={key} className="space-y-2 rounded-xl border border-line bg-elevated/30 p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-ink-strong">{p.name}</span>
                      <span className="text-sm font-medium text-brand-300">{p.price}</span>
                    </div>
                    <p className="text-xs text-muted">{p.description}</p>
                    <Bullets items={p.features || []} />
                  </div>
                );
              })}
            </div>
          </Section>

          <Section title="FAQs">
            <div className="space-y-3">
              {(gig.faqs || []).map((f, i) => (
                <div key={i} className="rounded-xl border border-line p-4">
                  <p className="text-sm font-medium text-ink">{f.question}</p>
                  <p className="mt-1 text-sm text-muted">{f.answer}</p>
                </div>
              ))}
            </div>
          </Section>

          <ListField title="Pricing suggestions" items={gig.pricingSuggestions || []} />
        </ResultCard>
      )}
    </Panel>
  );
}

/* ── Feature 4 — Client Reply Generator ───────────────────────────── */
const SCENARIOS = ["New Inquiry", "Project Update", "Delay", "Revision", "Payment Reminder", "Completion"];
const TONES = ["Professional", "Friendly", "Formal", "Confident"];

function ClientReply() {
  const hist = useAiHistory("reply");
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState(null);

  const run = async () => {
    setLoading(true);
    try {
      const d = await postAi("reply", { scenario, tone, context });
      setReply(d.reply);
      hist.save(`${scenario} · ${tone}`, JSON.stringify({ scenario, tone, context }), d);
    } catch (e) {
      aiError(e, "Failed to generate reply");
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setReply(null);
    setContext("");
  };
  const load = (h) => {
    try {
      const i = JSON.parse(h.input);
      setScenario(i.scenario);
      setTone(i.tone);
      setContext(i.context || "");
    } catch {
      /* ignore malformed */
    }
    setReply(h.data.reply);
  };

  return (
    <Panel>
      <Card className="space-y-4 p-6">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field label="Situation" htmlFor="r-scen">
            <Select id="r-scen" value={scenario} onChange={(e) => setScenario(e.target.value)}>
              {SCENARIOS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Tone" htmlFor="r-tone">
            <Select id="r-tone" value={tone} onChange={(e) => setTone(e.target.value)}>
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Context (optional)" htmlFor="r-ctx" hint="Any details to tailor the reply — client name, what happened, dates.">
          <textarea
            id="r-ctx"
            rows="4"
            className={CONTROL}
            placeholder="e.g. Milestone 1 done, need one more week for the payment integration…"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </Field>
        <div className="flex justify-end">
          <Button onClick={run} disabled={loading}>
            <FiZap className="h-4 w-4" />
            {loading ? "Generating…" : "Generate reply"}
          </Button>
        </div>
      </Card>
      <HistoryBar history={hist.history} onSelect={load} onRemove={hist.remove} onClear={hist.clear} />

      {reply !== null && (
        <ResultCard
          onNew={reset}
          chips={[
            <Badge key="s" tone="brand">{scenario}</Badge>,
            <Badge key="t" tone="neutral">{tone}</Badge>,
          ]}
          actions={
            <Button variant="secondary" size="sm" onClick={() => copy(reply)}>
              <FiCopy className="h-3.5 w-3.5" /> Copy
            </Button>
          }
        >
          <Prose text={reply} />
        </ResultCard>
      )}
    </Panel>
  );
}

/* ── Feature 5 — Meeting Notes Summarizer ─────────────────────────── */
function MeetingNotes() {
  const hist = useAiHistory("notes");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    axios
      .get(`${URL}/projects`)
      .then((r) => setProjects(r.data))
      .catch((e) => console.error("Error fetching projects:", e));
  }, []);

  const run = async () => {
    setLoading(true);
    try {
      const d = await postAi("meeting-notes", { text: input });
      setData(d);
      hist.save(d.summary?.slice(0, 50) || input.slice(0, 50), input, d);
    } catch (e) {
      aiError(e, "Failed to summarize notes");
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setData(null);
    setInput("");
  };
  const load = (h) => {
    setInput(h.input);
    setData(h.data);
  };

  const addTasks = async () => {
    const items = data.actionItems || [];
    if (!projectId) return notify("Pick a project first", "error");
    if (!items.length) return notify("No action items to add", "error");
    setSaving(true);
    try {
      await Promise.all(
        items.map((item) =>
          axios.post(`${URL}/tasks`, {
            name: item.slice(0, 120),
            description: item,
            deadline: today(),
            status: "TODO",
            project: projectId,
          })
        )
      );
      notify(`Added ${items.length} task${items.length > 1 ? "s" : ""}`, "success");
    } catch (e) {
      aiError(e, "Failed to add tasks");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel>
      <InputPanel
        label="Meeting notes"
        hint="Paste raw notes. Gemini pulls out a summary, action items, decisions, and follow-ups."
        placeholder="e.g. Call with Acme — agreed on scope, they'll send logo assets, launch target end of month…"
        value={input}
        onChange={setInput}
        onRun={run}
        loading={loading}
        cta="Summarize"
      />
      <HistoryBar history={hist.history} onSelect={load} onRemove={hist.remove} onClear={hist.clear} />

      {data && (
        <ResultCard onNew={reset} chips={[]}>
          <TextField title="Summary" value={data.summary} />
          <ListField title="Action items" items={data.actionItems || []} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ListField title="Decisions" items={data.decisions || []} />
            <ListField title="Follow-up questions" items={data.followUpQuestions || []} />
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-line bg-elevated/30 p-4 sm:flex-row sm:items-end">
            <Field label="Add action items as tasks in" htmlFor="n-proj" className="mb-0 flex-1">
              <Select id="n-proj" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="" disabled>Select a project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </Select>
            </Field>
            <Button onClick={addTasks} disabled={saving}>
              <FiCheckSquare className="h-4 w-4" />
              {saving ? "Adding…" : "Add as tasks"}
            </Button>
          </div>
        </ResultCard>
      )}
    </Panel>
  );
}

const PANELS = {
  analyzer: RequirementAnalyzer,
  proposal: ProposalGenerator,
  gig: GigGenerator,
  reply: ClientReply,
  notes: MeetingNotes,
};

const AiAssistant = () => {
  useTitle("AI Assistant");
  const [tab, setTab] = useState("analyzer");
  const ActivePanel = PANELS[tab];

  return (
    <>
      <PageHeader
        title="AI Assistant"
        subtitle="Turn raw client messages into structured work — nothing is saved without your confirmation."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors " +
              (tab === t.key
                ? "border-brand-500/40 bg-brand-500/15 text-ink-strong"
                : "border-line text-muted hover:bg-elevated/60 hover:text-ink")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <ActivePanel />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;
