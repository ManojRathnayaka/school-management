import { pool } from "../config/db.js";

export async function createParent(parentData) {
  const { user_id, contact_number } = parentData;
  
  const [result] = await pool.query(`
    INSERT INTO parents (user_id, contact_number)
    VALUES (?, ?)
  `, [user_id, contact_number]);
  
  return result;
}

export async function findParentByUserId(user_id) {
  const [rows] = await pool.query(`
    SELECT p.*, u.first_name, u.last_name, u.email, u.role
    FROM parents p
    JOIN users u ON p.user_id = u.user_id
    WHERE p.user_id = ?
  `, [user_id]);
  
  return rows[0];
}

export async function linkStudentToParent(student_id, parent_id) {
  const [result] = await pool.query(`
    INSERT INTO student_parents (student_id, parent_id)
    VALUES (?, ?)
  `, [student_id, parent_id]);
  
  return result;
} 

export async function findParentById(parent_id) {
  const [rows] = await pool.query(`
    SELECT p.*, u.first_name, u.last_name, u.email, u.role, u.user_id
    FROM parents p
    JOIN users u ON p.user_id = u.user_id
    WHERE p.parent_id = ?
  `, [parent_id]);

  return rows[0];
}

export async function deleteParentRecord(parent_id) {
  const [result] = await pool.query(`
    DELETE FROM parents 
    WHERE parent_id = ?
  `, [parent_id]);

  return result;
}

export async function updateParentInfo(parent_id, parentData) {
  const { contact_number } = parentData;
  
  const [result] = await pool.query(`
    UPDATE parents
    SET contact_number = ?
    WHERE parent_id = ?
  `, [contact_number, parent_id]);
  
  return result;
}