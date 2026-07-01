import { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../constant/index";
import CustomLoader from "../Loader/Loader";
import { TransactionTable } from "../components/TransactionTable";

const TotalPaymentsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${URL}/transactions`);
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) return <CustomLoader />;

  return (
    <TransactionTable
      title="All transactions"
      subtitle="Complete ledger of incoming and outgoing payments."
      rows={rows}
    />
  );
};

export default TotalPaymentsPage;
