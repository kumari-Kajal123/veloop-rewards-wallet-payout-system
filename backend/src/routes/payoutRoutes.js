const express = require("express");
const { getPayoutMethods  , getPayoutOptions,} = require("../controllers/payoutController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/methods", authMiddleware, getPayoutMethods);

router.get("/options/:method", authMiddleware, getPayoutOptions);

module.exports = router;