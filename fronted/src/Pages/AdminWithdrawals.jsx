import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw, FiXCircle, FiPlusCircle, FiMinusCircle,} from "react-icons/fi";
import api from "../services/api";

export default function AdminWithdrawals() {
  const navigate = useNavigate();

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [error, setError] = useState("");

  // Wallet Management
  const [walletForm, setWalletForm] = useState({
    userId: "",
    currency: "VEs",
    amount: "",
    source: "ADMIN_CREDIT",
    description: "",
  });

  const [walletLoading, setWalletLoading] = useState(false);

  // Wallet Credit / Debit
  const handleWalletAction = async (action) => {
    try {
      if (!walletForm.userId.trim()) {
        alert("Please enter User ID");
        return;
      }

      if (!walletForm.amount || Number(walletForm.amount) <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      setWalletLoading(true);

      const payload = {
        userId: walletForm.userId.trim(),
        currency: walletForm.currency,
        amount: Number(walletForm.amount),
        source:
          action === "credit"
            ? "ADMIN_CREDIT"
            : "ADMIN_DEBIT",
        description:
          walletForm.description.trim() ||
          `Admin ${action} for ${walletForm.currency}`,
      };

      const endpoint =
        action === "credit"
          ? "/wallet/credit"
          : "/wallet/debit";

      const response = await api.post(endpoint, payload);

      console.log(
        `WALLET ${action.toUpperCase()} RESPONSE:`,
        response.data
      );

      alert(
        action === "credit"
          ? "Wallet credited successfully!"
          : "Wallet debited successfully!"
      );

      setWalletForm({
        userId: "",
        currency: "VEs",
        amount: "",
        source: "ADMIN_CREDIT",
        description: "",
      });
    } catch (error) {
      console.error(
        `Wallet ${action} error:`,
        error
      );

      alert(
        error.response?.data?.message ||
          `Unable to ${action} wallet`
      );
    } finally {
      setWalletLoading(false);
    }
  };

  // Fetch Withdrawals
  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/withdrawals/admin");

      console.log(
        "ADMIN WITHDRAWALS RESPONSE:",
        response.data
      );

      setWithdrawals(response.data.withdrawals || []);
    } catch (error) {
      console.error("Admin withdrawals error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      if (error.response?.status === 403) {
        setError("Admin access required.");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load withdrawal requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // Reject Withdrawal

  const handleReject = async (withdrawalId) => {
    const reason = window.prompt(
      "Enter rejection reason:",
      "Withdrawal rejected by admin"
    );

    if (reason === null) {
      return;
    }

    try {
      setRejectingId(withdrawalId);

      const response = await api.patch(
        `/withdrawals/${withdrawalId}/reject`,
        {
          rejectionReason:
            reason.trim() ||
            "Withdrawal rejected by admin",
        }
      );

      console.log(
        "REJECT RESPONSE:",
        response.data
      );

      alert("Withdrawal rejected successfully.");

      fetchWithdrawals();
    } catch (error) {
      console.error(
        "Reject withdrawal error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to reject withdrawal."
      );
    } finally {
      setRejectingId(null);
    }
  };

  // Status Class

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-300";

      case "PROCESSING":
        return "bg-blue-500/20 text-blue-300";

      case "APPROVED":
        return "bg-green-500/20 text-green-300";

      case "REJECTED":
        return "bg-red-500/20 text-red-300";

      case "CANCELLED":
        return "bg-gray-500/20 text-gray-300";

      default:
        return "bg-white/10 text-white/70";
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white px-4 py-6 sm:px-6">
      <div className="max-w-5xl mx-auto">
            {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/home")}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
            >
              <FiArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold">
                Admin Dashboard
              </h1>

              <p className="text-sm text-white/50">
                Manage wallets and withdrawal requests
              </p>
            </div>

          </div>

          <button
            onClick={fetchWithdrawals}
            disabled={loading}
            className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 hover:bg-cyan-500/20"
          >
            <FiRefreshCw
              size={19}
              className={
                loading ? "animate-spin" : ""
              }
            />
          </button>
        </div>

            {/* Error */}


        {error && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/*   Wallet Management */}

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
              <FiPlusCircle
                className="text-cyan-400"
                size={21}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Wallet Management
              </h2>

              <p className="text-sm text-white/40">
                Credit or debit a user's wallet
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* User ID */}

            <div>
              <label className="block text-sm text-white/50 mb-2">
                User ID
              </label>

              <input
                type="text"
                value={walletForm.userId}
                onChange={(e) =>
                  setWalletForm({
                    ...walletForm,
                    userId: e.target.value,
                  })
                }
                placeholder="Enter user ID"
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Currency */}

            <div>
              <label className="block text-sm text-white/50 mb-2">
                Currency
              </label>

              <select
                value={walletForm.currency}
                onChange={(e) =>
                  setWalletForm({
                    ...walletForm,
                    currency: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-cyan-400 transition"
              >
                <option value="VEs">VEs</option>
                <option value="SVEs">SVEs</option>
                <option value="Gems">Gems</option>
                <option value="Tokens">Tokens</option>
                <option value="Spins">Spins</option>
              </select>
            </div>

            {/* Amount */}

            <div>
              <label className="block text-sm text-white/50 mb-2">
                Amount
              </label>

              <input
                type="number"
                min="1"
                value={walletForm.amount}
                onChange={(e) =>
                  setWalletForm({
                    ...walletForm,
                    amount: e.target.value,
                  })
                }
                placeholder="Enter amount"
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Source */}

            <div>
              <label className="block text-sm text-white/50 mb-2">
                Source
              </label>

              <select
                value={walletForm.source}
                onChange={(e) =>
                  setWalletForm({
                    ...walletForm,
                    source: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-cyan-400 transition"
              >
                <option value="ADMIN_CREDIT">
                  Admin Credit
                </option>

                <option value="DAILY_REWARD">
                  Daily Reward
                </option>

                <option value="BONUS">
                  Bonus
                </option>

                <option value="REFERRAL">
                  Referral
                </option>

                <option value="CORRECTION">
                  Correction
                </option>
              </select>
            </div>

          </div>

          {/* Description */}

          <div className="mt-4">

            <label className="block text-sm text-white/50 mb-2">
              Description
            </label>

            <input
              type="text"
              value={walletForm.description}
              onChange={(e) =>
                setWalletForm({
                  ...walletForm,
                  description: e.target.value,
                })
              }
              placeholder="Optional description"
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-cyan-400 transition"
            />

          </div>

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">

            <button
              type="button"
              disabled={walletLoading}
              onClick={() =>
                handleWalletAction("credit")
              }
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
            >
              <FiPlusCircle />

              {walletLoading
                ? "Processing..."
                : "Credit Wallet"}
            </button>

            <button
              type="button"
              disabled={walletLoading}
              onClick={() =>
                handleWalletAction("debit")
              }
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/20 transition disabled:opacity-50"
            >
              <FiMinusCircle />

              {walletLoading
                ? "Processing..."
                : "Debit Wallet"}
            </button>

          </div>

        </div>

        {/* Withdrawal Section */}

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="text-xl font-bold">
              Withdrawal Requests
            </h2>

            <p className="text-sm text-white/40 mt-1">
              Manage user payout requests
            </p>
          </div>

          <span className="text-sm text-white/40">
            {withdrawals.length} request
            {withdrawals.length !== 1 ? "s" : ""}
          </span>

        </div>

        {/*  Loading */}

        {loading ? (

          <div className="flex justify-center py-20">
            <div className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          </div>

        ) : withdrawals.length === 0 ? (

          /* Empty */

          <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/[0.03]">

            <p className="text-lg text-white/70">
              No withdrawal requests found.
            </p>

          </div>

        ) : (

          /* Withdrawal List */

          <div className="space-y-4">

            {withdrawals.map((withdrawal) => (

              <div
                key={
                  withdrawal._id ||
                  withdrawal.withdrawalId
                }
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5"
              >

                <div className="flex flex-col gap-4">

                  {/* Top */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div>

                      <p className="text-lg font-semibold">
                        {withdrawal.method}
                      </p>

                      <p className="text-xs text-white/40 mt-1 break-all">
                        ID: {withdrawal.withdrawalId}
                      </p>

                    </div>

                    <span
                      className={`w-fit px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                        withdrawal.status
                      )}`}
                    >
                      {withdrawal.status}
                    </span>

                  </div>

                  {/* Details */}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    <div className="rounded-xl bg-black/20 border border-white/5 p-3">

                      <p className="text-xs text-white/40">
                        Payout Amount
                      </p>

                      <p className="font-semibold mt-1">
                        ₹{withdrawal.payoutAmount}
                      </p>

                    </div>

                    <div className="rounded-xl bg-black/20 border border-white/5 p-3">

                      <p className="text-xs text-white/40">
                        Currency
                      </p>

                      <p className="font-semibold mt-1">
                        {withdrawal.currencyAmount}{" "}
                        {withdrawal.currency}
                      </p>

                    </div>

                    <div className="rounded-xl bg-black/20 border border-white/5 p-3">

                      <p className="text-xs text-white/40">
                        Requested
                      </p>

                      <p className="font-semibold mt-1">
                        {withdrawal.requestedAt
                          ? new Date(
                              withdrawal.requestedAt
                            ).toLocaleString()
                          : "N/A"}
                      </p>

                    </div>

                  </div>

                  {/* User */}

                  <div className="text-sm text-white/50">

                    User:{" "}

                    <span className="text-white/70">
                      {withdrawal.userId?.name ||
                        "Unknown User"}
                    </span>

                    {withdrawal.userId?.email && (
                      <span className="block text-xs text-white/40 mt-1">
                        {withdrawal.userId.email}
                      </span>
                    )}

                  </div>

                  {/* Rejection Reason */}

                  {withdrawal.rejectionReason && (

                    <div className="rounded-xl bg-red-500/10 border border-red-400/10 p-3">

                      <p className="text-xs text-red-300/70">
                        Rejection Reason
                      </p>

                      <p className="text-sm text-red-200 mt-1">
                        {withdrawal.rejectionReason}
                      </p>

                    </div>

                  )}

                  {/* Action */}

                  {withdrawal.status === "PENDING" && (

                    <div className="flex justify-end pt-2">

                      <button
                        onClick={() =>
                          handleReject(
                            withdrawal.withdrawalId
                          )
                        }
                        disabled={
                          rejectingId ===
                          withdrawal.withdrawalId
                        }
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                      >

                        <FiXCircle size={17} />

                        {rejectingId ===
                        withdrawal.withdrawalId
                          ? "Rejecting..."
                          : "Reject Withdrawal"}

                      </button>

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
}