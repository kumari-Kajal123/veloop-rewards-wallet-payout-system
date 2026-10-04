const mongoose = require("mongoose");
const dotenv = require("dotenv");

const PayoutOption = require("../models/PayoutOption");

dotenv.config();

const payoutOptions = [
  {
    methodId: "UPI",
    optionId: "UPI_10",
    name: "₹10 UPI",
    type: "CASH",
    currency: "VEs",
    payoutValue: 10,
    requiredAmount: 2400,
    active: true,
    eligibility: {},
    metadata: {
      provider: "UPI",
    },
  },
  {
    methodId: "UPI",
    optionId: "UPI_25",
    name: "₹25 UPI",
    type: "CASH",
    currency: "VEs",
    payoutValue: 25,
    requiredAmount: 5800,
    active: true,
    eligibility: {},
    metadata: {
      provider: "UPI",
    },
  },
  {
    methodId: "UPI",
    optionId: "UPI_50",
    name: "₹50 UPI",
    type: "CASH",
    currency: "VEs",
    payoutValue: 50,
    requiredAmount: 10000,
    active: true,
    eligibility: {},
    metadata: {
      provider: "UPI",
    },
  },
  {
    methodId: "UPI",
    optionId: "UPI_100",
    name: "₹100 UPI",
    type: "CASH",
    currency: "VEs",
    payoutValue: 100,
    requiredAmount: 19500,
    active: true,
    eligibility: {},
    metadata: {
      provider: "UPI",
    },
  },
  {
    methodId: "UPI",
    optionId: "UPI_150",
    name: "₹150 UPI",
    type: "CASH",
    currency: "VEs",
    payoutValue: 150,
    requiredAmount: 28500,
    active: true,
    eligibility: {},
    metadata: {
      provider: "UPI",
    },
  },
  {
    methodId: "UPI",
    optionId: "UPI_300",
    name: "₹300 UPI",
    type: "CASH",
    currency: "VEs",
    payoutValue: 300,
    requiredAmount: 52500,
    active: true,
    eligibility: {},
    metadata: {
      provider: "UPI",
    },
  },
  {
    methodId: "UPI",
    optionId: "UPI_500",
    name: "₹500 UPI",
    type: "CASH",
    currency: "VEs",
    payoutValue: 500,
    requiredAmount: 80500,
    active: true,
    eligibility: {},
    metadata: {
      provider: "UPI",
    },
  },
  {
    methodId: "UPI",
    optionId: "UPI_1000",
    name: "₹1000 UPI",
    type: "CASH",
    currency: "VEs",
    payoutValue: 1000,
    requiredAmount: 150000,
    active: true,
    eligibility: {},
    metadata: {
      provider: "UPI",
    },
  },
];

const seedPayoutOptions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    await PayoutOption.deleteMany({});

    await PayoutOption.insertMany(payoutOptions);

    console.log("Payout options seeded successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Payout options seed error:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedPayoutOptions();