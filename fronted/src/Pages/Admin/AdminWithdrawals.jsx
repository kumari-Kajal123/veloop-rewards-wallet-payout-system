
import React, { useEffect, useState } from "react";
import { FiRefreshCw, FiClock, FiCheckCircle, FiAlertCircle,} from "react-icons/fi";
import api from "../../services/api";

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        statusStyles[status] || statusStyles.CANCELLED
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchWithdrawals = async () => {
    try {
      setError("");

      const params = { page: 1, limit: 50 };

      if (statusFilter !== "ALL") {
        params.status = statusFilter;
      }

      const response = await api.get("/withdrawals/admin", { params });

      const data = response.data;
      const list = Array.isArray(data)
        ? data
        : data.withdrawals || data.data || [];

      setWithdrawals(list);
    } catch (err) {
      console.error("Admin withdrawals error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load withdrawal requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWithdrawals();
  };

  const handleApprove = async (item) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this withdrawal?"
    );

    if (!confirmed) return;
    console.log("Approve withdrawal ID:", item.withdrawalId);

    try {
      await api.patch(
        `/withdrawals/${item.withdrawalId}/approve`,
        { reviewNote: "Approved by admin" }
      );

      alert("Withdrawal approved successfully!");
      await fetchWithdrawals();
    } catch (err) {
      console.error("Approve withdrawal error:", err);
      alert(
        err.response?.data?.message ||
          "Unable to approve withdrawal."
      );
    }
  };

  const handleReject = async (item) => {
    const rejectionReason = window.prompt(
      "Enter the reason for rejecting this withdrawal:"
    );

    if (!rejectionReason?.trim()) return;

    try {
      await api.patch(
        `/withdrawals/${item.withdrawalId}/reject`,
        {
          rejectionReason: rejectionReason.trim(),
          reviewNote: "Rejected by admin",
        }
      );

      alert("Withdrawal rejected and wallet balance restored.");
      await fetchWithdrawals();
    } catch (err) {
      console.error("Reject withdrawal error:", err);
      alert(
        err.response?.data?.message ||
          "Unable to reject withdrawal."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "—"
      : parsedDate.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-emerald-700">
              ADMINISTRATION
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Withdrawal Requests
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review and monitor users’ reward withdrawal requests.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 disabled:opacity-60"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Requests shown</p>
            <p className="mt-2 text-3xl font-bold">{withdrawals.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pending requests shown</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {withdrawals.filter((item) => item.status === "PENDING").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Approved requests shown</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {withdrawals.filter((item) => item.status === "APPROVED").length}
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {["ALL", "PENDING", "PROCESSING", "APPROVED", "REJECTED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === status
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {status === "ALL" ? "All requests" : status}
              </button>
            )
          )}
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Could not load requests</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="font-bold">All withdrawal requests</h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing up to 50 requests for the selected status.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-sm text-slate-500">
              <FiRefreshCw className="animate-spin" />
              Loading withdrawal requests...
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <FiClock className="mx-auto text-3xl text-slate-300" />
              <h3 className="mt-4 font-semibold">No withdrawal requests found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another status filter or refresh the list.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Request</th>
                    <th className="px-5 py-4">Method</th>
                    <th className="px-5 py-4">Wallet debit</th>
                    <th className="px-5 py-4">Payout</th>
                    <th className="px-5 py-4">Requested</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {withdrawals.map((item) => (
                    <tr
                      key={item._id || item.withdrawalId}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {item.withdrawalId || item._id}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          User:{" "}
                          {typeof item.userId === "object"
                            ? item.userId?.email || item.userId?._id
                            : item.userId || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">{item.method || "—"}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.optionId || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {Number(item.currencyAmount || 0).toLocaleString()}{" "}
                        {item.currency || "VEs"}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {item.payoutAmount ?? "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(item.requestedAt || item.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4">
                        {item.status === "PENDING" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(item)}
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => handleReject(item)}
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">No actions</span>
                        )}
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <FiCheckCircle className="text-emerald-600" />
          This page displays withdrawal requests returned by the backend.
        </div>
      </div>
    </div>
  );
}

