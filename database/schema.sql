-- Sports Meet Database Schema

CREATE DATABASE IF NOT EXISTS sports_meet;
USE sports_meet;

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Age categories table
CREATE TABLE IF NOT EXISTS age_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    min_age INT,
    max_age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sports table
CREATE TABLE IF NOT EXISTS sports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age_category_id INT NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (age_category_id) REFERENCES age_categories(id) ON DELETE CASCADE
);

-- Results table
CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sport_id INT NOT NULL,
    gold_winner VARCHAR(255),
    silver_winner VARCHAR(255),
    bronze_winner VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE
);

-- Insert default admin (password: admin123)
INSERT INTO admins (username, password) VALUES ('admin', '$2b$10$somehashedpasswordhere');

-- Insert sample age categories
INSERT INTO age_categories (name, min_age, max_age) VALUES
('Under 10', 0, 10),
('Under 14', 11, 14),
('Under 17', 15, 17),
('Under 20', 18, 20),
('Open', 0, 99);
