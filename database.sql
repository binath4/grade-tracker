-- Student Grade Tracker Database Setup

CREATE DATABASE IF NOT EXISTS grade_db;
USE grade_db;

DROP TABLE IF EXISTS students;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    marks INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample data (optional)
INSERT INTO students (name, subject, marks) VALUES
('John Doe', 'Mathematics', 85),
('Jane Smith', 'Physics', 92),
('Mike Johnson', 'Chemistry', 78);