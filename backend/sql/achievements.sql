CREATE TABLE achievements (
    achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    grade ENUM('6', '7', '8', '9', '10', '11', '12', '13') NOT NULL,
    category ENUM('academic', 'sports', 'arts_cultural', 'extracurricular') NOT NULL,
    title VARCHAR(200) NOT NULL,
    details TEXT,
    image_path VARCHAR(255),
    achievement_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);