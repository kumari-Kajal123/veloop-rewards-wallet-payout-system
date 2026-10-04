const PayoutOption = require("../models/PayoutOption");

const getPayoutMethods = async (req, res) => {
  try {
    const methods = await PayoutOption.aggregate([
      {
        $match: {
          active: true,
        },
      },
      {
        $group: {
          _id: "$methodId",
          name: { $first: "$methodId" },
          type: { $first: "$type" },
          currency: { $first: "$currency" },
        },
      },
      {
        $project: {
          _id: 0,
          methodId: "$_id",
          name: 1,
          type: 1,
          currency: 1,
        },
      },
    ]);

    res.status(200).json({
      methods,
    });
  } catch (error) {
    console.error("Get payout methods error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getPayoutOptions = async (req, res) => {
  try {
    const { method } = req.params;

    const options = await PayoutOption.find({
      methodId: method.toUpperCase(),
      active: true,
    }).sort({ payoutValue: 1 });

    if (options.length === 0) {
      return res.status(404).json({
        message: "No payout options found for this method",
      });
    }

    res.status(200).json({
      method: method.toUpperCase(),
      options,
    });
  } catch (error) {
    console.error("Get payout options error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {getPayoutMethods,getPayoutOptions,};