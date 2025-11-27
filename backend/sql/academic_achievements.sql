CREATE TABLE academic_achievements (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    student VARCHAR(100) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    category ENUM('Science','Mathematics','Literature','Arts','Sports','Technology','Other') NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) DEFAULT '/api/placeholder/300/200',
    level ENUM('School','District','Provincial','National','International') NOT NULL,
    position VARCHAR(50) NOT NULL,
    points VARCHAR(20) DEFAULT NULL,
    teacher VARCHAR(100) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
