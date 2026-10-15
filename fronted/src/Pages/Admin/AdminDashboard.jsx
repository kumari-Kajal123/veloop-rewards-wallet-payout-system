import React, { useEffect, useState } from "react";
import { FiClock, FiCheckCircle, FiXCircle, FiFileText, FiRefreshCw, FiArrowRight,} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,} from "recharts";

import { FiUsers, FiCreditCard, FiDatabase,} from "react-icons/fi";

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

const pieColors = ["#F59E0B", "#10B981", "#EF4444"];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [walletOverview, setWalletOverview] = useState({
  totalUsers: 0,
  walletCount: 0,
  totals: {
    totalVEs: 0,
    totalSVEs: 0,
    totalGems: 0,
    totalTokens: 0,
    totalSpins: 0,
  },
  users: [],
});

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setError("");
      setLoading(true);

      // Fetch recent withdrawal requests for the table
      const response = await api.get("/withdrawals/admin", {
        params: { page: 1, limit: 50 },
      });

      const data = response.data;
      const list = Array.isArray(data)
        ? data
        : data.withdrawals || data.data || [];

      setWithdrawals(list);

      // Fetch accurate statistics for ALL database records
      const statsResponse = await api.get(
        "/withdrawals/admin/statistics"
      );

      const statsData =
        statsResponse.data.statistics || statsResponse.data;

      setStatistics({
        total: Number(statsData.total) || 0,
        pending: Number(statsData.pending) || 0,
        approved: Number(statsData.approved) || 0,
        rejected: Number(statsData.rejected) || 0,
      });

      const walletResponse = await api.get(
  "/withdrawals/admin/wallet-overview"
);

const overview =
  walletResponse.data.overview || walletResponse.data;

setWalletOverview({
  totalUsers: Number(overview.totalUsers) || 0,
  walletCount: Number(overview.walletCount) || 0,
  totals: {
    totalVEs: Number(overview.totals?.totalVEs) || 0,
    totalSVEs: Number(overview.totals?.totalSVEs) || 0,
    totalGems: Number(overview.totals?.totalGems) || 0,
    totalTokens: Number(overview.totals?.totalTokens) || 0,
    totalSpins: Number(overview.totals?.totalSpins) || 0,
  },
  users: Array.isArray(overview.users) ? overview.users : [],
});

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

  const stats = statistics;

  const recentWithdrawals = withdrawals.slice(0, 5);

  const chartData = [
    { name: "Pending", count: statistics.pending },
    { name: "Approved", count: statistics.approved },
    { name: "Rejected", count: statistics.rejected },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
          
            <p className="text-sm font-semibold text-emerald-600"> VELOOP ADMIN PANEL</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard </h1>
            <p className="mt-2 text-sm text-slate-500"> Monitor withdrawal requests and review their status.</p>
          </div>

          <button onClick={fetchDashboard} disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-60" >
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsConfig.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">  {label} </span>
                <span className={`rounded-xl p-3 ${color}`}> <Icon size={20} /> </span>
              </div>
              <p className="mt-5 text-3xl font-bold text-slate-900"> {loading ? "—" : stats[key].toLocaleString()} </p>
            </div>
          ))}
        </div>

        {/* Wallet Overview */}
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900"> Wallet Overview</h2>
            <p className="mt-1 text-sm text-slate-500">  Registered users and balances across all wallet currencies. </p>
          </div>

          {/* User and wallet count */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500"> Registered Users </span>
                <span className="rounded-xl bg-blue-50 p-3 text-blue-600"><FiUsers size={20} /> </span>
              </div>
              <p className="mt-5 text-3xl font-bold text-slate-900"> {loading ? "—" : walletOverview.totalUsers.toLocaleString()} </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500"> Wallet Records </span>
                <span className="rounded-xl bg-violet-50 p-3 text-violet-600"><FiDatabase size={20} /> </span>
              </div>
              <p className="mt-5 text-3xl font-bold text-slate-900"> {loading ? "—" : walletOverview.walletCount.toLocaleString()}</p>
            </div>
          </div>

          {/* Total balances: each currency stays separate */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              { label: "Total VEs", value: walletOverview.totals.totalVEs, color: "text-emerald-600" },
              { label: "Total SVEs", value: walletOverview.totals.totalSVEs, color: "text-blue-600" },
              { label: "Total Gems", value: walletOverview.totals.totalGems, color: "text-violet-600" },
              { label: "Total Tokens", value: walletOverview.totals.totalTokens, color: "text-amber-600" },
              { label: "Total Spins", value: walletOverview.totals.totalSpins, color: "text-pink-600" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-500">
                    {item.label}
                  </span>
                  <FiCreditCard className={item.color} size={20} />
                </div>
                <p className={`mt-4 break-words text-2xl font-bold ${item.color}`}>
                  {loading ? "—" : item.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Individual user balances */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <h3 className="font-bold text-slate-900">
                User Wallet Balances
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Balance breakdown for each wallet record.
              </p>
            </div>

            {walletOverview.users.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">
                No wallet records found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4">User</th>
                      <th className="px-5 py-4">Email</th>
                      <th className="px-5 py-4">VEs</th>
                      <th className="px-5 py-4">SVEs</th>
                      <th className="px-5 py-4">Gems</th>
                      <th className="px-5 py-4">Tokens</th>
                      <th className="px-5 py-4">Spins</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {walletOverview.users.map((user, index) => (
                      <tr key={user.userId || `unknown-${index}`} className="hover:bg-slate-50">
                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {user.name || "Unknown User"}
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {user.email || "Not linked"}
                        </td>
                        <td className="px-5 py-4 font-medium text-emerald-700">
                          {(Number(user.VEs) || 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          {(Number(user.SVEs) || 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          {(Number(user.Gems) || 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          {(Number(user.Tokens) || 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          {(Number(user.Spins) || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>



        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Bar Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-slate-900"> Withdrawal Requests by Status</h2>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Requests" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-slate-900"> Withdrawal Status Distribution </h2>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) =>`${name} ${(percent * 100).toFixed(1)}%` } >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={pieColors[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Withdrawals */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Recent Withdrawal Requests </h2>
              <p className="mt-1 text-sm text-slate-500"> Latest requests returned by the API.</p>
            </div>

            <button onClick={() => navigate("/admin/withdrawals")}  className="inline-flex items-center gap-2 self-start rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700" >
              Manage Requests <FiArrowRight />
            </button>
          </div>

          {loading ? (
            <p className="p-8 text-center text-sm text-slate-500">  Loading dashboard...</p>
          ) : recentWithdrawals.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500"> No withdrawal requests found. </p>
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
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "REJECTED"
                              ? "bg-red-50 text-red-700"
                              : item.status === "PENDING"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
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
