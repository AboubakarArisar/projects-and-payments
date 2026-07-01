import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiUserPlus, FiMail, FiBriefcase } from "react-icons/fi";
import axios from "axios";
import { URL } from "../constant";
import TeamMemberModal from "./TeamMemberModal";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/StatusBadge";
import { cn } from "../lib/cn";

const TABS = [
  { key: "all", label: "All members" },
  { key: "working", label: "On a project" },
  { key: "free", label: "Available" },
];

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const TeamDashboard = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}/members`);
        setTeamMembers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleCloseModal = () => setSelectedMember(null);

  const handleDeleteMember = async (memberId) => {
    setTeamMembers((prev) => prev.filter((m) => m._id !== memberId));
  };

  const handleEditMember = async (editedMember, memberId) => {
    try {
      setTeamMembers((prev) =>
        prev.map((m) => (m._id === memberId ? editedMember : m))
      );
      await axios.put(`${URL}/members/${memberId}`, editedMember);
    } catch (error) {
      console.error("Error editing member:", error);
    }
  };

  const filtered = teamMembers.filter((m) =>
    activeTab === "working" ? m.isWorking : activeTab === "free" ? !m.isWorking : true
  );

  return (
    <div>
      <PageHeader
        title="Team"
        subtitle="Everyone on your team and what they're working on."
        actions={
          <Button onClick={() => navigate("/addMember")}>
            <FiUserPlus className="h-4 w-4" /> Add member
          </Button>
        }
      />

      <div className="mb-6 inline-flex rounded-xl border border-line bg-surface/60 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-brand-500/20 text-ink-strong ring-1 ring-inset ring-brand-500/30"
                : "text-muted hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/addMember")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/addMember")}
          className="card flex cursor-pointer flex-col items-center gap-3 py-16 text-center text-muted transition-colors hover:border-brand-500/40 hover:bg-elevated/30 focus-ring"
        >
          <p>No members here yet.</p>
          <Button size="sm" onClick={() => navigate("/addMember")}>
            <FiUserPlus className="h-4 w-4" /> Add your first member
          </Button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((member) => (
              <motion.li
                key={member._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedMember(member)}
                className="card cursor-pointer p-5 transition-colors hover:border-brand-500/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-sm font-bold text-brand-300 ring-1 ring-inset ring-brand-500/25">
                    {initials(member.name)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-ink-strong">
                      {member.name}
                    </h3>
                    <p className="truncate text-sm text-muted">{member.position}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge tone={member.isWorking ? "success" : "neutral"}>
                    <FiBriefcase className="h-3 w-3" />
                    {member.isWorking ? "On a project" : "Available"}
                  </Badge>
                  {member.email && (
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <FiMail className="h-3.5 w-3.5" />
                      <span className="max-w-[9rem] truncate">{member.email}</span>
                    </span>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {selectedMember && (
          <TeamMemberModal
            member={selectedMember}
            onClose={handleCloseModal}
            onDelete={() => handleDeleteMember(selectedMember._id)}
            onEdit={(editedMember) =>
              handleEditMember(editedMember, selectedMember._id)
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamDashboard;
