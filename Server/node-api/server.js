import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import cardRoutes from "./routes/cardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());              
app.use(express.json());   

app.use("/uploads", express.static(path.join(__dirname,"uploads")));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

app.use("/api/cards", cardRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Visiting Card API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${process.env.SERVER_URL}`);
});