import AdSettings from '../models/AdSettings.js';

// Get ad settings
export const getAdSettings = async (req, res) => {
  try {
    let settings = await AdSettings.findOne();
    
    // If no settings exist, create default
    if (!settings) {
      settings = new AdSettings({ displayType: 'both' });
      await settings.save();
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching ad settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ad settings',
    });
  }
};

// Update ad settings (Admin only)
export const updateAdSettings = async (req, res) => {
  try {
    const { displayType } = req.body;

    if (!displayType || !['static', 'dynamic', 'both'].includes(displayType)) {
      return res.status(400).json({
        success: false,
        message: "displayType must be 'static', 'dynamic', or 'both'",
      });
    }

    let settings = await AdSettings.findOne();

    if (!settings) {
      // Create new settings
      settings = new AdSettings({
        displayType,
        updatedBy: req.admin.id,
      });
    } else {
      // Update existing settings
      settings.displayType = displayType;
      settings.updatedBy = req.admin.id;
      settings.updatedAt = Date.now();
    }

    await settings.save();

    res.json({
      success: true,
      message: 'Ad settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Error updating ad settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ad settings',
    });
  }
};
