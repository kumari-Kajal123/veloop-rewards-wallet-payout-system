import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./Components/layout/Sidebar";
import Topbar from "./Components/layout/Topbar";
import MobileBottomNav from "./Components/layout/MobileBottomNav";

import Home from "./Pages/Home";
import Transactions from "./Pages/Wallet/Transactions";
import Withdraw from "./Pages/Withdraw/Withdraw";
import Withdrawals from "./Pages/Withdraw/Withdrawals";
import AdminWithdrawals from "./Pages/Admin/AdminWithdrawals";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import Auth from "./Pages/Auth/index.jsx";

function ProtectedLayout() {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Sidebar user={user} />

      <div className="lg:ml-[250px] min-h-screen">
        <Topbar
          user={user}
          onRefresh={() => window.location.reload()}
        />

        <main className="pb-24 lg:pb-8">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/withdrawals" element={<Withdrawals />} />

            <Route
              path="/admin/withdrawals"
              element={
                user?.role === "ADMIN" ? (
                  <AdminWithdrawals />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />

            <Route
              path="/admin"
              element={
                user?.role === "ADMIN" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />

            <Route
              path="*"
              element={<Navigate to="/home" replace />}
            />
          </Routes>
        </main>
      </div>

      <MobileBottomNav user={user} />
    </div>
  );
}

function AppRoutes() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/*"
        element={token ? <ProtectedLayout /> : <Auth />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
