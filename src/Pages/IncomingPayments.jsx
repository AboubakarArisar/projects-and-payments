import { useEffect, useState } from "react";
import { useTitle } from "../hooks/useTitle";
import axios from "axios";
import { URL } from "../constant/index";
import CustomLoader from "../components/tailwindLoader";
import { TransactionTable } from "../components/TransactionTable";

const IncomingPayments = () => {
  useTitle("Incoming payments");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncomingTransactions = async () => {
      try {
        const response = await axios.get(`${URL}/transactions`);
        const transactions = response.data
          .filter((trx) => trx.transactionType === "IN")
          .sort(
            (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate)
          );
        setRows(transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncomingTransactions();
  }, []);

  if (loading) return <CustomLoader />;

  return (
    <TransactionTable
      title="Incoming payments"
      subtitle="Every payment received, oldest first."
      rows={rows}
      onDeleted={(id) => setRows((r) => r.filter((t) => t._id !== id))}
    />
  );
};

export default IncomingPayments;
