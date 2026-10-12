
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import MobileBottomNav from "./components/layout/MobileBottomNav";

// import Home from "./Pages/Dashboard/Home";
import Home from "./Pages/Home";
import Transactions from "./Pages/Wallet/Transactions";
import Withdraw from "./Pages/Withdraw/Withdraw";
import Withdrawals from "./Pages/Withdraw/Withdrawals";
import AdminWithdrawals from "./Pages/Admin/AdminWithdrawals";
import AdminDashboard from "./Pages/Admin/AdminDashboard";

// import Auth from "./Pages/Auth";
import Auth from "./Pages/Auth/index.jsx";



function ProtectedLayout() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/");
      return;
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("User data error:", error);
      }
    }
  }, [navigate]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc]">

      {/* Desktop Sidebar */}
      <Sidebar user={user} />

      {/* Main Application */}
      <div className="lg:ml-[250px] min-h-screen">

        {/* Topbar */}
        <Topbar
          user={user}
          onRefresh={handleRefresh}
        />

        {/* Page Content */}
        <main className="pb-24 lg:pb-8">
          <Routes>

            <Route
              path="/home"
              element={<Home />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/withdraw"
              element={<Withdraw />}
            />

            <Route
              path="/withdrawals"
              element={<Withdrawals />}
            />

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

            {/* Default */}
            <Route
              path="*"
              element={<Navigate to="/home" replace />}
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

          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav user={user} />

    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <ProtectedLayout />
            ) : (
              <Auth />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
