const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    currency: {
      type: String,
      enum: ["VEs", "SVEs", "Gems", "Tokens", "Spins"],
      required: true,
    },

    type: {
      type: String,
      enum: [
        "REWARD",
        "BONUS",
        "REFERRAL",
        "DAILY_REWARD",
        "AD_REWARD",
        "GAME_REWARD",
        "ADMIN_CREDIT",
        "EXCHANGE_CREDIT",
        "WITHDRAWAL",
        "EXCHANGE_DEBIT",
        "ADMIN_DEBIT",
        "CORRECTION",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    balanceBefore: {
      type: Number,
      required: true,
    },

    balanceAfter: {
      type: Number,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    referenceId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
      default: "COMPLETED",
    },

    description: {
      type: String,
      default: "",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model( "WalletTransaction", walletTransactionSchema);