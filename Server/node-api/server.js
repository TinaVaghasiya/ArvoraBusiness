import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import axios from "axios";
import cardRoutes from "./routes/cardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

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

// OCR Proxy - Forward requests from port 5000 to port 8000
app.use('/api/ocr', async (req, res, next) => {
  try {
    const ocrUrl = `http://localhost:8000${req.path}`;
    
    console.log(`🔄 Proxying OCR request to: ${ocrUrl}`);
    
    const response = await axios({
      method: req.method,
      url: ocrUrl,
      data: req.body,
      headers: {
        ...req.headers,
        host: 'localhost:8000'
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('❌ OCR Proxy Error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'OCR service unavailable',
      message: error.message 
    });
  }
});

app.use("/api/cards", cardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Business Card OCR API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${process.env.SERVER_URL}`);
});
