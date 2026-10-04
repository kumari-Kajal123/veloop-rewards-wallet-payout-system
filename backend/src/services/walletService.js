const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");
const crypto = require("crypto");

const allowedCurrencies = [
  "VEs",
  "SVEs",
  "Gems",
  "Tokens",
  "Spins",
];

const creditWallet = async ({
  userId,
  currency,
  amount,
  type,
  source,
  referenceId = null,
  description = "",
  metadata = {},
}) => {
  if (!amount || amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (!allowedCurrencies.includes(currency)) {
    throw new Error("Invalid currency");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const wallet = await Wallet.findOne({ userId }).session(session);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const balanceBefore = wallet[currency];
    const balanceAfter = balanceBefore + amount;

    wallet[currency] = balanceAfter;

    await wallet.save({ session });

    const transaction = await WalletTransaction.create(
      [
        {
          transactionId: crypto.randomUUID(),
          userId,
          currency,
          type,
          amount,
          balanceBefore,
          balanceAfter,
          source,
          referenceId,
          status: "COMPLETED",
          description,
          metadata,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      wallet,
      transaction: transaction[0],
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const debitWallet = async ({
  userId,
  currency,
  amount,
  type,
  source,
  referenceId = null,
  description = "",
  metadata = {},
}) => {
  if (!amount || amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (!allowedCurrencies.includes(currency)) {
    throw new Error("Invalid currency");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const wallet = await Wallet.findOne({ userId }).session(session);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const balanceBefore = wallet[currency];

    if (balanceBefore < amount) {
      throw new Error("Insufficient wallet balance");
    }

    const balanceAfter = balanceBefore - amount;

    wallet[currency] = balanceAfter;

    await wallet.save({ session });

    const transaction = await WalletTransaction.create(
      [
        {
          transactionId: crypto.randomUUID(),
          userId,
          currency,
          type,
          amount,
          balanceBefore,
          balanceAfter,
          source,
          referenceId,
          status: "COMPLETED",
          description,
          metadata,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      wallet,
      transaction: transaction[0],
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getTransactions = async ({
  userId,
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  const transactions = await WalletTransaction.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await WalletTransaction.countDocuments({
    userId,
  });

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getWalletSummary = async (userId) => {
  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  return {
    VEs: wallet.VEs,
    SVEs: wallet.SVEs,
    Gems: wallet.Gems,
    Tokens: wallet.Tokens,
    Spins: wallet.Spins,
  };
};

module.exports = { creditWallet, debitWallet, getTransactions, getWalletSummary,};