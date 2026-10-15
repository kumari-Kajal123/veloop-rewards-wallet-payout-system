const express = require("express");
const { createWithdrawalController,getWithdrawalsController,getWithdrawalByIdController, 
   rejectWithdrawalController, approveWithdrawalController , getAllWithdrawalsForAdminController, 
   getWithdrawalStatisticsController ,getAdminWalletOverviewController,} = require("../controllers/withdrawalController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createWithdrawalController);

router.get("/", authMiddleware, getWithdrawalsController);

router.get( "/admin", authMiddleware, adminMiddleware, getAllWithdrawalsForAdminController);

router.get("/admin/statistics", authMiddleware, adminMiddleware, getWithdrawalStatisticsController);

router.get("/:id", authMiddleware, getWithdrawalByIdController);

router.patch( "/:id/reject", authMiddleware, adminMiddleware, rejectWithdrawalController);

router.patch(
  "/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveWithdrawalController
);

router.get(
  "/admin/statistics",
  authMiddleware,
  adminMiddleware,
  getWithdrawalStatisticsController
);

router.get(
  "/admin/wallet-overview",
  authMiddleware,
  adminMiddleware,
  getAdminWalletOverviewController
);

module.exports = router;