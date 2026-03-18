import Card from "../models/Card.js";

export const getAdminCards = async (req, res) => {
  try {
    const cards = await Card.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        cards,
        total: cards.length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const deleteAdminCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: "Card not found" 
      });
    }
    res.json({ 
      success: true, 
      message: "Card deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const updateAdminCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: "Card not found" 
      });
    }
    res.json({
      success: true,
      data: card
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getCardsByUser = async (req, res) => {
  try {
    const cards = await Card.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { cards, total: cards.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

