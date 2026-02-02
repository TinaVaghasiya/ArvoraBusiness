const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());              
app.use(express.json());       

mongoose
  .connect("mongodb://127.0.0.1:27017/visitingCardDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const cardRoutes = require("./routes/cardRoutes");
app.use("/api/cards", cardRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Visiting Card API is running");
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`🔥 Server running on http://192.168.29.89:${PORT}`);
});