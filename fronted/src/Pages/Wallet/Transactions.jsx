import React, { useEffect, useState } from "react";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
  FiActivity,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import WalletCard from "../../Components/wallet/WalletCard";
import CurrencyCard from "../../Components/wallet/CurrencyCard";

export default function Transactions() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const limit = 10;

  const fetchWalletData = async (currentPage = page) => {
    try {
      setError("");

      const [
        walletResponse,
        summaryResponse,
        transactionsResponse,
      ] = await Promise.all([
        api.get("/wallet"),
        api.get("/wallet/summary"),
        api.get(
          `/wallet/transactions?page=${currentPage}&limit=${limit}`
        ),
      ]);

      setWallet(walletResponse.data.wallet);

      setSummary(summaryResponse.data.summary);

      const transactionData = transactionsResponse.data;

      setTransactions(
        transactionData.transactions ||
          transactionData.data ||
          []
      );

      setPagination(
        transactionData.pagination || null
      );

    } catch (error) {
      console.error("Wallet page error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load wallet information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData(page);
  }, [page]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWalletData(page);
  };

  const getTransactionIcon = (transaction) => {
    const type = transaction?.type;

    if (
      type === "WITHDRAWAL" ||
      type === "EXCHANGE_DEBIT" ||
      type === "ADMIN_DEBIT"
    ) {
      return (
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
          <FiArrowUpRight className="text-red-500" size={18} />
        </div>
      );
    }

    if (
      type === "REWARD" ||
      type === "BONUS" ||
      type === "REFERRAL" ||
      type === "DAILY_REWARD" ||
      type === "AD_REWARD" ||
      type === "GAME_REWARD" ||
      type === "ADMIN_CREDIT"
    ) {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <FiArrowDownLeft
            className="text-emerald-500"
            size={18}
          />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
        <FiActivity className="text-blue-500" size={18} />
      </div>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <FiCheckCircle size={14} />;

      case "PENDING":
        return <FiClock size={14} />;

      case "FAILED":
      case "REVERSED":
        return <FiXCircle size={14} />;

      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600";

      case "PENDING":
        return "bg-amber-50 text-amber-600";

      case "FAILED":
        return "bg-red-50 text-red-600";

      case "REVERSED":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  const formatType = (type = "") => {
    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const isDebit = (type) => {
    return (
      type === "WITHDRAWAL" ||
      type === "EXCHANGE_DEBIT" ||
      type === "ADMIN_DEBIT"
    );
  };

  const currencies = [
    {
      name: "VEs",
      value: summary?.VEs ?? 0,
      description: "Virtual Earnings",
      icon: "✦",
    },
    {
      name: "SVEs",
      value: summary?.SVEs ?? 0,
      description: "Special Earnings",
      icon: "◆",
    },
    {
      name: "Gems",
      value: summary?.Gems ?? 0,
      description: "Reward Gems",
      icon: "◇",
    },
    {
      name: "Tokens",
      value: summary?.Tokens ?? 0,
      description: "Reward Tokens",
      icon: "●",
    },
    {
      name: "Spins",
      value: summary?.Spins ?? 0,
      description: "Game Spins",
      icon: "↻",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#f7f9fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your wallet...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f9fc] min-h-[calc(100vh-76px)]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <p className="text-sm text-slate-500 mb-1">
              Wallet
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Transactions
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Track your wallet balance and transaction history.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-600 transition"
          >
            <FiRefreshCw
              className={refreshing ? "animate-spin" : ""}
            />

            Refresh
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Main Wallet */}
        <section className="mb-8">
          <WalletCard
            wallet={wallet}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        </section>

        {/* Currency Balances */}
        <section className="mb-8">

          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Currency Balances
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Current balance across all wallet currencies.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

            {currencies.map((currency) => (
              <CurrencyCard
                key={currency.name}
                name={currency.name}
                value={currency.value}
                description={currency.description}
                icon={currency.icon}
              />
            ))}

          </div>
        </section>

        {/* Transactions */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">

            <div>
              <h2 className="font-bold text-slate-900">
                Transaction History
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Complete wallet activity and ledger entries.
              </p>
            </div>

            <FiActivity className="text-slate-400" />

          </div>

          {transactions.length === 0 ? (

            <div className="px-6 py-14 text-center">

              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto">
                <FiActivity
                  className="text-slate-400"
                  size={22}
                />
              </div>

              <h3 className="font-semibold text-slate-800 mt-4">
                No transactions yet
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Your wallet activity will appear here.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {transactions.map((transaction) => {

                const debit = isDebit(transaction.type);

                return (
                  <div
                    key={transaction.transactionId}
                    className="px-5 sm:px-6 py-4 hover:bg-slate-50/70 transition"
                  >

                    <div className="flex items-center gap-4">

                      {/* Icon */}
                      {getTransactionIcon(transaction)}

                      {/* Details */}
                      <div className="flex-1 min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <p className="font-semibold text-sm text-slate-800">
                            {formatType(transaction.type)}
                          </p>

                          {transaction.status && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusClass(
                                transaction.status
                              )}`}
                            >
                              {getStatusIcon(transaction.status)}
                              {transaction.status}
                            </span>
                          )}

                        </div>

                        <p className="text-xs text-slate-400 mt-1">
                          {transaction.currency}

                          {transaction.source
                            ? ` • ${transaction.source}`
                            : ""}

                          {transaction.createdAt
                            ? ` • ${new Date(
                                transaction.createdAt
                              ).toLocaleDateString()}`
                            : ""}
                        </p>

                        {transaction.description && (
                          <p className="text-xs text-slate-400 mt-1 truncate max-w-md">
                            {transaction.description}
                          </p>
                        )}

                      </div>

                      {/* Amount */}
                      <div className="text-right shrink-0">

                        <p
                          className={`font-bold text-sm ${
                            debit
                              ? "text-red-500"
                              : "text-emerald-600"
                          }`}
                        >
                          {debit ? "-" : "+"}
                          {Number(
                            transaction.amount || 0
                          ).toLocaleString()}
                        </p>

                        <p className="text-[11px] text-slate-400 mt-1">
                          Balance:{" "}
                          {Number(
                            transaction.balanceAfter || 0
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

          {/* Pagination */}
          {pagination && (
            <div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex items-center justify-between">

              <p className="text-xs text-slate-400">
                Page {pagination.page || page}
                {pagination.totalPages
                  ? ` of ${pagination.totalPages}`
                  : ""}
              </p>

              <div className="flex items-center gap-2">

                <button
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((previous) => previous - 1)
                  }
                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-emerald-200 hover:text-emerald-600 transition"
                >
                  Previous
                </button>

                <button
                  disabled={
                    pagination.totalPages
                      ? page >= pagination.totalPages
                      : transactions.length < limit
                  }
                  onClick={() =>
                    setPage((previous) => previous + 1)
                  }
                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-emerald-200 hover:text-emerald-600 transition"
                >
                  Next
                </button>

              </div>

            </div>
          )}

        </section>

      </div>
    </div>
  );
}
