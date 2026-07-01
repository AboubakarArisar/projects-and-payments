import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constant/index";
import CustomLoader from "../Loader/Loader";
import { TransactionTable } from "../components/TransactionTable";

const OutgoingPayments = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutgoingTransactions = async () => {
      try {
        const response = await axios.get(`${URL}/transactions`);
        const transactions = response.data
          .filter((trx) => trx.transactionType === "OUT")
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
    fetchOutgoingTransactions();
  }, []);

  if (loading) return <CustomLoader />;

  return (
    <TransactionTable
      title="Outgoing payments"
      subtitle="Every expense paid out, oldest first."
      rows={rows}
    />
  );
};

export default OutgoingPayments;
