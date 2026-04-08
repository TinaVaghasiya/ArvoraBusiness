import Advertisement from "../models/Advertisement.js";

// Get all active advertisements
export const getActiveAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select("_id imageUrl link");

    res.status(200).json({
      success: true,
      data: advertisements,
    });
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch advertisements",
    });
  }
};

// Get all advertisements (Admin only)
export const getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find()
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: advertisements,
    });
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch advertisements",
    });
  }
};

// Create new advertisement (Admin only)
export const createAdvertisement = async (req, res) => {
  try {
    const { link, order } = req.body;

    if (!link) {
      return res.status(400).json({
        success: false,
        message: "Link is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Advertisement image is required",
      });
    }

    const imageUrl = `/uploads/advertisements/${req.file.filename}`;

    const advertisement = new Advertisement({
      imageUrl,
      link,
      order: order || 0,
    });

    await advertisement.save();

    res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      data: advertisement,
    });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create advertisement",
    });
  }
};

// Update advertisement (Admin only)
export const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const { link, order, isActive } = req.body;

    const updateData = {
      updatedAt: Date.now(),
    };

    if (link) updateData.link = link;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (req.file) {
      updateData.imageUrl = `/uploads/advertisements/${req.file.filename}`;
    }

    const advertisement = await Advertisement.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement updated successfully",
      data: advertisement,
    });
  } catch (error) {
    console.error("Error updating advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update advertisement",
    });
  }
};

// Delete advertisement (Admin only)
export const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await Advertisement.findByIdAndDelete(id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete advertisement",
    });
  }
};

// Toggle advertisement status (Admin only)
export const toggleAdvertisementStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await Advertisement.findById(id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    advertisement.isActive = !advertisement.isActive;
    advertisement.updatedAt = Date.now();
    await advertisement.save();

    res.status(200).json({
      success: true,
      message: `Advertisement ${advertisement.isActive ? "activated" : "deactivated"} successfully`,
      data: advertisement,
    });
  } catch (error) {
    console.error("Error toggling advertisement status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle advertisement status",
    });
  }
};
