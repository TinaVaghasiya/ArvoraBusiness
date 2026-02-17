const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: String,
  company: String,
  email: String,
  phone: String,
  note: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Card", cardSchema);
