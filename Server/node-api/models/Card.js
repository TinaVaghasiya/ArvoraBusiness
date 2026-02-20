const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: String,
  designation: String,
  company: String,
  email: String,
  phone: String,
  note: String,
  imageUrl: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Card", cardSchema);
