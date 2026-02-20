require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());              
app.use(express.json());   

app.use("/uploads", express.static(path.join(__dirname,"uploads")));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const cardRoutes = require("./routes/cardRoutes");
app.use("/api/cards", cardRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Visiting Card API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${process.env.SERVER_URL}`);
});