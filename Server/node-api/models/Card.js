import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  name: String,
  designation: String,
  company: String,
  email: String,
  phone: String,
  website: String,
  note: String,
  imageUrl: String,
  address: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Card = mongoose.model("Card", cardSchema);

export default Card;
