import React from "react";
import { FiCreditCard, FiRefreshCw } from "react-icons/fi";

export default function WalletCard({ wallet, onRefresh, refreshing }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-slate-900 text-white p-6 sm:p-8">
      <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
            <FiCreditCard className="text-emerald-400" />
            Total Wallet Balance
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold">
            {(wallet?.VEs ?? 0).toLocaleString()}
            <span className="text-lg font-medium text-slate-400 ml-2">
              VEs
            </span>
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Your current virtual earnings balance
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
    </section>
  );
}