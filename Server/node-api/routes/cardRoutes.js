// routes/cardRoutes.js
const express = require("express");
const router = express.Router();
const Card = require("../models/Card");

router.post("/save-card", async (req, res) => {
  try {
    const { name, company, email, phone } = req.body;
    console.log("📥 Incoming data:", req.body);
    const newCard = new Card({
      name,
      company,
      email,
      phone,
      note
    });

    await newCard.save();

    res.status(201).json({
      success: true,
      message: "Card saved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save card"
    });
  }
});

module.exports = router;
