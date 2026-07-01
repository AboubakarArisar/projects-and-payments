import { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "../components/ui/Modal";
import { Field, Input, Textarea } from "../components/ui/Field";
import { Button } from "../components/ui/Button";

const EditMemberModal = ({ member, onClose, onSave }) => {
  const [editedMember, setEditedMember] = useState({ ...member });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString || "";
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedMember);
    onClose();
  };

  return (
    <Modal
      title={`Edit ${member.name}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="editName">
          <Input
            id="editName"
            name="name"
            value={editedMember.name}
            onChange={handleInputChange}
          />
        </Field>
        <Field label="Position" htmlFor="editPosition">
          <Input
            id="editPosition"
            name="position"
            value={editedMember.position}
            onChange={handleInputChange}
          />
        </Field>
        <Field label="Email" htmlFor="editEmail">
          <Input
            id="editEmail"
            name="email"
            value={editedMember.email}
            onChange={handleInputChange}
          />
        </Field>
        <Field label="Phone" htmlFor="editPhone">
          <Input
            id="editPhone"
            name="phone"
            value={editedMember.phone}
            onChange={handleInputChange}
          />
        </Field>
      </div>

      <Field label="Start date" htmlFor="editStartDate">
        <Input
          id="editStartDate"
          name="startDate"
          value={formatDate(editedMember.startDate)}
          onChange={handleInputChange}
        />
      </Field>

      <Field label="Description" htmlFor="editDescription" className="mb-0">
        <Textarea
          id="editDescription"
          name="description"
          rows="3"
          value={editedMember.description}
          onChange={handleInputChange}
        />
      </Field>
    </Modal>
  );
};

EditMemberModal.propTypes = {
  member: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditMemberModal;
