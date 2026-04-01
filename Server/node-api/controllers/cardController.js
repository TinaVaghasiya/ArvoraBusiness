import Card from "../models/Card.js";
import fs from "fs";
import path from "path";

const uploadPath = path.resolve("uploads");

export const getCards = async (req, res) => {
  try {
    const userId = req.user.id;
    const cards = await Card.find({user: userId, isDeleted: false}).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: cards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const saveCard = async (req, res) => {
  try {
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const userId = req.user.id;

    const newCard = new Card({
      ...req.body,
      imageUrl,
      user : userId
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
};

export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    if (card.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Card.findByIdAndUpdate(req.params.id, { isDeleted: true });

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    if (card.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let imageUrl = card.imageUrl;

    if (req.file) {
      if (card.imageUrl) {
        const oldFile = card.imageUrl.split("/uploads/")[1];

        const filepath = path.join(uploadPath, oldFile);

        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      }

      imageUrl = `/uploads/${req.file.filename}`;
    }

    await Card.findByIdAndUpdate(
      req.params.id,

      {
        ...req.body,
        imageUrl,
      },
    );

    res.json({
      success: true,
      message: "Updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
