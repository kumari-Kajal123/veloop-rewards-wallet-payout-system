
const {
  claimDailyReward,
  claimSpinReward,
} = require("../services/rewardService");

const RewardClaim = require("../models/RewardClaim");

const getUserId = (req) =>
  req.user?.userId || req.user?._id || req.user?.id;

const claimDailyRewardController = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await claimDailyReward(userId);

    return res.status(201).json({
      success: true,
      message: "Daily reward claimed successfully",
      data: result,
    });
  } catch (error) {
    const status = error.message.includes("already claimed") ? 409
      : error.message === "Wallet not found" ? 404
      : 400;

    return res.status(status).json({
      success: false,
      message: error.message || "Failed to claim daily reward",
    });
  }
};

const claimSpinRewardController = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await claimSpinReward(userId);

    return res.status(201).json({
      success: true,
      message: "Spin reward claimed successfully",
      data: result,
    });
  } catch (error) {
    const status = error.message.includes("already claimed") ? 409
      : error.message === "Wallet not found" ? 404
      : 400;

    return res.status(status).json({
      success: false,
      message: error.message || "Failed to claim spin reward",
    });
  }
};

const getDailyRewardStatus = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

    const [dailyClaim, spinClaim] = await Promise.all([
      RewardClaim.findOne({
        userId,
        rewardType: "DAILY_REWARD",
        claimDate: today,
      }),
      RewardClaim.findOne({
        userId,
        rewardType: "SPIN_REWARD",
        claimDate: today,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        date: today,
        dailyRewardClaimed: Boolean(dailyClaim),
        spinRewardClaimed: Boolean(spinClaim),
        dailyReward: dailyClaim
          ? { amount: dailyClaim.amount, currency: dailyClaim.currency }
          : null,
        spinReward: spinClaim
          ? { amount: spinClaim.amount, currency: spinClaim.currency }
          : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reward status",
    });
  }
};

module.exports = {
  claimDailyRewardController,
  claimSpinRewardController,
  getDailyRewardStatus,
};
