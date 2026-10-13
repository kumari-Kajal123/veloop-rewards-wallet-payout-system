
const mongoose = require("mongoose");

const rewardClaimSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rewardType: {
      type: String,
      enum: ["DAILY_REWARD", "SPIN_REWARD", "TASK_REWARD"],
      required: true,
    },

    claimDate: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["VEs", "SVEs", "Gems", "Tokens", "Spins"],
      required: true,
    },

    taskId: {
      type: String,
      default: null,
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

// Prevent duplicate daily claims and duplicate spins per user per day.
// Different tasks can have separate claims on the same day.
rewardClaimSchema.index(
  { userId: 1, rewardType: 1, claimDate: 1, taskId: 1 },
  { unique: true }
);

module.exports = mongoose.model("RewardClaim", rewardClaimSchema);
