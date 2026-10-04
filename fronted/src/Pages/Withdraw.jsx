import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Withdraw() {
  const navigate = useNavigate();

  const [methods, setMethods] = useState([]);
  const [options, setOptions] = useState([]);

  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const [payoutDetails, setPayoutDetails] = useState("");

  const [loadingMethods, setLoadingMethods] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get payout methods
  const fetchMethods = async () => {
    try {
      setLoadingMethods(true);
      setError("");

      const response = await api.get("/payout/methods");

      console.log("PAYOUT METHODS:", response.data);

      setMethods(response.data.methods || []);
    } catch (error) {
      console.error("Payout methods error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load payout methods."
      );
    } finally {
      setLoadingMethods(false);
    }
  };

  // Get options for selected method
  const fetchOptions = async (method) => {
    try {
      setLoadingOptions(true);
      setError("");
      setOptions([]);
      setSelectedOption(null);

      const response = await api.get(
        `/payout/options/${method}`
      );

      console.log("PAYOUT OPTIONS:", response.data);

      setOptions(response.data.options || []);
    } catch (error) {
      console.error("Payout options error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load payout options."
      );
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    setSuccess("");
    fetchOptions(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedMethod) {
      setError("Please select a payout method.");
      return;
    }

    if (!selectedOption) {
      setError("Please select a payout option.");
      return;
    }

    if (!payoutDetails.trim()) {
      setError("Please enter your payout details.");
      return;
    }

    try {
      setSubmitting(true);

      const idempotencyKey = crypto.randomUUID();

      const response = await api.post(
        "/withdrawals",
        {
          method: selectedMethod,
          optionId: selectedOption.optionId,
          payoutDetails: {
            value: payoutDetails.trim(),
          },
        },
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        }
      );

      console.log("WITHDRAWAL RESPONSE:", response.data);

      setSuccess(
        "Withdrawal request submitted successfully."
      );

      setPayoutDetails("");
      setSelectedOption(null);

    } catch (error) {
      console.error("Withdrawal error:", error);

      setError(
        error.response?.data?.message ||
          "Withdrawal request failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center gap-3">

          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1 className="text-xl font-bold">
              Withdraw
            </h1>

            <p className="text-xs text-slate-500">
              Convert your rewards into payouts
            </p>
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-5 py-8">

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3">
            <FiCheckCircle />
            {success}
          </div>
        )}

        {/* Payout Methods */}
        <section className="mb-8">

          <h2 className="text-xl font-semibold mb-4">
            Select Payout Method
          </h2>

          {loadingMethods ? (
            <div className="flex items-center gap-2 text-slate-400">
              <FiRefreshCw className="animate-spin" />
              Loading payout methods...
            </div>
          ) : methods.length === 0 ? (
            <p className="text-slate-500">
              No payout methods available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {methods.map((method) => (
                <button
                  key={method.methodId}
                  onClick={() =>
                    handleMethodChange(method.methodId)
                  }
                  className={`p-5 rounded-2xl text-left border transition ${
                    selectedMethod === method.methodId
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <h3 className="font-semibold text-lg">
                    {method.name}
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Currency: {method.currency}
                  </p>
                </button>
              ))}

            </div>
          )}

        </section>

        {/* Payout Options */}
        {selectedMethod && (
          <section className="mb-8">

            <h2 className="text-xl font-semibold mb-4">
              Select Payout Amount
            </h2>

            {loadingOptions ? (
              <div className="flex items-center gap-2 text-slate-400">
                <FiRefreshCw className="animate-spin" />
                Loading options...
              </div>
            ) : options.length === 0 ? (
              <p className="text-slate-500">
                No payout options available.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {options.map((option) => (
                  <button
                    key={option.optionId}
                    onClick={() =>
                      setSelectedOption(option)
                    }
                    className={`p-4 rounded-2xl border transition ${
                      selectedOption?.optionId === option.optionId
                        ? "border-purple-400 bg-purple-400/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <p className="text-xl font-bold">
                      ₹{option.payoutValue}
                    </p>

                    <p className="text-sm text-cyan-400 mt-2">
                      {option.requiredAmount.toLocaleString()}{" "}
                      {option.currency}
                    </p>

                  </button>
                ))}

              </div>
            )}

          </section>
        )}

        {/* Payout Details */}
        {selectedOption && (
          <section>

            <h2 className="text-xl font-semibold mb-4">
              Payout Details
            </h2>

            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >

              <div className="mb-6">

                <p className="text-sm text-slate-400">
                  Selected payout
                </p>

                <p className="text-2xl font-bold mt-1">
                  ₹{selectedOption.payoutValue}
                </p>

                <p className="text-sm text-cyan-400 mt-1">
                  {selectedOption.requiredAmount.toLocaleString()}{" "}
                  {selectedOption.currency}
                </p>

              </div>

              <div className="mb-6">

                <label className="block text-sm text-slate-300 mb-2">
                  {selectedMethod === "UPI"
                    ? "UPI ID"
                    : "Payout Details"}
                </label>

                <input
                  type="text"
                  value={payoutDetails}
                  onChange={(e) =>
                    setPayoutDetails(e.target.value)
                  }
                  placeholder={
                    selectedMethod === "UPI"
                      ? "example@upi"
                      : "Enter payout details"
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 outline-none focus:border-cyan-400 transition"
                />

              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Withdrawal"}
              </button>

            </form>

          </section>
        )}

      </main>
    </div>
  );
}
