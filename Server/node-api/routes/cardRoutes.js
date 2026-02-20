const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Card = require("../models/Card");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/get-cards", async (req, res) => {
  try {
    const cards = await Card.find();

    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/save-card", upload.single("image"),
  async (req, res) => {
    try {
      const imageUrl = req.file
        ? `${process.env.SERVER_URL}/uploads/${req.file.filename}`
        : "";

      const newCard = new Card({
        name: req.body.name,
        designation: req.body.designation,
        company: req.body.company,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        note: req.body.note,
        imageUrl,
      });

      await newCard.save();

      res.status(201).json({
        success: true,
        message: "Card saved successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to save",
      });
    }
  },
);

router.delete("/delete-card/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (card?.imageUrl) {
      const filename = card.imageUrl.split("/uploads/")[1];
      const filepath = path.join(__dirname, "../uploads", filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    await Card.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Card deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/update-card/:id", upload.single("image"),
  async (req, res) => {
    try {
      const card = await Card.findById(req.params.id);

      let imageUrl = card.imageUrl;

      if (req.file) {
        if (card.imageUrl) {
          const oldFile = card.imageUrl.split("/uploads/")[1];

          const filepath = path.join(__dirname, "../uploads", oldFile);
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
        }
        imageUrl = `http://192.168.1.8:5000/uploads/${req.file.filename}`;
      }
      await Card.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          designation: req.body.designation,
          company: req.body.company,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          note: req.body.note,
          imageUrl,
        },
      );

      res.json({
        success: true,
        message: "Card updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);
module.exports = router;
