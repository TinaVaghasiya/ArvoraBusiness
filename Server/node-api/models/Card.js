import mongoose from "mongoose";

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

const Card = mongoose.model("Card", cardSchema);

export default Card;
