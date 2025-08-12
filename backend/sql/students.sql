CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    admission_number VARCHAR(50) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    grade INT NOT NULL,
    section CHAR(1) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    class_id INT NOT NULL,  -- Foreign key to classes table
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
); 