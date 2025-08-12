import { pool } from "../config/db.js";

class HostelApplication {
  constructor(data) {
    this.application_id = data.application_id;
    this.student_id = data.student_id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.dob = data.dob;
    this.email = data.email;
    this.blood_group = data.blood_group;
    this.grade = data.grade;
    this.class = data.class;
    this.g_name = data.g_name;
    this.relationship = data.relationship;
    this.g_mobile_num = data.g_mobile_num;
    this.g_email = data.g_email;
    this.hostel_id = data.hostel_id;
    this.status = data.status || 'pending';
    this.applied_at = data.applied_at;
    this.approved_at = data.approved_at;
  }

  // Create a new hostel application
  static async create(applicationData) {
    const {
      student_id,
      first_name,
      last_name,
      dob,
      email,
      blood_group,
      grade,
      class: className,
      g_name,
      relationship,
      g_mobile_num,
      g_email,
      hostel_id
    } = applicationData;

    const [result] = await pool.query(
      `INSERT INTO hostel_applications
       (student_id, first_name, last_name, dob, email, blood_group, grade, class, g_name, relationship, g_mobile_num, g_email, hostel_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        first_name,
        last_name,
        dob,
        email,
        blood_group || null,
        grade || null,
        className || null,
        g_name || null,
        relationship || null,
        g_mobile_num || null,
        g_email || null,
        hostel_id
      ]
    );

    return result.insertId;
  }

  // Find application by ID
  static async findById(applicationId) {
    const [rows] = await pool.query(
      `SELECT * FROM hostel_applications WHERE application_id = ?`,
      [applicationId]
    );

    if (rows.length === 0) {
      return null;
    }

    return new HostelApplication(rows[0]);
  }

  // Find applications by student ID
  static async findByStudentId(studentId) {
    const [rows] = await pool.query(
      `SELECT * FROM hostel_applications WHERE student_id = ? ORDER BY applied_at DESC`,
      [studentId]
    );

    return rows.map(row => new HostelApplication(row));
  }

  // Check if student has pending application for specific hostel
  static async hasPendingApplication(studentId, hostelId) {
    const [rows] = await pool.query(
      `SELECT * FROM hostel_applications 
       WHERE student_id = ? AND hostel_id = ? AND status = 'pending'`,
      [studentId, hostelId]
    );

    return rows.length > 0;
  }

  // Get all applications with hostel details
  static async findAllWithHostels(status = null) {
    let sql = `SELECT ha.*, h.name AS hostel_name, h.location AS hostel_location
               FROM hostel_applications ha
               JOIN hostels h ON ha.hostel_id = h.hostel_id`;
    let params = [];

    if (status) {
      sql += ` WHERE ha.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY ha.applied_at DESC`;

    const [rows] = await pool.query(sql, params);
    return rows.map(row => new HostelApplication(row));
  }

  // Update application status
  static async updateStatus(applicationId, status) {
    const [result] = await pool.query(
      `UPDATE hostel_applications 
       SET status = ?, approved_at = IF(? = 'approved', NOW(), NULL) 
       WHERE application_id = ?`,
      [status, status, applicationId]
    );

    return result.affectedRows > 0;
  }

  // Get applications by status
  static async findByStatus(status) {
    const [rows] = await pool.query(
      `SELECT ha.*, h.name AS hostel_name
       FROM hostel_applications ha
       JOIN hostels h ON ha.hostel_id = h.hostel_id
       WHERE ha.status = ?
       ORDER BY ha.applied_at DESC`,
      [status]
    );

    return rows.map(row => new HostelApplication(row));
  }

  // Get application statistics
  static async getStats() {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_applications,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
      FROM hostel_applications
    `);

    return stats[0];
  }

  // Delete application (soft delete by updating status)
  static async softDelete(applicationId) {
    const [result] = await pool.query(
      `UPDATE hostel_applications SET status = 'cancelled' WHERE application_id = ?`,
      [applicationId]
    );

    return result.affectedRows > 0;
  }

  // Hard delete application
  static async delete(applicationId) {
    const [result] = await pool.query(
      `DELETE FROM hostel_applications WHERE application_id = ?`,
      [applicationId]
    );

    return result.affectedRows > 0;
  }

  // Get applications by hostel ID
  static async findByHostelId(hostelId, status = null) {
    let sql = `SELECT * FROM hostel_applications WHERE hostel_id = ?`;
    let params = [hostelId];

    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY applied_at DESC`;

    const [rows] = await pool.query(sql, params);
    return rows.map(row => new HostelApplication(row));
  }

  // Update application details
  async update(updateData) {
    const allowedFields = [
      'first_name', 'last_name', 'dob', 'email', 'blood_group',
      'grade', 'class', 'g_name', 'relationship', 'g_mobile_num', 'g_email'
    ];

    const updateFields = [];
    const updateValues = [];

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key]);
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateValues.push(this.application_id);

    const [result] = await pool.query(
      `UPDATE hostel_applications SET ${updateFields.join(', ')} WHERE application_id = ?`,
      updateValues
    );

    return result.affectedRows > 0;
  }

  // Instance method to save current application
  async save() {
    if (this.application_id) {
      // Update existing application
      return await this.update({
        first_name: this.first_name,
        last_name: this.last_name,
        dob: this.dob,
        email: this.email,
        blood_group: this.blood_group,
        grade: this.grade,
        class: this.class,
        g_name: this.g_name,
        relationship: this.relationship,
        g_mobile_num: this.g_mobile_num,
        g_email: this.g_email
      });
    } else {
      // Create new application
      const insertId = await HostelApplication.create(this);
      this.application_id = insertId;
      return insertId;
    }
  }

  // Get full name
  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  // Check if application is editable (only pending applications can be edited)
  isEditable() {
    return this.status === 'pending';
  }

  // Convert to plain object
  toJSON() {
    return {
      application_id: this.application_id,
      student_id: this.student_id,
      first_name: this.first_name,
      last_name: this.last_name,
      dob: this.dob,
      email: this.email,
      blood_group: this.blood_group,
      grade: this.grade,
      class: this.class,
      g_name: this.g_name,
      relationship: this.relationship,
      g_mobile_num: this.g_mobile_num,
      g_email: this.g_email,
      hostel_id: this.hostel_id,
      status: this.status,
      applied_at: this.applied_at,
      approved_at: this.approved_at
    };
  }
}

export default HostelApplication;