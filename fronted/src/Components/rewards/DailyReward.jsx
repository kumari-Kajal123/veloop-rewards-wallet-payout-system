
import React from "react";
import { FiCalendar, FiCheckCircle, FiGift } from "react-icons/fi";

export default function DailyReward({
  rewardStatus,
  rewardLoading,
  rewardMessage,
  onClaim,
}) {
  const alreadyClaimed = rewardStatus?.dailyRewardClaimed;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-6 transition duration-300 hover:border-cyan-400/50 hover:-translate-y-1">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
            <FiCalendar className="text-2xl text-cyan-400" />
          </div>

          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
            Daily bonus
          </span>
        </div>

        <h3 className="mt-5 text-xl font-bold text-white">
          Daily Reward
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Come back every day and claim your reward to grow your VEs balance.
        </p>

        <div className="my-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
            <FiGift className="text-xl text-cyan-400" />
          </div>

          <div>
            <p className="text-xs text-slate-500">Your daily reward</p>
            <p className="font-semibold text-white">VEs bonus</p>
          </div>
        </div>

        {rewardMessage && (
          <p
            role="status"
            className="mb-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm text-cyan-300"
          >
            {rewardMessage}
          </p>
        )}

        <button
          type="button"
          onClick={onClaim}
          disabled={rewardLoading || alreadyClaimed}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {alreadyClaimed ? (
            <>
              <FiCheckCircle />
              Claimed Today
            </>
          ) : rewardLoading ? (
            "Claiming..."
          ) : (
            <>
              <FiGift />
              Claim Daily Reward
            </>
          )}
        </button>

        <p className="mt-3 text-center text-xs text-slate-500">
          One claim per day
        </p>
      </div>
    </div>
  );
}
