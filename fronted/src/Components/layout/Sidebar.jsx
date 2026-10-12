import React from "react";
import {
  FiHome,
  FiCreditCard,
  FiGift,
  FiClock,
  FiShield,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/home",
      icon: FiHome,
    },
    {
      label: "Wallet",
      path: "/transactions",
      icon: FiCreditCard,
    },
    {
      label: "Withdraw",
      path: "/withdraw",
      icon: FiGift,
    },
    {
      label: "Withdrawal History",
      path: "/withdrawals",
      icon: FiClock,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/");
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[250px] bg-white border-r border-slate-200 flex-col z-50">

      {/* Logo */}
      <div className="h-[76px] px-6 flex items-center border-b border-slate-100">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-lg">
              V
            </span>
          </div>

          <div className="text-left">
            <h1 className="font-bold text-lg tracking-tight text-slate-900">
              VEloop
            </h1>
            <p className="text-[11px] text-slate-400 -mt-0.5">
              Rewards Wallet
            </p>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">

        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    active ? "text-emerald-400" : "text-slate-400"
                  }
                />

                <span className="flex-1 text-left">
                  {item.label}
                </span>

                {active && (
                  <FiChevronRight
                    size={15}
                    className="text-slate-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin */}
        {user?.role === "ADMIN" && (
          <div className="mt-8">
            <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Administration
            </p>

            <button
              onClick={() => navigate("/admin/withdrawals")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname.startsWith("/admin")
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FiShield
                size={18}
                className={
                  location.pathname.startsWith("/admin")
                    ? "text-emerald-600"
                    : "text-slate-400"
                }
              />

              <span className="flex-1 text-left">
                Admin Dashboard
              </span>

              <FiChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* User / Logout */}
      <div className="p-4 border-t border-slate-100">

        <div className="flex items-center gap-3 px-2 py-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-slate-400 truncate">
              {user?.email || "Account"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <FiLogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}