import { useState } from "react";
import { useTitle } from "../hooks/useTitle";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { URL } from "../constant/index";
import { notify } from "../lib/notify";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Field, Input, Textarea, Select } from "../components/ui/Field";
import { Button } from "../components/ui/Button";

const TRXEntry = () => {
  useTitle("New transaction");
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    projectAmount: "",
    transactionType: "",
    description: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(`${URL}/transactions`, {
        title: formData.projectName,
        amount: formData.projectAmount,
        type: formData.transactionType,
        description: formData.description,
      });

      notify("Transaction added", "success");
      const type = response.data?.transactionType || formData.transactionType;
      navigate(type === "IN" ? "/incomingPayments" : "/outgoingPayments");
    } catch (error) {
      console.error("Error creating transaction entry:", error);
      notify("Failed to add transaction entry", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="New transaction"
        subtitle="Record an incoming payment or an outgoing expense."
        actions={
          <Button variant="ghost" onClick={() => navigate("/totalPayments")}>
            <FiArrowLeft className="h-4 w-4" /> All transactions
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
            <Field label="Transaction name" htmlFor="projectName">
              <Input
                required
                id="projectName"
                type="text"
                placeholder="e.g. Client milestone payment"
                value={formData.projectName}
                onChange={handleChange}
              />
            </Field>

            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Field label="Amount" htmlFor="projectAmount">
                <Input
                  required
                  id="projectAmount"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={formData.projectAmount}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Type" htmlFor="transactionType">
                <Select
                  required
                  id="transactionType"
                  value={formData.transactionType}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  <option value="IN">Incoming (IN)</option>
                  <option value="OUT">Outgoing (OUT)</option>
                </Select>
              </Field>
            </div>

            <Field label="Description" htmlFor="description">
              <Textarea
                required
                id="description"
                rows="4"
                placeholder="What is this transaction for?"
                value={formData.description}
                onChange={handleChange}
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
                {submitting ? "Saving…" : "Add transaction"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </>
  );
};

export default TRXEntry;
