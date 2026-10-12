import React from "react";
import { FiArrowUpRight, FiTrendingUp } from "react-icons/fi";

export default function BalanceCard({ balance, onWithdraw }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-slate-900 text-white p-6 sm:p-8 lg:p-9">

      <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="absolute -left-20 -bottom-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

          <div>
            <div className="flex items-center gap-2 text-slate-300 text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Available VEs
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                {Number(balance || 0).toLocaleString()}
              </h2>

              <span className="text-slate-400 text-lg">
                VEs
              </span>
            </div>

            <p className="text-slate-400 text-sm mt-3">
              Your available virtual earnings balance
            </p>
          </div>

          <button
            onClick={onWithdraw}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-300 transition"
          >
            Withdraw Rewards
            <FiArrowUpRight />
          </button>

        </div>

        <div className="mt-7 pt-5 border-t border-white/10 flex items-center gap-2 text-sm text-slate-400">
          <FiTrendingUp className="text-emerald-400" />
          Use your VEs to redeem available rewards
        </div>

      </div>
    </section>
  );
}
