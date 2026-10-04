const Wallet = require("../models/Wallet");
const { creditWallet , debitWallet , getTransactions , getWalletSummary } = require("../services/walletService");

const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      userId: req.user.userId,
    });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    res.status(200).json({
      wallet: {
        id: wallet._id,
        userId: wallet.userId,
        VEs: wallet.VEs,
        SVEs: wallet.SVEs,
        Gems: wallet.Gems,
        Tokens: wallet.Tokens,
        Spins: wallet.Spins,
      },
    });
  } catch (error) {
    console.error("Get wallet error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const creditWalletController = async (req, res) => {
  try {
    const {
      currency,
      amount,
      type,
      source,
      referenceId,
      description,
      metadata,
    } = req.body;

    if (!currency || !amount || !type || !source) {
      return res.status(400).json({
        message: "currency, amount, type and source are required",
      });
    }

    const result = await creditWallet({
      userId: req.user.userId,
      currency,
      amount,
      type,
      source,
      referenceId,
      description,
      metadata,
    });

    res.status(200).json({
      message: "Wallet credited successfully",
      wallet: result.wallet,
      transaction: result.transaction,
    });
  } catch (error) {
    console.error("Credit wallet error:", error.message);

    res.status(400).json({
      message: error.message,
    });
  }
};

const debitWalletController = async (req, res) => {
  try {
    const {
      currency,
      amount,
      type,
      source,
      referenceId,
      description,
      metadata,
    } = req.body;

    if (!currency || !amount || !type || !source) {
      return res.status(400).json({
        message: "currency, amount, type and source are required",
      });
    }

    const result = await debitWallet({
      userId: req.user.userId,
      currency,
      amount,
      type,
      source,
      referenceId,
      description,
      metadata,
    });

    res.status(200).json({
      message: "Wallet debited successfully",
      wallet: result.wallet,
      transaction: result.transaction,
    });
  } catch (error) {
    console.error("Debit wallet error:", error.message);

    res.status(400).json({
      message: error.message,
    });
  }
};

const getTransactionsController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getTransactions({
      userId: req.user.userId,
      page,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Get transactions error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getWalletSummaryController = async (req, res) => {
  try {
    const summary = await getWalletSummary(req.user.userId);

    res.status(200).json({
      summary,
    });
  } catch (error) {
    console.error("Get wallet summary error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { getWallet, creditWalletController, debitWalletController , getTransactionsController , getTransactionsController , getWalletSummaryController , };