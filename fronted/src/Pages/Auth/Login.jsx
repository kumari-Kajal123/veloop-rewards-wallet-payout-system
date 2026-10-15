
import React, { useState } from "react";
import { Link, useLocation , useNavigate } from "react-router-dom";
import authService from "../../services/authService";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!form.email.trim() || !form.password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    setLoading(true);

    const response = await authService.login({
      email: form.email.trim(),
      password: form.password,
    });

    const data = response.data;

    if (!data.token) {
      throw new Error(
        "Login succeeded, but no authentication token was received."
      );
    }

    localStorage.setItem("token", data.token);

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    localStorage.setItem("isLoggedIn", "true");

    // Reload the app with the saved authentication token.
    window.location.replace("/home");
    // const user = data.user;

    // if (user?.role === "ADMIN") {
    //   navigate("/admin", { replace: true });
    // } else {
    //   navigate("/home", { replace: true });
    // }

  } catch (err) {
    setError(
      err.response?.data?.message ||
        err.message ||
        "Unable to login. Please try again."
    );

    setLoading(false);
  }
};


  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";

  return (
    
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d1b] px-4 py-10 text-white">
      <div className="pointer-events-none absolute -left-28 -top-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[110px]" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-cyan-500/15 via-[#111a32] to-violet-600/20 p-10 lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-black text-slate-950">
                V 
              </div>
              <span className="text-xl font-bold tracking-wide">VELoop</span>
            </div>

            <div className="mt-24">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Rewards Wallet
              </p>
              <h1 className="max-w-sm text-4xl font-bold leading-tight">
                Your rewards.
                <br />
                Your progress.
                <br />
                <span className="text-cyan-300">One wallet.</span>
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                Manage your reward currencies, track transactions and access
                your payout options from one place.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Secure access to your rewards account.
          </p>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 font-black text-slate-950">
                V
              </div>
              <span className="text-xl font-bold">VELoop</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-cyan-300">
              Welcome back
            </p>
            <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
            <p className="mt-2 text-sm text-slate-400">
              Enter your account details to continue.
            </p>
          </div>

          {location.state?.registered && (
            <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-300">
              Registration successful. You can now log in.
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-20`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-cyan-300 hover:text-cyan-200"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3.5 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to VELoop"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
