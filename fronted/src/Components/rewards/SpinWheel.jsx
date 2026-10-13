
import React, { useState } from "react";
import {
  FiDisc,
  FiGift,
  FiCheckCircle,
  FiZap,
} from "react-icons/fi";

export default function SpinWheel({
  rewardStatus,
  rewardLoading,
  rewardMessage,
  onSpin,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const alreadyClaimed = rewardStatus?.spinRewardClaimed;

  const handleSpin = async () => {
    if (isAnimating || rewardLoading || alreadyClaimed) return;

    setIsAnimating(true);

    try {
      // Animate the wheel before requesting the real reward.
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await onSpin();
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/15 via-slate-900 to-slate-950 p-6 transition duration-300 hover:border-purple-400/40">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10">
            <FiDisc className="text-2xl text-purple-300" />
          </div>

          <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs text-purple-300">
            Lucky spin
          </span>
        </div>

        <h3 className="mt-5 text-xl font-bold text-white">
          Spin the Wheel
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Give the wheel a spin and discover your VEs reward.
        </p>

        <div className="relative mx-auto my-7 w-56 max-w-full">
          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 z-20 -translate-x-1/2">
            <div className="h-0 w-0 border-x-[12px] border-t-[22px] border-x-transparent border-t-yellow-300 drop-shadow-lg" />
          </div>

          {/* Wheel */}
          <div
            className={`relative aspect-square rounded-full border-[6px] border-slate-700 shadow-[0_0_35px_rgba(168,85,247,0.22)] ${
              isAnimating ? "animate-spin-wheel" : ""
            }`}
            style={{
              background:
                "conic-gradient(#8b5cf6 0deg 45deg, #06b6d4 45deg 90deg, #ec4899 90deg 135deg, #7c3aed 135deg 180deg, #0891b2 180deg 225deg, #a855f7 225deg 270deg, #db2777 270deg 315deg, #0e7490 315deg 360deg)",
            }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="absolute left-1/2 top-1/2 h-1/2 w-px origin-top bg-white/40"
                style={{
                  transform: `rotate(${index * 45}deg)`,
                }}
              />
            ))}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-yellow-300 bg-slate-950 shadow-lg">
                <FiGift className="text-2xl text-yellow-300" />
                <span className="text-[9px] font-bold text-white">VELOOP</span>
              </div>
            </div>
          </div>
        </div>

        {rewardMessage && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-purple-400/20 bg-purple-400/10 p-3 text-sm text-purple-200"
          >
            {rewardMessage}
          </div>
        )}

        <button
          type="button"
          onClick={handleSpin}
          disabled={isAnimating || rewardLoading || alreadyClaimed}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {alreadyClaimed ? (
            <>
              <FiCheckCircle />
              Already Claimed Today
            </>
          ) : isAnimating || rewardLoading ? (
            <>
              <FiZap className="animate-pulse" />
              {rewardLoading ? "Claiming Reward..." : "Spinning..."}
            </>
          ) : (
            <>
              <FiDisc />
              Spin Now
            </>
          )}
        </button>

        <p className="mt-3 text-center text-xs text-slate-500">
          One spin reward per day
        </p>
      </div>

      <style>{`
        @keyframes spin-wheel {
          from { transform: rotate(0deg); }
          to { transform: rotate(1800deg); }
        }

        .animate-spin-wheel {
          animation: spin-wheel 3s cubic-bezier(0.12, 0.75, 0.15, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-spin-wheel {
            animation-duration: 0.5s;
          }
        }
      `}</style>
    </div>
  );
}
