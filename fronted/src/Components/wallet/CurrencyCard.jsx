import React from "react";

export default function CurrencyCard({
  name,
  value,
  description,
  icon,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-sm transition">

      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-5">
        {icon}
      </div>

      <p className="text-sm font-medium text-slate-500">
        {name}
      </p>

      <p className="text-2xl font-bold text-slate-900 mt-1">
        {Number(value || 0).toLocaleString()}
      </p>

      <p className="text-xs text-slate-400 mt-1">
        {description}
      </p>

    </div>
  );
}