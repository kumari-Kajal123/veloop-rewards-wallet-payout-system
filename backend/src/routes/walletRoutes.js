const express = require("express");

const { getWallet, creditWalletController, debitWalletController , getTransactionsController , getWalletSummaryController } = require("../controllers/walletController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getWallet);

router.post( "/credit", authMiddleware, adminMiddleware, creditWalletController);

router.post( "/debit", authMiddleware, adminMiddleware, debitWalletController );

router.get( "/transactions", authMiddleware, getTransactionsController);

router.get( "/summary", authMiddleware, getWalletSummaryController );

module.exports = router;