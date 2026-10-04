const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    withdrawalId: {
      type: String,
      required: true,
      unique: true,
    },
    
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    method: {
      type: String,
      required: true,
    },

    optionId: {
      type: String,
      required: true,
    },

    currency: {
      type: String,
      enum: ["VEs", "SVEs", "Gems", "Tokens", "Spins"],
      required: true,
    },

    currencyAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    payoutAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    payoutDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "APPROVED",
        "REJECTED",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    reviewNote: {
      type: String,
      default: null,
    },

    transactionId: {
      type: String,
      default: null,
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Withdrawal", withdrawalSchema);