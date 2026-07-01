import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiDollarSign,
  FiPlus,
  FiUserPlus,
  FiFilePlus,
  FiArrowRight,
} from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { URL } from "../constant";
import { formatMoney } from "../lib/format";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/StatusBadge";

function ProjectsPanel() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await axios.get(`${URL}/projects`);
        setProjects(res.data);
      } catch (e) {
        console.error("Error fetching projects:", e);
        setProjects([]);
      }
    };
    getProjects();
  }, []);

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink-strong">
          Recent projects
        </h2>
        <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
          View board <FiArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {projects === null ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card h-28 animate-pulse opacity-60" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card
          role="button"
          tabIndex={0}
          onClick={() => navigate("/prEntry")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/prEntry")}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 py-12 text-center transition-colors hover:border-brand-500/40 hover:bg-elevated/30 focus-ring"
        >
          <p className="text-muted">No projects yet.</p>
          <Button size="sm" onClick={() => navigate("/prEntry")}>
            <FiPlus className="h-4 w-4" /> Create your first project
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.button
              key={project._id || index}
              type="button"
              onClick={() => navigate("/projects")}
              whileHover={{ y: -3 }}
              className="card group p-5 text-left transition-colors hover:border-brand-500/40"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold capitalize text-ink-strong">
                  {project.name}
                </h3>
                <StatusBadge status={project.status} />
              </div>
              {project.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {project.description}
                </p>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </section>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [incoming, setIncoming] = useState(0);
  const [outgoing, setOutgoing] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${URL}/transactions`);

        const incomingTotal = res.data.reduce(
          (sum, t) =>
            t.transactionType === "IN" ? sum + t.transactionAmount : sum,
          0
        );
        const outgoingTotal = res.data.reduce(
          (sum, t) =>
            t.transactionType === "OUT" ? sum - t.transactionAmount : sum,
          0
        );

        setIncoming(incomingTotal);
        setOutgoing(outgoingTotal);
        setTotal(incomingTotal + outgoingTotal);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Your projects and cash flow at a glance."
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate("/addMember")}>
              <FiUserPlus className="h-4 w-4" /> Add member
            </Button>
            <Button onClick={() => navigate("/prEntry")}>
              <FiPlus className="h-4 w-4" /> New project
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Incoming payments"
          value={formatMoney(incoming)}
          tone="emerald"
          icon={<FiArrowDownCircle className="h-5 w-5" />}
          hint="Total received"
          onClick={() => navigate("/incomingPayments")}
        />
        <StatCard
          label="Outgoing payments"
          value={formatMoney(Math.abs(outgoing))}
          tone="rose"
          icon={<FiArrowUpCircle className="h-5 w-5" />}
          hint="Total spent"
          onClick={() => navigate("/outgoingPayments")}
        />
        <StatCard
          label="Net balance"
          value={formatMoney(total)}
          tone="brand"
          icon={<FiDollarSign className="h-5 w-5" />}
          hint="Incoming minus outgoing"
          onClick={() => navigate("/totalPayments")}
        />
      </div>

      <ProjectsPanel />

      <div className="mt-10 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => navigate("/prEntry")}>
          <FiPlus className="h-4 w-4" /> Add project
        </Button>
        <Button variant="secondary" onClick={() => navigate("/addMember")}>
          <FiUserPlus className="h-4 w-4" /> Add team member
        </Button>
        <Button variant="secondary" onClick={() => navigate("/transactionEntry")}>
          <FiFilePlus className="h-4 w-4" /> Add transaction
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
