import React, { useEffect, useState } from "react";
import {  FiArrowLeft, FiRefreshCw, FiEye, FiX,} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Withdrawals() {
  const navigate = useNavigate();

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/withdrawals");

      // console.log("WITHDRAWALS RESPONSE:", response.data);

      setWithdrawals(response.data.withdrawals || []);
    } catch (error) {
      console.error("Withdrawals error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load withdrawal history."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch individual withdrawal details
  const fetchWithdrawalDetails = async (withdrawalId) => {
    try {
      setDetailsLoading(true);

      const response = await api.get(
        `/withdrawals/${withdrawalId}`
      );

      setSelectedWithdrawal(response.data.withdrawal);
    } catch (error) {
      console.error(
        "Withdrawal details error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to load withdrawal details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button onClick={() => navigate("/home")}  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition" >
              <FiArrowLeft />
            </button>

            <div>
              <h1 className="text-xl font-bold"> Withdrawal History</h1>
              <p className="text-xs text-slate-500">  Track your payout requests </p>
            </div>

          </div>

          <button onClick={fetchWithdrawals}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition" >
            <FiRefreshCw />
            <span className="hidden sm:block"> Refresh </span>
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-5 py-8">

        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center">
              <FiRefreshCw className="text-3xl animate-spin mx-auto mb-3 text-cyan-400" />
              <p className="text-slate-400"> Loading withdrawal history... </p>
            </div>
          </div>
        ) : error ? (
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">   {error} </div>
        ) : withdrawals.length === 0 ? (

          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold"> No Withdrawals Yet </h2>
              <p className="text-slate-500 mt-2"> Your withdrawal requests will appear here. </p>
              <button  onClick={() => navigate("/withdraw")}
                className="mt-5 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition" >
                Make a Withdrawal
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <WithdrawalCard key={withdrawal.withdrawalId} withdrawal={withdrawal} onViewDetails={fetchWithdrawalDetails} detailsLoading={detailsLoading} />
            ))}
          </div>
        )}
      </main>

      {/* Withdrawal Details Modal */}
      {selectedWithdrawal && (

        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-3xl shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold"> Withdrawal Details </h2>
                <p className="text-xs text-slate-500 mt-1"> Complete information about your request </p>
              </div>
              <button onClick={() =>setSelectedWithdrawal(null) }
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"> <FiX />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Status</span>
                <StatusBadge status={selectedWithdrawal.status} />
              </div>

              {/* Payout Amount */}
              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-400/10">
                <p className="text-xs text-slate-500"> Payout Amount </p>
                <p className="text-3xl font-bold text-cyan-400 mt-1"> ₹{selectedWithdrawal.payoutAmount} </p>
              </div>

              {/* Method */}
              <DetailRow label="Payment Method" value={selectedWithdrawal.method} />

              {/* Currency */}
              <DetailRow label="Currency Used" value={`${Number(  selectedWithdrawal.currencyAmount || 0  ).toLocaleString()} ${ selectedWithdrawal.currency || "" }`} />

              {/* Withdrawal ID */}
              <DetailRow label="Withdrawal ID" value={selectedWithdrawal.withdrawalId} breakAll />

              {/* Transaction ID */}
              {selectedWithdrawal.transactionId && (
                <DetailRow label="Transaction ID" value={selectedWithdrawal.transactionId} breakAll />
              )}

              {/* Requested At */}
              <DetailRow
                label="Requested At"
                value={
                  selectedWithdrawal.requestedAt
                    ? new Date(
                        selectedWithdrawal.requestedAt
                      ).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "N/A"
                }
              />

              {/* Processed At */}
              {selectedWithdrawal.processedAt && (
                <DetailRow label="Processed At" value={new Date( selectedWithdrawal.processedAt
                  ).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}/>
              )}
              {/* Rejection Reason */}
              {selectedWithdrawal.rejectionReason && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-400 font-medium"> Rejection Reason </p>
                  <p className="text-sm text-white/80 mt-2"> {selectedWithdrawal.rejectionReason} </p>
                </div>
              )}
              {/* Review Note */}
              {selectedWithdrawal.reviewNote && (
                <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-400 font-medium"> Review Note </p>
                  <p className="text-sm text-white/80 mt-2"> {selectedWithdrawal.reviewNote} </p>
                </div>
              )}
              {/* Payout Details */}
              {selectedWithdrawal.payoutDetails && (
                <div>
                  <p className="text-xs text-slate-500 mb-2"> Payout Details </p>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      {typeof selectedWithdrawal.payoutDetails ===
                      "object" ? (
                        Object.entries(
                          selectedWithdrawal.payoutDetails
                        ).map(([key, value]) => (
                          <div key={key} className="flex justify-between gap-4 text-sm py-1"   >
                            <span className="text-slate-500"> {key}</span>
                            <span className="text-white break-all text-right"> {String(value)} </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-white text-sm"> {selectedWithdrawal.payoutDetails}</p>
                      )}
                    </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10">
              <button onClick={() =>setSelectedWithdrawal(null) }  className="w-full py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition font-medium" > 
                Close 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
  //  Withdrawal Card
  function WithdrawalCard({
    withdrawal,
    onViewDetails,
    detailsLoading,
  }) {

  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        {/* Left */}
        <div>
          <p className="text-sm text-slate-400">  {withdrawal.method} </p>
          <h3 className="text-2xl font-bold mt-1"> ₹{withdrawal.payoutAmount} </h3>
          <p className="text-sm text-cyan-400 mt-1">
            {Number(
              withdrawal.currencyAmount || 0
            ).toLocaleString()}{" "}
            {withdrawal.currency}
          </p>
          <p className="text-xs text-slate-600 mt-3 break-all"> ID: {withdrawal.withdrawalId} </p>

        </div>

        {/* Right */}
        <div className="md:text-right flex flex-col md:items-end gap-3">
          <StatusBadge status={withdrawal.status} />
          <p className="text-xs text-slate-500">
            {withdrawal.requestedAt
              ? new Date(
                  withdrawal.requestedAt
                ).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "N/A"}
          </p>

          <button onClick={() => onViewDetails( withdrawal.withdrawalId ) } disabled={detailsLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-500/20 transition disabled:opacity-50" >
            <FiEye /> {detailsLoading ? "Loading..." : "View Details"}
          </button>

        </div>

      </div>

    </div>
  );
}
  //  Status Badge
  function StatusBadge({ status }) {

  const statusStyle = {
    PENDING:
      "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",

    PROCESSING:
      "bg-blue-500/10 text-blue-400 border-blue-400/20",

    APPROVED:
      "bg-green-500/10 text-green-400 border-green-400/20",

    REJECTED:
      "bg-red-500/10 text-red-400 border-red-400/20",

    CANCELLED:
      "bg-slate-500/10 text-slate-400 border-slate-400/20",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs border ${statusStyle[status] || "bg-white/10 text-slate-400 border-white/10" }`} >
      {status}
    </span>
  );
}

//  Detail Row
function DetailRow({ label, value, breakAll = false,}) {

  return (
    <div className="flex justify-between gap-5 py-2 border-b border-white/5">
      <span className="text-sm text-slate-500"> {label}</span>
      <span className={`text-sm text-white text-right ${  breakAll ? "break-all" : "" }`} > {value || "N/A"} </span>
    </div>
  );
}