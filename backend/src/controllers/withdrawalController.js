const { createWithdrawal , getWithdrawals , getWithdrawalById,rejectWithdrawal,getAllWithdrawalsForAdmin,} = require("../services/withdrawalService");

const createWithdrawalController = async (req, res) => {
  try {
    const { method, optionId, payoutDetails } = req.body;

    const idempotencyKey = req.headers["idempotency-key"];

    if (!method || !optionId || !payoutDetails) {
      return res.status(400).json({
        message: "method, optionId and payoutDetails are required",
      });
    }

    const result = await createWithdrawal({
      userId: req.user.userId,
      method,
      optionId,
      payoutDetails,
      idempotencyKey,
    });

    if (result.duplicate) {
      return res.status(200).json({
        message: "Duplicate request. Existing withdrawal returned.",
        withdrawal: result.withdrawal,
      });
    }

    res.status(201).json({
      message: "Withdrawal request created successfully",
      withdrawal: result.withdrawal,
      transaction: result.transaction,
      wallet: result.wallet,
    });
  } catch (error) {
    console.error("Create withdrawal error:", error.message);

    res.status(400).json({
      message: error.message,
    });
  }
};

const getWithdrawalsController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getWithdrawals({
      userId: req.user.userId,
      page,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Get withdrawals error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getWithdrawalByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const withdrawal = await getWithdrawalById({
      userId: req.user.userId,
      withdrawalId: id,
    });

    res.status(200).json({
      withdrawal,
    });
  } catch (error) {
    console.error("Get withdrawal error:", error.message);

    res.status(404).json({
      message: error.message,
    });
  }
};

const rejectWithdrawalController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason, reviewNote } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const result = await rejectWithdrawal({
      withdrawalId: id,
      rejectionReason,
      reviewNote,
    });

    res.status(200).json({
      message: "Withdrawal rejected and balance restored successfully",
      withdrawal: result.withdrawal,
      transaction: result.transaction,
      wallet: result.wallet,
    });
  } catch (error) {
    console.error("Reject withdrawal error:", error.message);

    res.status(400).json({
      message: error.message,
    });
  }
};

const getAllWithdrawalsForAdminController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;

    const result = await getAllWithdrawalsForAdmin({
      status,
      page,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Get admin withdrawals error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { createWithdrawalController,getWithdrawalsController, getWithdrawalByIdController,rejectWithdrawalController, getAllWithdrawalsForAdminController,};