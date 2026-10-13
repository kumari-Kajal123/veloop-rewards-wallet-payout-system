
const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  claimDailyRewardController,
  claimSpinRewardController,
  getDailyRewardStatus,
} = require("../controllers/rewardController");

const router = express.Router();

router.get("/daily/status", authMiddleware, getDailyRewardStatus);

router.post(
  "/daily/claim",
  authMiddleware,
  claimDailyRewardController
);

router.post(
  "/spin/claim",
  authMiddleware,
  claimSpinRewardController
);

module.exports = router;

