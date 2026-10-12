import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiEye,
  FiX,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCreditCard,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Withdrawals() {
  const navigate = useNavigate();

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchWithdrawals = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/withdrawals");

      setWithdrawals(response.data.withdrawals || []);
    } catch (error) {
      console.error("Withdrawals error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load withdrawal history."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchWithdrawalDetails = async (withdrawalId) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await api.get(
        `/withdrawals/${withdrawalId}`
      );

      setSelectedWithdrawal(response.data.withdrawal);
    } catch (error) {
      console.error("Withdrawal details error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load withdrawal details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <button
                onClick={() => navigate("/home")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
              >
                <FiArrowLeft />
                Back to Dashboard
              </button>

              <div className="mt-5">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Withdrawal History
                </h1>

                <p className="text-sm text-slate-500 mt-2">
                  Track your reward redemption requests.
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchWithdrawals(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 hover:shadow-sm transition disabled:opacity-50"
            >
              <FiRefreshCw
                className={refreshing ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 pb-28 lg:pb-10">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="min-h-[45vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <FiRefreshCw className="text-emerald-600 animate-spin" />
              </div>

              <p className="font-medium text-slate-700 mt-4">
                Loading withdrawal history...
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Please wait a moment.
              </p>
            </div>
          </div>
        ) : withdrawals.length === 0 ? (
          /* Empty state */
          <div className="min-h-[45vh] flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <FiCreditCard
                  size={26}
                  className="text-slate-400"
                />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mt-5">
                No withdrawals yet
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Your reward redemption requests will appear here
                once you make a withdrawal.
              </p>

              <button
                onClick={() => navigate("/withdraw")}
                className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
              >
                Make a Withdrawal
              </button>
            </div>
          </div>
        ) : (
          /* Withdrawal list */
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <WithdrawalCard
                key={withdrawal.withdrawalId}
                withdrawal={withdrawal}
                onViewDetails={fetchWithdrawalDetails}
                detailsLoading={detailsLoading}
              />
            ))}
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedWithdrawal && (
        <WithdrawalDetailsModal
          withdrawal={selectedWithdrawal}
          onClose={() => setSelectedWithdrawal(null)}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------
   Withdrawal Card
--------------------------------------------- */

function WithdrawalCard({
  withdrawal,
  onViewDetails,
  detailsLoading,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-slate-300 hover:shadow-sm transition">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        {/* Left */}
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FiCreditCard size={20} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">
              {withdrawal.method}
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              ₹{withdrawal.payoutAmount}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {Number(
                withdrawal.currencyAmount || 0
              ).toLocaleString()}{" "}
              {withdrawal.currency}
            </p>

            <p className="text-xs text-slate-400 mt-3">
              Requested{" "}
              {withdrawal.requestedAt
                ? new Date(
                    withdrawal.requestedAt
                  ).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end gap-3">
          <StatusBadge status={withdrawal.status} />

          <button
            onClick={() =>
              onViewDetails(withdrawal.withdrawalId)
            }
            disabled={detailsLoading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition disabled:opacity-50"
          >
            <FiEye />

            {detailsLoading
              ? "Loading..."
              : "View Details"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Status Badge
--------------------------------------------- */

function StatusBadge({ status }) {
  const statusConfig = {
    PENDING: {
      label: "Pending",
      icon: FiClock,
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },

    PROCESSING: {
      label: "Processing",
      icon: FiRefreshCw,
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
    },

    APPROVED: {
      label: "Approved",
      icon: FiCheckCircle,
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    REJECTED: {
      label: "Rejected",
      icon: FiAlertCircle,
      className:
        "bg-red-50 text-red-700 border-red-200",
    },

    CANCELLED: {
      label: "Cancelled",
      icon: FiX,
      className:
        "bg-slate-100 text-slate-600 border-slate-200",
    },
  };

  const config =
    statusConfig[status] || {
      label: status || "Unknown",
      icon: FiClock,
      className:
        "bg-slate-100 text-slate-600 border-slate-200",
    };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}

/* ---------------------------------------------
   Details Modal
--------------------------------------------- */

function WithdrawalDetailsModal({
  withdrawal,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Withdrawal Details
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Complete information about this request.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition"
          >
            <FiX />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Amount */}
          <div className="rounded-2xl bg-slate-900 text-white p-5">
            <p className="text-sm text-slate-400">
              Payout Amount
            </p>

            <div className="flex items-end justify-between gap-4 mt-2">
              <p className="text-3xl font-bold">
                ₹{withdrawal.payoutAmount}
              </p>

              <StatusBadge status={withdrawal.status} />
            </div>
          </div>

          <DetailRow
            label="Payment Method"
            value={withdrawal.method}
          />

          <DetailRow
            label="Currency Used"
            value={`${Number(
              withdrawal.currencyAmount || 0
            ).toLocaleString()} ${
              withdrawal.currency || ""
            }`}
          />

          <DetailRow
            label="Withdrawal ID"
            value={withdrawal.withdrawalId}
            breakAll
          />

          {withdrawal.transactionId && (
            <DetailRow
              label="Transaction ID"
              value={withdrawal.transactionId}
              breakAll
            />
          )}

          <DetailRow
            label="Requested At"
            value={
              withdrawal.requestedAt
                ? new Date(
                    withdrawal.requestedAt
                  ).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "N/A"
            }
          />

          {withdrawal.processedAt && (
            <DetailRow
              label="Processed At"
              value={new Date(
                withdrawal.processedAt
              ).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            />
          )}

          {/* Payout details */}
          {withdrawal.payoutDetails && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Payout Details
              </p>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                {typeof withdrawal.payoutDetails ===
                "object" ? (
                  Object.entries(
                    withdrawal.payoutDetails
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-4 py-2"
                    >
                      <span className="text-sm text-slate-500">
                        {key}
                      </span>

                      <span className="text-sm font-medium text-slate-800 text-right break-all">
                        {String(value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-800 break-all">
                    {withdrawal.payoutDetails}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Rejection */}
          {withdrawal.rejectionReason && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                Rejection Reason
              </p>

              <p className="text-sm text-red-800 mt-2">
                {withdrawal.rejectionReason}
              </p>
            </div>
          )}

          {/* Review note */}
          {withdrawal.reviewNote && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                Review Note
              </p>

              <p className="text-sm text-amber-900 mt-2">
                {withdrawal.reviewNote}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Detail Row
--------------------------------------------- */

function DetailRow({
  label,
  value,
  breakAll = false,
}) {
  return (
    <div className="flex justify-between gap-5 py-3 border-b border-slate-100">
      <span className="text-sm text-slate-500 shrink-0">
        {label}
      </span>

      <span
        className={`text-sm font-medium text-slate-800 text-right ${
          breakAll ? "break-all" : ""
        }`}
      >
        {value || "N/A"}
      </span>
    </div>
  );
}