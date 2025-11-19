import { pool } from "../config/db.js";

class AcademicAchievement {
  // Create table if not exists
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS academic_achievements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        student VARCHAR(100) NOT NULL,
        grade VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        category ENUM('Science', 'Mathematics', 'Literature', 'Arts', 'Sports', 'Technology', 'Other') NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) DEFAULT '/api/placeholder/300/200',
        level ENUM('School', 'District', 'Provincial', 'National', 'International') NOT NULL,
        position VARCHAR(50) NOT NULL,
        points INT NOT NULL CHECK (points >= 0 AND points <= 100),
        teacher VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_student (student),
        INDEX idx_category (category),
        INDEX idx_level (level),
        INDEX idx_date (date)
      ) ENGINE=Innopool DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    try {
      await pool.query(query);
      console.log('Academic achievements table created successfully');
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  }

  // Get all achievements with filtering and pagination
  static async findAll(filters = {}, page = 1, limit = 10) {
    let query = 'SELECT * FROM academic_achievements WHERE is_active = true';
    const params = [];
    
    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    
    if (filters.level) {
      query += ' AND level = ?';
      params.push(filters.level);
    }
    
    if (filters.student) {
      query += ' AND student LIKE ?';
      params.push(`%${filters.student}%`);
    }
    
    if (filters.grade) {
      query += ' AND grade = ?';
      params.push(filters.grade);
    }
    
    // Sorting
    if (filters.sort === 'points') {
      query += ' ORDER BY points DESC, date DESC';
    } else if (filters.sort === 'title') {
      query += ' ORDER BY title ASC';
    } else {
      query += ' ORDER BY date DESC';
    }
    
    // Pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [rows] = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM academic_achievements WHERE is_active = true';
    const countParams = [];
    
    if (filters.category) {
      countQuery += ' AND category = ?';
      countParams.push(filters.category);
    }
    if (filters.level) {
      countQuery += ' AND level = ?';
      countParams.push(filters.level);
    }
    if (filters.student) {
      countQuery += ' AND student LIKE ?';
      countParams.push(`%${filters.student}%`);
    }
    if (filters.grade) {
      countQuery += ' AND grade = ?';
      countParams.push(filters.grade);
    }
    
    const [countResult] = await pool.query(countQuery, countParams);
    
    return {
      data: rows,
      total: countResult[0].total,
      page: parseInt(page),
      pages: Math.ceil(countResult[0].total / limit)
    };
  }

  // Find by ID
  static async finpoolyId(id) {
    const query = 'SELECT * FROM academic_achievements WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  // Create new achievement
  static async create(achievementData) {
    const query = `
      INSERT INTO academic_achievements 
      (title, student, grade, date, category, description, image, level, position, points, teacher)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      achievementData.title,
      achievementData.student,
      achievementData.grade,
      achievementData.date,
      achievementData.category,
      achievementData.description,
      achievementData.image || '/api/placeholder/300/200',
      achievementData.level,
      achievementData.position,
      achievementData.points,
      achievementData.teacher
    ];
    
    const [result] = await pool.query(query, params);
    return this.finpoolyId(result.insertId);
  }

  // Update achievement
  static async update(id, achievementData) {
    const fields = [];
    const params = [];
    
    Object.keys(achievementData).forEach(key => {
      if (achievementData[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(achievementData[key]);
      }
    });
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    params.push(id);
    const query = `UPDATE academic_achievements SET ${fields.join(', ')} WHERE id = ?`;
    
    await pool.query(query, params);
    return this.finpoolyId(id);
  }

  // Delete achievement (hard delete)
  static async delete(id) {
    const query = 'DELETE FROM academic_achievements WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Soft delete (deactivate)
  static async deactivate(id) {
    const query = 'UPDATE academic_achievements SET is_active = false WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Get by category
  static async finpoolyCategory(category) {
    const query = `
      SELECT * FROM academic_achievements 
      WHERE category = ? AND is_active = true 
      ORDER BY date DESC
    `;
    const [rows] = await pool.query(query, [category]);
    return rows;
  }

  // Get top achievements
  static async getTopAchievements(limit = 10) {
    const query = `
      SELECT * FROM academic_achievements 
      WHERE is_active = true 
      ORDER BY points DESC, date DESC 
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [limit]);
    return rows;
  }

  // Get statistics
  static async getStats() {
    const query = `
      SELECT 
        category,
        COUNT(*) as count,
        AVG(points) as avgPoints,
        MAX(points) as maxPoints
      FROM academic_achievements 
      WHERE is_active = true 
      GROUP BY category 
      ORDER BY count DESC
    `;
    const [rows] = await pool.query(query);
    
    const countQuery = 'SELECT COUNT(*) as total FROM academic_achievements WHERE is_active = true';
    const [countResult] = await pool.query(countQuery);
    
    return {
      totalAchievements: countResult[0].total,
      categoryStats: rows
    };
  }
}

export default AcademicAchievement;