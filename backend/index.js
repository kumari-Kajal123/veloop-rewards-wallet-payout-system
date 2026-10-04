const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/wallet", require("./src/routes/walletRoutes"));
app.use("/api/payout", require("./src/routes/payoutRoutes"));
app.use("/api/withdrawals", require("./src/routes/withdrawalRoutes"));

app.get("/", (req, res) => {  res.json({ message: "Backend API is running", });});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});