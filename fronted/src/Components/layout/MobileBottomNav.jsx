import React from "react";
import { FiHome, FiCreditCard, FiGift, FiClock, FiShield,} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

export default function MobileBottomNav({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      label: "Home",
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
      label: "History",
      path: "/withdrawals",
      icon: FiClock,
    },
  ];

// if (user?.role === "ADMIN") {
//   items.push({
//     label: "Admin",
//     path: "/admin",
//     icon: FiShield,
//   });
// }

if (user?.role === "ADMIN") {
  items.push({
    label: "Admin",
    path: "/admin",
    icon: FiShield,
  });
}

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200">
      <div className="max-w-xl mx-auto px-2 py-2">

        <div className="flex items-center justify-around">
          {items.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              (item.path.startsWith("/admin") &&
                location.pathname.startsWith("/admin"));

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center gap-1 min-w-[64px] py-1.5 rounded-xl transition ${
                  active
                    ? "text-emerald-600"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {active && (
                  <span className="absolute -top-2 w-8 h-0.5 rounded-full bg-emerald-500" />
                )}

                <Icon size={19} />

                <span className="text-[10px] font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
}