import express from "express";
import multer from "multer";
import path from "path";

import { getCards, saveCard, deleteCard, updateCard } from "../controllers/cardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("uploads/business-cards"));
  },

  filename: (req, file, cb) => {
    cb(
      null,

      Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage });

router.get("/get-cards", authMiddleware, getCards);
router.post("/save-card", authMiddleware, upload.single("image"), saveCard);
router.delete("/delete-card/:id", authMiddleware, deleteCard);
router.put("/update-card/:id", authMiddleware, upload.single("image"), updateCard);

export default router;
