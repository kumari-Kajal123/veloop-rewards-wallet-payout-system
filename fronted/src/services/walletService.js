import api from "./api";

const walletService = {
  // Get logged-in user's wallet
  getWallet: () =>
    api.get("/wallet"),

  // Get wallet summary
  getWalletSummary: () =>
    api.get("/wallet/summary"),

  // Get transaction history
  getTransactions: (params = {}) =>
    api.get("/wallet/transactions", { params }),

  // Credit wallet (admin API)
  creditWallet: (data) =>
    api.post("/wallet/credit", data),

  // Debit wallet (admin API)
  debitWallet: (data) =>
    api.post("/wallet/debit", data),
};

export default walletService;