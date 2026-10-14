
import React, { useEffect, useState } from "react";

import {
  FiArrowLeft,
  FiRefreshCw,
  FiCheckCircle,
  FiCreditCard,
  FiSmartphone,
  FiArrowRight,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import withdrawalService from "../../services/withdrawalService";

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

  const fetchMethods = async () => {
    try {
      setLoadingMethods(true);
      setError("");

      const response = await withdrawalService.getPayoutMethods();

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

  const fetchOptions = async (method) => {
    try {
      setLoadingOptions(true);
      setError("");
      setOptions([]);
      setSelectedOption(null);
      setPayoutDetails("");

const response = await withdrawalService.getPayoutOptions(method);

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
    setError("");
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

const response = await withdrawalService.createWithdrawal(
  {
    method: selectedMethod,
    optionId: selectedOption.optionId,
    payoutDetails: {
      value: payoutDetails.trim(),
    },
  },
  idempotencyKey
);

      setSuccess(
        "Your withdrawal request has been submitted successfully."
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
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
          >
            <FiArrowLeft />
            Back to Dashboard
          </button>

          <div className="mt-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Withdraw Rewards
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Redeem your VEs through an available payout method.
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 pb-28 lg:pb-10">
        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">
                Withdrawal submitted
              </p>
              <p className="text-sm mt-1">{success}</p>

              <button
                onClick={() => navigate("/withdrawals")}
                className="mt-3 text-sm font-semibold underline underline-offset-4"
              >
                View withdrawal history
              </button>
            </div>
          </div>
        )}

        {/* Page layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main card */}
          <div className="space-y-6">
            {/* Step 1 */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  1
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Choose payout method
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Select where you want to receive your reward.
                  </p>
                </div>
              </div>

              {loadingMethods ? (
                <div className="flex items-center gap-2 text-slate-500 py-6">
                  <FiRefreshCw className="animate-spin" />
                  Loading payout methods...
                </div>
              ) : methods.length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  No payout methods are currently available.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {methods.map((method) => {
                    const isSelected =
                      selectedMethod === method.methodId;

                    return (
                      <button
                        key={method.methodId}
                        type="button"
                        onClick={() =>
                          handleMethodChange(method.methodId)
                        }
                        className={`text-left p-5 rounded-2xl border-2 transition ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                              isSelected
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {method.methodId === "UPI" ? (
                              <FiSmartphone size={20} />
                            ) : (
                              <FiCreditCard size={20} />
                            )}
                          </div>

                          {isSelected && (
                            <FiCheckCircle
                              className="text-emerald-600"
                              size={20}
                            />
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 mt-5">
                          {method.name}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          Receive in {method.currency}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Step 2 */}
            {selectedMethod && (
              <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    2
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Choose reward amount
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Select the amount you want to redeem.
                    </p>
                  </div>
                </div>

                {loadingOptions ? (
                  <div className="flex items-center gap-2 text-slate-500 py-6">
                    <FiRefreshCw className="animate-spin" />
                    Loading available rewards...
                  </div>
                ) : options.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    No payout options are currently available.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {options.map((option) => {
                      const isSelected =
                        selectedOption?.optionId === option.optionId;

                      return (
                        <button
                          key={option.optionId}
                          type="button"
                          onClick={() => {
                            setSelectedOption(option);
                            setError("");
                            setSuccess("");
                          }}
                          className={`relative text-left p-4 rounded-2xl border-2 transition ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {isSelected && (
                            <FiCheckCircle
                              className="absolute top-3 right-3 text-emerald-600"
                              size={17}
                            />
                          )}

                          <p className="text-xl font-bold text-slate-900">
                            ₹{option.payoutValue}
                          </p>

                          <p className="text-xs font-medium text-slate-500 mt-2">
                            {Number(
                              option.requiredAmount || 0
                            ).toLocaleString()}{" "}
                            {option.currency}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Step 3 */}
            {selectedOption && (
              <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    3
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Payout details
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Enter the details required to process your payout.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Selected payout */}
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 mb-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Selected reward
                        </p>

                        <p className="text-2xl font-bold text-slate-900 mt-1">
                          ₹{selectedOption.payoutValue}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          Required
                        </p>

                        <p className="font-semibold text-slate-800 mt-1">
                          {Number(
                            selectedOption.requiredAmount || 0
                          ).toLocaleString()}{" "}
                          {selectedOption.currency}
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                  />

                  <div className="flex items-start gap-2 mt-3 text-xs text-slate-500">
                    <FiShield className="mt-0.5 shrink-0 text-emerald-500" />
                    <p>
                      Your payout details are used only to process this
                      withdrawal request.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-6 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Submitting request...
                      </>
                    ) : (
                      <>
                        Submit Withdrawal
                        <FiArrowRight />
                      </>
                    )}
                  </button>
                </form>
              </section>
            )}
          </div>

          {/* Side summary */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-6">
              <p className="text-sm text-slate-400">
                Withdrawal summary
              </p>

              <div className="mt-5">
                <p className="text-xs text-slate-400">
                  Payout method
                </p>
                <p className="font-semibold mt-1">
                  {selectedMethod || "Not selected"}
                </p>
              </div>

              <div className="mt-5 pt-5 border-t border-white/10">
                <p className="text-xs text-slate-400">
                  Reward
                </p>
                <p className="text-2xl font-bold mt-1">
                  {selectedOption
                    ? `₹${selectedOption.payoutValue}`
                    : "—"}
                </p>
              </div>

              <div className="mt-5 pt-5 border-t border-white/10">
                <p className="text-xs text-slate-400">
                  Required VEs
                </p>
                <p className="font-semibold mt-1">
                  {selectedOption
                    ? `${Number(
                        selectedOption.requiredAmount || 0
                      ).toLocaleString()} ${selectedOption.currency}`
                    : "—"}
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-slate-900">
                Before you withdraw
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  Make sure your payout details are correct.
                </li>

                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  Your request will be reviewed before processing.
                </li>

                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  You can track the request from withdrawal history.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}