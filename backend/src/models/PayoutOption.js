const mongoose = require("mongoose");

const payoutOptionSchema = new mongoose.Schema(
  {
    methodId: {
      type: String,
      required: true,
    },

    optionId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    currency: {
      type: String,
      enum: ["VEs", "SVEs", "Gems", "Tokens", "Spins"],
      required: true,
    },

    payoutValue: {
      type: Number,
      required: true,
      min: 0,
    },

    requiredAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },

    eligibility: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PayoutOption", payoutOptionSchema);