import User from "../models/User.js";
import Card from "../models/Card.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-verificationCode -otpExpiresAt")
      .sort({ createdAt: -1 });

    const cardCounts = await Card.aggregate([
      { $match: { user: { $ne: null } } },
      { $group: { _id: "$user", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    cardCounts.forEach(({ _id, count }) => {
      if (_id) countMap[_id.toString()] = count;
    });

    const usersWithCount = users.map((u) => ({
      ...u.toObject(),
      cardCount: countMap[u._id.toString()] || 0,
    }));

    res.json({
      success: true,
      data: { users: usersWithCount, total: usersWithCount.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email phone createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
