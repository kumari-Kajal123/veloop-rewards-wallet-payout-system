import React, { useEffect, useState } from "react";
import { FiGift, FiRefreshCw, FiShield, FiChevronRight, FiLogOut,} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Home() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState(null);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/wallet");

      // console.log("WALLET RESPONSE:", res.data);

      setWallet(res.data.wallet);

    } catch (error) {
      console.error("Wallet error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
        return;
      }

      setError(
        error.response?.data?.message ||
        "Unable to load wallet data."
      );

    } finally {
      setLoading(false);
    }
  };

  const fetchWalletSummary = async () => {
    try {
      const res = await api.get("/wallet/summary");

      // console.log("WALLET SUMMARY:", res.data);

      setSummary(res.data.summary);
    } catch (error) {
      console.error("Wallet summary error:", error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchWallet();
    fetchWalletSummary();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="text-3xl animate-spin mx-auto mb-3 text-cyan-400" />
          <p className="text-slate-400"> Loading your wallet...  </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold"> VEloop </h1>
            <p className="text-xs text-slate-500"> Rewards Wallet </p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition" >
            <FiLogOut />
            <span className="hidden sm:block"> Logout</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-5 py-8">
        {/* Welcome */}
        <section className="mb-8">
          <p className="text-slate-400 text-sm"> Welcome back </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-1"> {user?.name || "User"} 👋</h2>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"> {error} </div>
        )}
        {/* Main VEs Card */}
        <section className="rounded-3xl p-6 md:p-8 mb-8 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-slate-900 border border-cyan-400/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm"> Available VEs </p>
              <h3 className="text-4xl md:text-5xl font-bold mt-2">  {wallet?.VEs ?? 0} </h3>
              <p className="text-cyan-400 mt-2"> Virtual Earnings </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <FiGift className="text-cyan-400 text-2xl" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={fetchWallet} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300" >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </section>
        {/* Wallet */}
<section>
  <h3 className="text-xl font-semibold mb-4"> Your Wallet </h3>
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-sm">VEs</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1"> {summary?.VEs ?? 0} </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-sm">SVEs</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">{summary?.SVEs ?? 0} </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-sm">Gems</p>
          <p className="text-2xl font-bold text-pink-400 mt-1"> {summary?.Gems ?? 0} </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-sm">Tokens</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{summary?.Tokens ?? 0} </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-sm">Spins</p>
          <p className="text-2xl font-bold text-green-400 mt-1"> {summary?.Spins ?? 0} </p>
        </div>

  </div>
</section>
        {/* Quick Actions */}

<section className="mt-10">

  <h3 className="text-xl font-semibold mb-4">Quick Actions </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Withdraw */}
    <button onClick={() => navigate("/withdraw")} className="p-5 rounded-2xl text-left bg-white/5 border border-white/10 hover:bg-white/10 transition" >
      <FiGift className="text-cyan-400 text-2xl mb-3" />
      <h4 className="font-semibold"> Withdraw </h4>
      <p className="text-sm text-slate-400 mt-1"> Convert your available VEs into rewards.  </p>
    </button>

    {/* Withdrawal History */}
    <button onClick={() => navigate("/withdrawals")} className="p-5 rounded-2xl text-left bg-white/5 border border-white/10 hover:bg-white/10 transition" >
      <FiRefreshCw className="text-purple-400 text-2xl mb-3" />
      <h4 className="font-semibold"> Withdrawal History</h4>
      <p className="text-sm text-slate-400 mt-1"> Track your previous withdrawal requests. </p>
    </button>
    {/* Transactions */}
    <button onClick={() => navigate("/transactions")} className="p-5 rounded-2xl text-left bg-white/5 border border-white/10 hover:bg-white/10 transition" >
      <FiRefreshCw className="text-purple-400 text-2xl mb-3" />
      <h4 className="font-semibold"> Transactions </h4>
      <p className="text-sm text-slate-400 mt-1"> View your wallet transaction history. </p>
    </button>


    {/* Admin Dashboard - Admin Only */}
    {user?.role === "ADMIN" && (
      <button type="button" onClick={() => navigate("/admin/withdrawals")}  className="group p-5 rounded-2xl text-left bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/20 hover:border-cyan-400/40 hover:bg-cyan-500/15 transition-all duration-300" >
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
            <FiShield className="text-cyan-400 text-2xl" />
          </div>
          {/* Arrow */}
          <FiChevronRight className="text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition" size={20} />
        </div>
        <h4 className="font-semibold mt-4"> Admin Dashboard </h4>
        <p className="text-sm text-slate-400 mt-1"> Manage wallets and withdrawal requests.</p>
      </button>
    )}
  </div>
</section>
</main>     
</div>
  );
}