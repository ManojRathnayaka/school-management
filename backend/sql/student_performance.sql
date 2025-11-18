 CREATE TABLE student_performance (
    performance_id INT AUTO_INCREMENT PRIMARY KEY,
     student_id INT NOT NULL,  -- Foreign key to students table
     class_id INT NOT NULL,    -- Foreign key to classes table
     academic_score DECIMAL(5, 2) NOT NULL,
     sports_score DECIMAL(5, 2) NOT NULL,
     discipline_score DECIMAL(5, 2) NOT NULL,
     leadership_score DECIMAL(5, 2) NOT NULL,
     comments TEXT,
     updated_by INT NOT NULL,  -- Foreign key to users (teacher who updated)
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
     FOREIGN KEY (class_id) REFERENCES classes(class_id)
 );

