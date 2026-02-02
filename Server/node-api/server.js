// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/scan-card", async (req, res) => {
//   try {
//     const { text } = req.body;

//     const response = await axios.post("http://127.0.0.1:5000/scan", {
//       text: text
//     });

//     const aiResult = response.data;

//     res.json({
//       success: true,
//       data: aiResult
//     });

//   } catch (error) {
//     console.error("Scan error:", error.message);
//     res.status(500).json({
//       success: false,
//       error: "Scan failed"
//     });
//   }
// });

// app.listen(4000, () => {
//   console.log("Node API running on http://localhost:4000");
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors());              
app.use(express.json());       

// --------------------
// MongoDB Connection
// --------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/visitingCardDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// --------------------
// Routes
// --------------------
const cardRoutes = require("./routes/cardRoutes");
app.use("/api/cards", cardRoutes);

// --------------------
// Test Route
// --------------------
app.get("/", (req, res) => {
  res.send("🚀 Visiting Card API is running");
});

// --------------------
// Start Server
// --------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
