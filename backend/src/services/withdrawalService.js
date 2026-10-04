const crypto = require("crypto");
const mongoose = require("mongoose");

const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");
const Withdrawal = require("../models/Withdrawal");
const PayoutOption = require("../models/PayoutOption");

const { createAuditLog } = require("./auditService");

const createWithdrawal = async ({
  userId,
  method,
  optionId,
  payoutDetails,
  idempotencyKey,
}) => {
  if (!idempotencyKey) {
    throw new Error("Idempotency key is required");
  }

  // Check duplicate request before starting transaction
  const existingWithdrawal = await Withdrawal.findOne({
    userId,
    idempotencyKey,
  });

  if (existingWithdrawal) {
    return {
      duplicate: true,
      withdrawal: existingWithdrawal,
    };
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find payout option
    const payoutOption = await PayoutOption.findOne({
      methodId: method.toUpperCase(),
      optionId,
      active: true,
    }).session(session);

    if (!payoutOption) {
      throw new Error("Invalid or inactive payout option");
    }

    // Find wallet
    const wallet = await Wallet.findOne({
      userId,
    }).session(session);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const currency = payoutOption.currency;
    const requiredAmount = payoutOption.requiredAmount;
    const payoutAmount = payoutOption.payoutValue;

    // Check balance
    const currentBalance = wallet[currency];

    if (currentBalance < requiredAmount) {
      throw new Error("Insufficient wallet balance");
    }

    const balanceBefore = currentBalance;
    const balanceAfter = currentBalance - requiredAmount;

    // Deduct balance
    wallet[currency] = balanceAfter;

    await wallet.save({ session });

    // Create transaction
    const transactionId = crypto.randomUUID();

    const transaction = await WalletTransaction.create(
      [
        {
          transactionId,
          userId,
          currency,
          type: "WITHDRAWAL",
          amount: requiredAmount,
          balanceBefore,
          balanceAfter,
          source: "WITHDRAWAL",
          referenceId: transactionId,
          status: "COMPLETED",
          description: `${payoutOption.name} withdrawal`,
          metadata: {
            method,
            optionId,
            payoutAmount,
          },
        },
      ],
      { session }
    );

    // Create withdrawal
    const withdrawal = await Withdrawal.create(
      [
        {
          withdrawalId: crypto.randomUUID(),
          idempotencyKey,
          userId,
          method: method.toUpperCase(),
          optionId,
          currency,
          currencyAmount: requiredAmount,
          payoutAmount,
          payoutDetails,
          status: "PENDING",
          transactionId,
        },
      ],
      { session }
    );

    await createAuditLog({
      userId,
      action: "CREATE_WITHDRAWAL",
      entity: "Withdrawal",
      entityId: withdrawal[0].withdrawalId,
      status: "SUCCESS",
      description: "Withdrawal request created successfully",
      metadata: {
        method: payoutOption.methodId,
        optionId: payoutOption.optionId,
        currency,
        currencyAmount: requiredAmount,
        payoutAmount,
      },
      session,
    });

    // Commit everything together
    await session.commitTransaction();

    return {
      duplicate: false,
      withdrawal: withdrawal[0],
      transaction: transaction[0],
      wallet,
    };
  } catch (error) {
    // Undo all changes if anything fails
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const getWithdrawals = async ({ userId, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const withdrawals = await Withdrawal.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Withdrawal.countDocuments({ userId });

  return {
    withdrawals,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getWithdrawalById = async ({ userId, withdrawalId }) => {
  const withdrawal = await Withdrawal.findOne({
    withdrawalId,
    userId,
  });

  if (!withdrawal) {
    throw new Error("Withdrawal not found");
  }

  return withdrawal;
};

const rejectWithdrawal = async ({
  withdrawalId,
  rejectionReason,
  reviewNote = "",
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find the withdrawal
    const withdrawal = await Withdrawal.findOne({
      withdrawalId,
    }).session(session);

    if (!withdrawal) {
      throw new Error("Withdrawal not found");
    }

    if (withdrawal.status !== "PENDING") {
      throw new Error(
        `Withdrawal cannot be rejected because its status is ${withdrawal.status}`
      );
    }

    // Get the actual withdrawal owner's wallet
    const wallet = await Wallet.findOne({
      userId: withdrawal.userId,
    }).session(session);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const currency = withdrawal.currency;
    const amount = withdrawal.currencyAmount;

    const balanceBefore = wallet[currency];
    const balanceAfter = balanceBefore + amount;

    wallet[currency] = balanceAfter;

    await wallet.save({ session });

    // Create reversal transaction
    const transactionId = crypto.randomUUID();

    const transaction = await WalletTransaction.create(
      [
        {
          transactionId,
          userId: withdrawal.userId,
          currency,
          type: "CORRECTION",
          amount,
          balanceBefore,
          balanceAfter,
          source: "WITHDRAWAL_REJECTION",
          referenceId: withdrawal.withdrawalId,
          status: "REVERSED",
          description: `Withdrawal rejected - ${amount} ${currency} returned to wallet`,
          metadata: {
            withdrawalId: withdrawal.withdrawalId,
            rejectionReason,
            reviewNote,
          },
        },
      ],
      { session }
    );

    // Update withdrawal
    withdrawal.status = "REJECTED";
    withdrawal.rejectionReason = rejectionReason;
    withdrawal.reviewNote = reviewNote;
    withdrawal.processedAt = new Date();

    await withdrawal.save({ session });

    // Audit log
    await createAuditLog({
      userId: withdrawal.userId,
      action: "REJECT_WITHDRAWAL",
      entity: "Withdrawal",
      entityId: withdrawal.withdrawalId,
      status: "SUCCESS",
      description: "Withdrawal rejected and wallet balance restored",
      metadata: {
        currency,
        amount,
        rejectionReason,
        reviewNote,
      },
      session,
    });

    await session.commitTransaction();

    return {
      withdrawal,
      transaction: transaction[0],
      wallet,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getAllWithdrawalsForAdmin = async ({ status, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (status) {
    filter.status = status.toUpperCase();
  }

  const [withdrawals, total] = await Promise.all([
    Withdrawal.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Withdrawal.countDocuments(filter),
  ]);

  return {
    withdrawals,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { createWithdrawal,  getWithdrawals,  getWithdrawalById ,  rejectWithdrawal,getAllWithdrawalsForAdmin,};