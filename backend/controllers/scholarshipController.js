import { createScholarship, getAllScholarships , updateScholarshipStatus } from "../models/scholarship.js";

export const submitScholarship = async (req, res) => {
  try {
    await createScholarship(req.body);
    res.status(201).json({ message: "Scholarship application submitted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const listScholarships = async (req, res) => {
  try {
    const scholarships = await getAllScholarships();
    res.json(scholarships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveScholarship = async (req, res) => {
  try {
    await updateScholarshipStatus(req.params.id, "approved");
    res.json({ message: "Scholarship approved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectScholarship = async (req, res) => {
  try {
    await updateScholarshipStatus(req.params.id, "rejected");
    res.json({ message: "Scholarship rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
