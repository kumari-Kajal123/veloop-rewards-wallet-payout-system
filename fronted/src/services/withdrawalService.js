import api from "./api";

const withdrawalService = {
  // Create a withdrawal request
  createWithdrawal: (data, idempotencyKey) =>
    api.post("/withdrawals", data, {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }),

  // Get logged-in user's withdrawals
  getWithdrawals: (params = {}) =>
    api.get("/withdrawals", { params }),

  // Get a single withdrawal's details
  getWithdrawalById: (id) =>
    api.get(`/withdrawals/${id}`),

  // Get payout methods
  getPayoutMethods: () =>
    api.get("/payout/methods"),

  // Get options for a payout method
  getPayoutOptions: (method) =>
    api.get(`/payout/options/${encodeURIComponent(method)}`),
};

export default withdrawalService;