
import React, { useEffect, useState } from "react";
import { FiClock, FiCheckCircle, FiXCircle, FiFileText, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const statsConfig = [
  {
    key: "total",
    label: "Total Requests",
    icon: FiFileText,
    color: "bg-violet-50 text-violet-600",
  },
  {
    key: "pending",
    label: "Pending",
    icon: FiClock,
    color: "bg-amber-50 text-amber-600",
  },
  {
    key: "approved",
    label: "Approved",
    icon: FiCheckCircle,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: FiXCircle,
    color: "bg-red-50 text-red-600",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setError("");
      setLoading(true);

      const response = await api.get("/withdrawals/admin", {
        params: { page: 1, limit: 50 },
      });

      const data = response.data;
      const list = Array.isArray(data)
        ? data
        : data.withdrawals || data.data || [];

      setWithdrawals(list);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter((item) => item.status === "PENDING").length,
    approved: withdrawals.filter((item) => item.status === "APPROVED").length,
    rejected: withdrawals.filter((item) => item.status === "REJECTED").length,
  };

  const recentWithdrawals = withdrawals.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              VELOOP ADMIN PANEL
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor withdrawal requests and review their status.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsConfig.map(({ key, label, icon: Icon, color }) => (
            <div
              key={key}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  {label}
                </span>
                <span className={`rounded-xl p-3 ${color}`}>
                  <Icon size={20} />
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold text-slate-900">
                {loading ? "—" : stats[key]}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Withdrawal Requests
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest requests returned by the API.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/withdrawals")}
              className="inline-flex items-center gap-2 self-start rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Manage Requests <FiArrowRight />
            </button>
          </div>

          {loading ? (
            <p className="p-8 text-center text-sm text-slate-500">
              Loading dashboard...
            </p>
          ) : recentWithdrawals.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">
              No withdrawal requests found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Withdrawal ID</th>
                    <th className="px-5 py-4">Currency</th>
                    <th className="px-5 py-4">Payout</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentWithdrawals.map((item) => (
                    <tr key={item._id || item.withdrawalId}>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {item.withdrawalId || item._id}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {Number(item.currencyAmount || 0).toLocaleString()}{" "}
                        {item.currency || "VEs"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {item.payoutAmount ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.status === "REJECTED"
                            ? "bg-red-50 text-red-700"
                            : item.status === "PENDING"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {item.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}