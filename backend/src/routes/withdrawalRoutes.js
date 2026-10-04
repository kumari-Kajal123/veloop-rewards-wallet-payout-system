const express = require("express");
const { createWithdrawalController,getWithdrawalsController,getWithdrawalByIdController,  rejectWithdrawalController, getAllWithdrawalsForAdminController,} = require("../controllers/withdrawalController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createWithdrawalController);

router.get("/", authMiddleware, getWithdrawalsController);

router.get( "/admin", authMiddleware, adminMiddleware, getAllWithdrawalsForAdminController);

router.get("/:id", authMiddleware, getWithdrawalByIdController);

router.patch( "/:id/reject", authMiddleware, adminMiddleware, rejectWithdrawalController);

module.exports = router;