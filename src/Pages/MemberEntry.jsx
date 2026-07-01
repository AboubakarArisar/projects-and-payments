import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import axios from "axios";
import { URL } from "../constant";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Field, Input, Textarea } from "../components/ui/Field";
import { Button } from "../components/ui/Button";

function TeamMemberEntry() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const teamMemberData = {
      name: e.target.name.value,
      description: e.target.description.value,
      position: e.target.position.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      startDate: e.target.startDate.value,
    };

    try {
      const response = await axios.post(`${URL}/members`, teamMemberData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Member added",
          text: `${teamMemberData.name} joined your team.`,
          icon: "success",
          confirmButtonColor: "#3b82f6",
          showCancelButton: true,
          confirmButtonText: "View team",
          cancelButtonText: "Add another",
        }).then((r) => {
          if (r.isConfirmed) navigate("/teams");
        });
        e.target.reset();
      } else {
        throw new Error("Failed to add team member");
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add team member",
        icon: "error",
        confirmButtonColor: "#e11d48",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="New team member"
        subtitle="Add someone to your team so you can assign them projects."
        actions={
          <Button variant="ghost" onClick={() => navigate("/teams")}>
            <FiArrowLeft className="h-4 w-4" /> Back to team
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto w-full max-w-2xl"
      >
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name">
                <Input id="name" name="name" type="text" placeholder="Jane Doe" required />
              </Field>
              <Field label="Position" htmlFor="position">
                <Input
                  id="position"
                  name="position"
                  type="text"
                  placeholder="Frontend Developer"
                  required
                />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@company.com"
                  required
                />
              </Field>
              <Field label="Phone" htmlFor="phone">
                <Input id="phone" name="phone" type="tel" placeholder="+1 555 000 0000" required />
              </Field>
            </div>

            <Field label="Start date" htmlFor="startDate">
              <Input id="startDate" name="startDate" type="date" required />
            </Field>

            <Field label="Description" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                rows="3"
                placeholder="A short note about this member…"
                required
              />
            </Field>

            <div className="mt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                <FiCheck className="h-4 w-4" />
                {submitting ? "Saving…" : "Add member"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </>
  );
}

export default TeamMemberEntry;
