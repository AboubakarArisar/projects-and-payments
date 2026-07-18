import { useState } from "react";
import { useTitle } from "../hooks/useTitle";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import axios from "axios";
import { URL } from "../constant";
import { notify } from "../lib/notify";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Field, Input, Textarea } from "../components/ui/Field";
import { Button } from "../components/ui/Button";

function ProjectEntry() {
  useTitle("New project");
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const projectData = {
      name: e.target.name.value,
      startDate: e.target.startDate.value,
      deadline: e.target.deadline.value,
      description: e.target.description.value,
      payment: e.target.payment.value ? Number(e.target.payment.value) : undefined,
    };

    try {
      const response = await axios.post(`${URL}/projects`, projectData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        notify(`${projectData.name} was created`, "success");
        navigate("/projects");
      } else {
        throw new Error("Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      notify("Failed to add project", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="New project"
        subtitle="Add a project to your board and start tracking it."
        actions={
          <Button variant="ghost" onClick={() => navigate("/projects")}>
            <FiArrowLeft className="h-4 w-4" /> Back to board
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
            <Field label="Project name" htmlFor="name">
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Website redesign"
                required
              />
            </Field>

            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Field label="Start date" htmlFor="startDate">
                <Input id="startDate" name="startDate" type="date" required />
              </Field>
              <Field label="Deadline" htmlFor="deadline">
                <Input id="deadline" name="deadline" type="date" required />
              </Field>
            </div>

            <Field
              label="Budget"
              htmlFor="payment"
              hint="Optional — total agreed payment for this project."
            >
              <Input
                id="payment"
                name="payment"
                type="number"
                min="0"
                step="any"
                placeholder="0"
              />
            </Field>

            <Field label="Description" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                rows="4"
                placeholder="What is this project about?"
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
                {submitting ? "Saving…" : "Create project"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </>
  );
}

export default ProjectEntry;
