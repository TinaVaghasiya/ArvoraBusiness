import express from "express";
import User from "../models/User.js";
import Card from "../models/Card.js";

const router = express.Router();

// Dashboard Stats
router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCards = await Card.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysScans = await Card.countDocuments({
      createdAt: { $gte: today }
    });
    
    const todaysSignups = await User.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      totalUsers,
      totalCards,
      todaysScans,
      todaysSignups
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Users with Pagination
router.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    
    const query = search ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ]
    } : {};

    const users = await User.find(query)
      .select("-verificationCode -otpExpiresAt")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Recent Users
router.get("/users/recent", async (req, res) => {
  try {
    const users = await User.find()
      .select("name email phone createdAt")
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete User
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Cards with Pagination
router.get("/cards", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.search || "";
    
    const query = search ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ]
    } : {};

    const cards = await Card.find(query)
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Card.countDocuments(query);

    res.json({
      cards,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Card
router.delete("/cards/:id", async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update User
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Card
router.put("/cards/:id", async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
