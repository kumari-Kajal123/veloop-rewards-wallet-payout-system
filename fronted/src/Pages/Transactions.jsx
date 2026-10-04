import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Transactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/wallet/transactions");

      // console.log("TRANSACTIONS RESPONSE:", response.data);

      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Transactions error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/home")}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
            >
              <FiArrowLeft />
            </button>

            <div>
              <h1 className="text-xl font-bold">
                Transactions
              </h1>

              <p className="text-xs text-slate-500">
                Wallet transaction history
              </p>
            </div>

          </div>

          <button
            onClick={fetchTransactions}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <FiRefreshCw />
            <span className="hidden sm:block">
              Refresh
            </span>
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-5 py-8">

        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center">

              <FiRefreshCw className="text-3xl animate-spin mx-auto mb-3 text-cyan-400" />

              <p className="text-slate-400">
                Loading transactions...
              </p>

            </div>
          </div>
        ) : error ? (

          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>

        ) : transactions.length === 0 ? (

          <div className="min-h-[50vh] flex items-center justify-center">

            <div className="text-center">

              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <FiRefreshCw className="text-2xl text-slate-500" />
              </div>

              <h2 className="text-xl font-semibold">
                No Transactions Yet
              </h2>

              <p className="text-slate-500 mt-2">
                Your wallet transactions will appear here.
              </p>

            </div>

          </div>

        ) : (

          <div className="space-y-4">

            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.transactionId}
                transaction={transaction}
              />
            ))}

          </div>

        )}

      </main>
    </div>
  );
}
/* Transaction Card */
function TransactionCard({ transaction }) {

  const isPositive = transaction.amount > 0;

  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Left */}
        <div>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <span className="text-cyan-400 font-bold">
                {transaction.currency?.charAt(0)}
              </span>
            </div>

            <div>

              <h3 className="font-semibold">
                {formatType(transaction.type)}
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                {transaction.currency}
              </p>

            </div>

          </div>

          <p className="text-sm text-slate-400 mt-4">
            {transaction.description || "Wallet transaction"}
          </p>

          <p className="text-xs text-slate-600 mt-2 break-all">
            ID: {transaction.transactionId}
          </p>

        </div>


        {/* Right */}
        <div className="md:text-right">

          <p
            className={`text-2xl font-bold ${
              isPositive
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {transaction.amount}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Balance after: {transaction.balanceAfter}
          </p>

          <span
            className={`inline-block mt-3 px-3 py-1 rounded-full text-xs ${
              transaction.status === "COMPLETED"
                ? "bg-green-500/10 text-green-400"
                : transaction.status === "REVERSED"
                ? "bg-red-500/10 text-red-400"
                : "bg-yellow-500/10 text-yellow-400"
            }`}
          >
            {transaction.status}
          </span>

          <p className="text-xs text-slate-600 mt-2">
            {formatDate(transaction.createdAt)}
          </p>

        </div>

      </div>

    </div>
  );
}
/* Helpers */
function formatType(type) {
  if (!type) return "Transaction";

  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
