import React from "react";
import { FiChevronRight } from "react-icons/fi";

export default function RewardCard({
  name,
  value,
  description,
  icon,
}) {
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-sm transition">

      <div className="flex items-center justify-between mb-5">

        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          {icon}
        </div>

        <FiChevronRight
          className="text-slate-300 group-hover:text-emerald-500 transition"
        />

      </div>

      <p className="text-sm font-medium text-slate-500">
        {name}
      </p>

      <p className="text-2xl font-bold mt-1 text-slate-900">
        {Number(value || 0).toLocaleString()}
      </p>

      <p className="text-xs text-slate-400 mt-1">
        {description}
      </p>

    </div>
  );
}