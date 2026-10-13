
const mongoose = require("mongoose");
const crypto = require("crypto");

const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");
const RewardClaim = require("../models/RewardClaim");

// Sample defaults; production amounts can be configured in backend .env.
const DAILY_REWARD_AMOUNT = Number(
  process.env.DAILY_REWARD_AMOUNT || 10
);

const SPIN_REWARD_OPTIONS = [5, 10, 20, 50];

const getToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const claimReward = async ({ userId, rewardType }) => {
  if (!["DAILY_REWARD", "SPIN_REWARD"].includes(rewardType)) {
    throw new Error("Invalid reward type");
  }

  const currency = "VEs";
  const claimDate = getToday();

  // Reward amount is decided by the server, never by the client.
  const amount =
    rewardType === "DAILY_REWARD"
      ? DAILY_REWARD_AMOUNT
      : SPIN_REWARD_OPTIONS[
          crypto.randomInt(0, SPIN_REWARD_OPTIONS.length)
        ];

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid reward configuration");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const wallet = await Wallet.findOne({ userId }).session(session);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // The unique index on RewardClaim protects against duplicate claims.
    const [claim] = await RewardClaim.create(
      [
        {
          userId,
          rewardType,
          claimDate,
          amount,
          currency,
        },
      ],
      { session }
    );

    const balanceBefore = wallet[currency];
    const balanceAfter = balanceBefore + amount;

    wallet[currency] = balanceAfter;
    await wallet.save({ session });

    const [transaction] = await WalletTransaction.create(
      [
        {
          transactionId: crypto.randomUUID(),
          userId,
          currency,
          type: rewardType,
          amount,
          balanceBefore,
          balanceAfter,
          source: rewardType,
          referenceId: claim._id.toString(),
          status: "COMPLETED",
          description:
            rewardType === "DAILY_REWARD"
              ? "Daily reward claimed"
              : "Spin the wheel reward",
          metadata: { claimDate },
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      reward: {
        type: rewardType,
        amount,
        currency,
        claimDate,
      },
      wallet: { [currency]: balanceAfter },
      transactionId: transaction.transactionId,
    };
  } catch (error) {
    await session.abortTransaction();

    if (error.code === 11000) {
      throw new Error("Reward already claimed today");
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

const claimDailyReward = (userId) =>
  claimReward({ userId, rewardType: "DAILY_REWARD" });

const claimSpinReward = (userId) =>
  claimReward({ userId, rewardType: "SPIN_REWARD" });

module.exports = {
  claimDailyReward,
  claimSpinReward,
};
