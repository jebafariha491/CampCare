CREATE DATABASE IF NOT EXISTS campcare;
USE campcare;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('worker', 'supervisor') NOT NULL,
    zone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE families (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guardian_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    zone VARCHAR(50) NOT NULL,
    worker_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES users(id)
);

CREATE TABLE children (
    id INT AUTO_INCREMENT PRIMARY KEY,
    family_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id)
);

CREATE TABLE epi_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vaccine_name VARCHAR(100) NOT NULL,
    due_week_from_birth INT NOT NULL
);

CREATE TABLE vaccination_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    vaccine_name VARCHAR(100) NOT NULL,
    date_given DATE NOT NULL,
    FOREIGN KEY (child_id) REFERENCES children(id)
);

CREATE TABLE camps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zone VARCHAR(50) NOT NULL,
    location VARCHAR(150) NOT NULL,
    camp_date DATE NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE camp_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    camp_id INT NOT NULL,
    child_id INT NOT NULL,
    attended BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (camp_id) REFERENCES camps(id),
    FOREIGN KEY (child_id) REFERENCES children(id)
);

CREATE TABLE telegram_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    family_id INT NOT NULL,
    chat_id VARCHAR(50) NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id)
);

INSERT INTO epi_schedule (vaccine_name, due_week_from_birth) VALUES
('BCG', 0),
('OPV-0', 0),
('Penta-1 / PCV-1 / OPV-1', 6),
('Penta-2 / PCV-2 / OPV-2', 10),
('Penta-3 / PCV-3 / OPV-3 / IPV', 14),
('MR-1', 39),
('MR-2', 65);