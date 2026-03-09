import express from "express";
import multer from "multer";
import path from "path";

import {
  getCards,
  saveCard,
  deleteCard,
  updateCard,
} from "../controllers/cardController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("uploads"));
  },

  filename: (req, file, cb) => {
    cb(
      null,

      Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage });

router.get("/get-cards", getCards);
router.post("/save-card", upload.single("image"), saveCard);
router.delete("/delete-card/:id", deleteCard);
router.put("/update-card/:id", upload.single("image"), updateCard);

export default router;
