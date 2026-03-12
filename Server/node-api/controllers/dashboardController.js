import User from "../models/User.js";
import Card from "../models/Card.js";

export const getDashboardStats = async (req, res) => {
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
      success: true,
      data: {
        totalUsers,
        totalCards,
        todaysScans,
        todaysSignups
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
