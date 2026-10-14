import React from "react";
import { FiGift, FiClock, FiArrowUpRight,} from "react-icons/fi";

export default function QuickActions({ onWithdraw, onTransactions, onHistory }) {
  const actions = [
    {
      title: "Withdraw",
      description: "Convert your VEs into rewards.",
      icon: FiGift,
      color: "emerald",
      onClick: onWithdraw,
    },
    {
      title: "Transactions",
      description: "View your wallet activity.",
      icon: FiClock,
      color: "blue",
      onClick: onTransactions,
    },
    {
      title: "Withdrawal History",
      description: "Track your previous withdrawals.",
      icon: FiClock,
      color: "purple",
      onClick: onHistory,
    },
  ];

  const colors = {
    emerald: {
      box: "bg-emerald-50 text-emerald-600",
      hover: "group-hover:text-emerald-500",
      border: "hover:border-emerald-300",
    },
    blue: {
      box: "bg-blue-50 text-blue-600",
      hover: "group-hover:text-blue-500",
      border: "hover:border-blue-300",
    },
    purple: {
      box: "bg-purple-50 text-purple-600",
      hover: "group-hover:text-purple-500",
      border: "hover:border-purple-300",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {actions.map((action) => {
        const Icon = action.icon;
        const style = colors[action.color];

        return (
          <button key={action.title} onClick={action.onClick}  className={`group text-left bg-white border border-slate-200 rounded-2xl p-5 ${style.border} hover:shadow-sm transition`}  >

            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${style.box}`} > <Icon size={20} /> </div>

            <div className="flex items-center justify-between">

              <h3 className="font-semibold text-slate-900"> {action.title} </h3>

              <FiArrowUpRight className={`text-slate-300 ${style.hover}`}/>

            </div>

            <p className="text-sm text-slate-500 mt-2"> {action.description} </p>

          </button>
        );
      })}

    </div>
  );
}
