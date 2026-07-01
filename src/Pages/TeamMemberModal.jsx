import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiFolderPlus } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";
import EditMemberModal from "./EditMemberModal";
import AssignmentModal from "./ProjectAssignModal";
import { URL } from "../constant";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/StatusBadge";
import { formatDate } from "../lib/format";

const TeamMemberModal = ({ member, onClose, onDelete, onEdit }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [editedMember, setEditedMember] = useState(member);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${URL}/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: `Remove ${member.name}?`,
      text: "This will permanently delete this member.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#334155",
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${URL}/members/${member._id}`);
      onDelete(member._id);
      onClose();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleSaveEdit = (editedData) => {
    onEdit(editedData);
    setEditedMember(editedData);
    onClose();
  };

  const workingOnNames =
    editedMember.workingOn?.length > 0
      ? editedMember.workingOn
          .map((id) => projects.find((p) => p._id === id)?.name)
          .filter(Boolean)
      : [];

  const Row = ({ label, value }) => (
    <div className="flex justify-between gap-4 border-b border-line py-2.5 text-sm last:border-0">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-ink">{value || "—"}</span>
    </div>
  );

  return (
    <>
      <Modal
        title={editedMember.name}
        subtitle={editedMember.position}
        onClose={onClose}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModalOpen(true)}>
              <FiEdit2 className="h-4 w-4" /> Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <FiTrash2 className="h-4 w-4" /> Delete
            </Button>
            <Button onClick={() => setAssignModalOpen(true)}>
              <FiFolderPlus className="h-4 w-4" /> Assign project
            </Button>
          </>
        }
      >
        <Row label="Email" value={editedMember.email} />
        <Row label="Phone" value={editedMember.phone} />
        <Row label="Start date" value={formatDate(editedMember.startDate)} />
        <div className="border-b border-line py-2.5">
          <p className="mb-2 text-sm text-muted">Working on</p>
          {workingOnNames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {workingOnNames.map((name) => (
                <Badge key={name} tone="brand">
                  {name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-ink">Not assigned to any project</span>
          )}
        </div>
        <div className="pt-3">
          <p className="mb-1 text-sm text-muted">Description</p>
          <p className="text-sm text-ink">{editedMember.description}</p>
        </div>
      </Modal>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditMemberModal
            member={editedMember}
            onSave={handleSaveEdit}
            onClose={() => setEditModalOpen(false)}
          />
        )}
        {isAssignModalOpen && (
          <AssignmentModal
            member={editedMember}
            projects={projects}
            onClose={() => setAssignModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

TeamMemberModal.propTypes = {
  member: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    workingOn: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default TeamMemberModal;
