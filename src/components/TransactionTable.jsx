/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiInbox,
  FiTrash2,
} from "react-icons/fi";
import axios from "axios";
import { PageHeader } from "./ui/PageHeader";
import { Card } from "./ui/Card";
import { formatMoney } from "../lib/format";
import { notify } from "../lib/notify";
import { URL } from "../constant/index";

// Shared table used by Incoming / Outgoing / Total payment pages.
export const TransactionTable = ({ title, subtitle, rows, onDeleted }) => {
  const showDetails = (t) =>
    Swal.fire({
      title: t.transactionTitle,
      html: `<div style="text-align:left">
              <p style="margin-bottom:8px">${t.transactionDescription || ""}</p>
              <p><strong>Amount:</strong> ${formatMoney(
                Math.abs(t.transactionAmount)
              )}</p>
              <p><strong>Type:</strong> ${t.transactionType}</p>
            </div>`,
      confirmButtonColor: "#3b82f6",
      showCloseButton: true,
    });

  const remove = async (t) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete this transaction?",
      text: t.transactionTitle,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Delete",
    });
    if (!isConfirmed) return;
    try {
      await axios.delete(`${URL}/transactions/${t._id}`);
      onDeleted?.(t._id);
      notify("Transaction deleted", "success");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      notify("Could not delete transaction", "error");
    }
  };

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <Card className="overflow-hidden p-0">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted">
            <FiInbox className="h-8 w-8 opacity-70" />
            <p>No transactions to show.</p>
          </div>
        ) : (
          <div className="max-h-[65vh] overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-elevated/90 backdrop-blur">
                <tr className="text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((t, index) => {
                  const isIn = t.transactionType === "IN";
                  return (
                    <motion.tr
                      key={t._id || index}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.015 }}
                      className="group hover:bg-elevated/40"
                    >
                      <td className="px-4 py-3 text-muted">{index + 1}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => showDetails(t)}
                          className="inline-flex items-center gap-2 font-medium text-ink-strong hover:text-brand-300"
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-md ${
                              isIn
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-rose-500/15 text-rose-300"
                            }`}
                          >
                            {isIn ? (
                              <FiArrowDownLeft className="h-3.5 w-3.5" />
                            ) : (
                              <FiArrowUpRight className="h-3.5 w-3.5" />
                            )}
                          </span>
                          {t.transactionTitle}
                        </button>
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-muted">
                        {t.transactionDescription}
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${
                          isIn ? "text-emerald-300" : "text-rose-300"
                        }`}
                      >
                        {isIn ? "+" : "−"}
                        {formatMoney(Math.abs(t.transactionAmount))}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted">
                        {new Date(t.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted">
                        {new Date(t.transactionDate).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => remove(t)}
                          aria-label={`Delete ${t.transactionTitle}`}
                          className="rounded-lg p-1.5 text-muted opacity-0 transition-opacity hover:bg-rose-500/10 hover:text-rose-300 focus:opacity-100 group-hover:opacity-100"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
};

export default TransactionTable;
