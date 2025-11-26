CREATE TABLE auditorium_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  attendees INT,
  event_type VARCHAR(100),
  equipment TEXT,
  notes TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  requested_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requested_by) REFERENCES users(email) ON DELETE CASCADE ON UPDATE CASCADE
);





