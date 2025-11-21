import  {pool}  from "../config/db.js";

// 1. Student applies for hostel
export const applyForHostel = async (req, res) => {
  try {
    const {
      student_id,
      first_name,
      last_name,
      dob,
      email,
      blood_group,
      grade,
      class: className,   // because `class` is reserved in JS
      guardianName,
      guardianRelation,
      guardianPhone,
      guardianEmail,
      hostel_id
    } = req.body;

    // Validate required fields
    if (!student_id || !first_name || !last_name || !dob || !email || !hostel_id) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if student already applied for the same hostel and it's still pending
    const [existing] = await pool.query(
      `SELECT * FROM hostel_applications 
       WHERE student_id = ? AND hostel_id = ? AND status = 'pending'`,
      [student_id, hostel_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "You already have a pending application for this hostel" });
    }

    // Insert new hostel application
    const [result] = await pool.query(
      `INSERT INTO hostel_applications
       (student_id, first_name, last_name, dob, email, blood_group, grade, class, guardianName, guardianRelation, guardianPhone, guardianEmail, hostel_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [student_id, first_name, last_name, dob, email, blood_group || null, grade || null, className || null, guardianName || null, guardianRelation || null, guardianPhone || null, guardianEmail || null, hostel_id]
    );

    res.status(201).json({
      message: "Hostel application submitted successfully",
      application_id: result.insertId
    });

  } catch (err) {
    console.error("Hostel application error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 2. Student views their own applications
export const getMyApplications = async (req, res) => {
  try {
    const { student_id } = req.params;

    const [applications] = await pool.query(
      `SELECT * FROM hostel_applications WHERE student_id = ? ORDER BY applied_at DESC`,
      [student_id]
    );

    res.status(200).json(applications);

  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 3. Admin views all applications (optional filter by status)
export const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query; // optional ?status=pending

    let sql = `SELECT ha.*, h.name AS hostel_name
               FROM hostel_applications ha
               JOIN hostels h ON ha.hostel_id = h.hostel_id`;
    let params = [];

    if (status) {
      sql += ` WHERE ha.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY ha.applied_at DESC`;

    const [applications] = await pool.query(sql, params);

    res.status(200).json(applications);

  } catch (err) {
    console.error("Get all applications error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 4. Admin approves or rejects application
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;         // application_id
    const { status } = req.body;       // 'approved' or 'rejected'

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [result] = await pool.query(
      `UPDATE hostel_applications 
       SET status = ?, approved_at = IF(? = 'approved', NOW(), NULL) 
       WHERE application_id = ?`,
      [status, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: `Application ${status} successfully` });

  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const testRoute =  async (req, res) => {
    try {
      res.status(200).json({ message: `Route works successfully` });
  
    } catch (err) {
      console.error("Update status error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

