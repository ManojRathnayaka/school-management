import Hostel from "../models/hostels.js";

// @desc    Get all hostels
// @route   GET /api/hostels
// @access  Public
export const getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.getAll();

    res.status(200).json({
      success: true,
      count: hostels.length,
      data: hostels
    });

  } catch (err) {
    console.error("Error fetching hostels:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
