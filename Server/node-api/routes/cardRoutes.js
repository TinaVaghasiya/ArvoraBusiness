const express = require("express");
const router = express.Router();
const Card = require("../models/Card");

router.get("/get-cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/save-card", async (req, res) => {
  try {
    const { name, company, email, phone, note } = req.body;
    console.log("Incoming data:", req.body);
    const newCard = new Card({
      name,
      company,
      email,
      phone,
      note,
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

router.delete("/delete-card/:id", async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update-card/:id", async (req, res) => {
  try {
    const { name, company, email, phone, note } = req.body;
    await Card.findByIdAndUpdate(req.params.id, {
      name,
      company,
      email,
      phone,
      note,
    });
    res.json({ message: "Card updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
