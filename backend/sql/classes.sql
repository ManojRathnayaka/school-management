CREATE TABLE classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10),  -- Class Name (e.g., "10A")
    grade INT,
    teacher_id INT,  -- Foreign key to users (teacher assigned to the class)
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL ON UPDATE CASCADE
);