import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";
import { URL } from "../constant";
import { Modal } from "../components/ui/Modal";
import { Field, Select } from "../components/ui/Field";
import { Button } from "../components/ui/Button";

const AssignmentModal = ({ member, projects, onClose }) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const available = projects.filter(
    (project) => !member?.workingOn?.includes(project._id)
  );

  const handleAssignProject = async () => {
    if (!selectedProject) return;
    setIsAssigning(true);
    try {
      const response = await axios.put(`${URL}/members/${member._id}`, {
        workingOn: [...member.workingOn, selectedProject],
        isWorking: true,
      });
      if (response.status === 200) {
        Swal.fire({
          title: "Assigned!",
          text: "Project assigned successfully.",
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
        onClose();
      } else {
        throw new Error("Failed to assign project.");
      }
    } catch (error) {
      console.error("Error assigning project:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to assign project. Please try again later.",
        icon: "error",
        confirmButtonColor: "#e11d48",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Modal
      title="Assign project"
      subtitle={`Give ${member.name} something to work on.`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssignProject}
            disabled={isAssigning || !selectedProject}
          >
            {isAssigning ? "Assigning…" : "Assign"}
          </Button>
        </>
      }
    >
      <Field label="Select project" htmlFor="project" className="mb-0">
        <Select
          id="project"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">
            {available.length ? "Choose a project…" : "No unassigned projects"}
          </option>
          {available.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </Select>
      </Field>
    </Modal>
  );
};

AssignmentModal.propTypes = {
  member: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    workingOn: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
  projects: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AssignmentModal;
