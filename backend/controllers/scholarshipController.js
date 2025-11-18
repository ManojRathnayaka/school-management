import { createScholarship, getAllScholarships, updateScholarshipStatus } from "../models/scholarship.js";

export const submitScholarship = async (req, res) => {
  try {
    await createScholarship(req.body);
    res.status(201).json({ message: "Scholarship application submitted successfully" });
  } catch (error) {
    console.error(error);
    if (error.message === 'Student not found with this admission number') {
      return res.status(404).json({ message: "Invalid admission number. Please check and try again." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const listScholarships = async (req, res) => {
  try {
    const scholarships = await getAllScholarships();
    res.json(scholarships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const approveScholarship = async (req, res) => {
  try {
    await updateScholarshipStatus(req.params.id, "approved");
    res.json({ message: "Scholarship approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const rejectScholarship = async (req, res) => {
  try {
    await updateScholarshipStatus(req.params.id, "rejected");
    res.json({ message: "Scholarship rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
