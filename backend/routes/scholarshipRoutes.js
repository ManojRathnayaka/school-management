import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

// POST - Create Scholarship
router.post("/", async (req, res) => {
  try {
    const {
      student_id,
      father_name,
      father_occupation,
      father_income,
      father_contact,
      mother_name,
      mother_occupation,
      mother_income,
      mother_contact,
      school_name,
      academic_year,
      last_exam_passed,
      percentage_grade,
      reason_financial_need,
      reason_academic,
      reason_sports,
      reason_cultural,
      reason_other
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO scholarships 
      (student_id, father_name, father_occupation, father_income, father_contact, 
      mother_name, mother_occupation, mother_income, mother_contact, 
      school_name, academic_year, last_exam_passed, percentage_grade, 
      reason_financial_need, reason_academic, reason_sports, reason_cultural, reason_other)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id, father_name, father_occupation, father_income, father_contact,
        mother_name, mother_occupation, mother_income, mother_contact,
        school_name, academic_year, last_exam_passed, percentage_grade,
        reason_financial_need, reason_academic, reason_sports, reason_cultural, reason_other
      ]
    );

    res.json({ success: true, scholarship_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
