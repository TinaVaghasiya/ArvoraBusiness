import express from "express";
import multer from "multer";
import path from "path";
import {
  getActiveAdvertisements,
  getAllAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  toggleAdvertisementStatus,
} from "../controllers/advertisementController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("uploads/advertisements"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/active", authMiddleware, getActiveAdvertisements);

// Admin routes
router.get("/all", adminAuth, getAllAdvertisements);
router.post("/create", adminAuth, upload.single("image"), createAdvertisement);
router.put("/update/:id", adminAuth, upload.single("image"), updateAdvertisement);
router.delete("/delete/:id", adminAuth, deleteAdvertisement);
router.patch("/toggle/:id", adminAuth, toggleAdvertisementStatus);

export default router;
