import React from "react";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiGift,
  FiActivity,
} from "react-icons/fi";

export default function RecentActivity({ transactions = [] }) {

  const getIcon = (type) => {
    if (
      type === "WITHDRAWAL" ||
      type === "EXCHANGE_DEBIT" ||
      type === "ADMIN_DEBIT"
    ) {
      return (
        <FiArrowUpRight
          className="text-red-500"
          size={18}
        />
      );
    }

    if (
      type === "REWARD" ||
      type === "BONUS" ||
      type === "DAILY_REWARD" ||
      type === "AD_REWARD" ||
      type === "GAME_REWARD" ||
      type === "ADMIN_CREDIT"
    ) {
      return (
        <FiGift
          className="text-emerald-500"
          size={18}
        />
      );
    }

    return (
      <FiArrowDownLeft
        className="text-blue-500"
        size={18}
      />
    );
  };

  const formatType = (type = "") => {
    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

      <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">

        <div>
          <h2 className="font-bold text-slate-900">
            Recent Activity
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Latest wallet transactions
          </p>
        </div>

        <FiActivity className="text-slate-400" />

      </div>

      {transactions.length === 0 ? (

        <div className="px-6 py-10 text-center">

          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
            <FiActivity className="text-slate-400" />
          </div>

          <p className="font-medium text-slate-700 mt-3">
            No recent activity
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Your wallet activity will appear here.
          </p>

        </div>

      ) : (

        <div className="divide-y divide-slate-100">

          {transactions.slice(0, 5).map((transaction) => {

            const isDebit =
              transaction.type === "WITHDRAWAL" ||
              transaction.type === "EXCHANGE_DEBIT" ||
              transaction.type === "ADMIN_DEBIT";

            return (
              <div
                key={transaction.transactionId}
                className="px-5 sm:px-6 py-4 flex items-center gap-4"
              >

                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  {getIcon(transaction.type)}
                </div>

                <div className="flex-1 min-w-0">

                  <p className="font-medium text-sm text-slate-800 truncate">
                    {formatType(transaction.type)}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {transaction.currency}
                    {transaction.status
                      ? ` • ${transaction.status}`
                      : ""}
                  </p>

                </div>

                <div className="text-right">

                  <p
                    className={`font-semibold text-sm ${
                      isDebit
                        ? "text-red-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {isDebit ? "-" : "+"}
                    {Number(transaction.amount || 0).toLocaleString()}
                  </p>

                  {transaction.createdAt && (
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleDateString()}
                    </p>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      )}

    </section>
  );
}
