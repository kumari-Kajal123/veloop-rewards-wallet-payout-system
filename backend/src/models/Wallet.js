const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    VEs: {
      type: Number,
      default: 0,
      min: 0,
    },

    SVEs: {
      type: Number,
      default: 0,
      min: 0,
    },

    Gems: {
      type: Number,
      default: 0,
      min: 0,
    },

    Tokens: {
      type: Number,
      default: 0,
      min: 0,
    },

    Spins: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Wallet", walletSchema);