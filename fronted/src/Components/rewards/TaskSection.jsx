
import React from "react";
import {
  FiCheckCircle,
  FiGlobe,
  FiUserPlus,
  FiShield,
  FiLock,
  FiArrowUpRight,
} from "react-icons/fi";

const tasks = [
  {
    id: 1,
    title: "Explore VEloop",
    description: "Explore your rewards wallet and discover its features.",
    reward: "Coming soon",
    icon: FiGlobe,
    category: "Getting started",
  },
  {
    id: 2,
    title: "Invite a Friend",
    description: "Invite friends to join VEloop when referrals are available.",
    reward: "Coming soon",
    icon: FiUserPlus,
    category: "Community",
  },
  {
    id: 3,
    title: "Account Security",
    description: "Keep your account details safe and up to date.",
    reward: "Coming soon",
    icon: FiShield,
    category: "Account",
  },
];

export default function TasksSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-6 md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
              <FiCheckCircle />
              EARN THROUGH ACTIVITIES
            </div>

            <h3 className="mt-3 text-2xl font-bold text-white">
              Tasks & Challenges
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Discover activities and upcoming opportunities to earn rewards.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300">
            <FiLock />
            Rewards coming soon
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            const Icon = task.icon;

            return (
              <article
                key={task.id}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                    <Icon className="text-2xl text-emerald-300" />
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-400">
                    {task.category}
                  </span>
                </div>

                <h4 className="mt-5 text-lg font-semibold text-white">
                  {task.title}
                </h4>

                <p className="mt-2 min-h-[60px] text-sm leading-6 text-slate-400">
                  {task.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-slate-500">Reward</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-300">
                      {task.reward}
                    </p>
                  </div>

                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <FiLock />
                    Unavailable
                  </span>
                </div>

                <button
                  type="button"
                  disabled
                  className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-500"
                >
                  Coming Soon
                  <FiArrowUpRight />
                </button>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Task rewards will become available when verified task functionality
          is connected to the backend.
        </p>
      </div>
    </section>
  );
}
