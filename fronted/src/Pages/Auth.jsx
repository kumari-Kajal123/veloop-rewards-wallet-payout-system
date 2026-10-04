import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // LOGIN
const handleLogin = async () => {
  try {
    setLoading(true);

    const response = await api.post("/auth/login", { email,  password, });

    // console.log("LOGIN RESPONSE:", response.data);

    // Save JWT token
    localStorage.setItem("token", response.data.token);

    // Save user
    localStorage.setItem(  "user",  JSON.stringify(response.data.user) );

    // Role based redirect
    // if (response.data.user.role === "ADMIN") {
    //   navigate("/admin/withdrawals");
    // } else {
    //   navigate("/home");
    // }
      navigate("/home");

  } catch (error) {
    console.error("Login error:", error);

    console.log("Backend error:", error.response?.data);
    alert(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  // SIGNUP
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", { name, email, password,});

      console.log("REGISTER RESPONSE:", response.data);

      alert("Registration successful! Please login.");

      // Switch to login
      setIsLogin(true);

      // Clear password fields
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Register error:", error);

      console.log("Backend error:", error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="text-gray-500 mt-2">
            {isLogin
              ? "Login to continue to your account"
              : "Sign up to create your account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Forgot Password */}
          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6 text-gray-600">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
