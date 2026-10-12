import React from "react";
import {
  FiBell,
  FiRefreshCw,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Topbar({ user, onRefresh }) {
  const navigate = useNavigate();


const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");

  window.location.replace("/");
};


  return (
    <header className="lg:ml-[250px] h-[76px] bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
            <span className="text-emerald-400 font-bold">
              V
            </span>
          </div>

          <div>
            <h1 className="font-bold text-base text-slate-900">
              VEloop
            </h1>
            <p className="text-[10px] text-slate-400">
              Rewards Wallet
            </p>
          </div>
        </div>

        {/* Desktop page area */}
        <div className="hidden lg:block">
          <p className="text-sm text-slate-400">
            Rewards & Wallet
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Refresh */}
          <button
            onClick={onRefresh}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition"
            title="Refresh"
          >
            <FiRefreshCw size={17} />
          </button>

          {/* Notification */}
          <button
            className="hidden sm:flex relative w-10 h-10 rounded-xl border border-slate-200 bg-white items-center justify-center text-slate-500 hover:text-slate-900 transition"
            title="Notifications"
          >
            <FiBell size={17} />

            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>

          {/* User */}
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">

            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="hidden md:block max-w-[130px]">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-400">
                {user?.role === "ADMIN" ? "Administrator" : "Member"}
              </p>
            </div>
          </div>

          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-200 transition"
            title="Logout"
          >
            <FiLogOut size={17} />
          </button>

        </div>
      </div>
    </header>
  );
}
