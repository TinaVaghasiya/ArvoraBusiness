import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

export default Advertisement;
