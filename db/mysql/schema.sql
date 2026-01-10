-- MySQL schema for signup/login and basic visa applications
-- Run this on your HostGator MySQL instance (update DB name/credentials as needed)

CREATE DATABASE IF NOT EXISTS zirhmute_embassy;
USE zirhmute_embassy;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash CHAR(60) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional session tokens table (for API tokens/JWT refresh if desired)
CREATE TABLE IF NOT EXISTS sessions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  token CHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Visa application stub table
CREATE TABLE IF NOT EXISTS visa_applications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  visa_type VARCHAR(50) NOT NULL,
  first_name VARCHAR(80),
  last_name VARCHAR(80),
  gender VARCHAR(20),
  date_of_birth DATE,
  place_of_birth VARCHAR(120),
  city VARCHAR(120),
  country_of_birth VARCHAR(120),
  nationality_origin VARCHAR(120),
  nationality_current VARCHAR(120),
  address VARCHAR(200),
  city_address VARCHAR(120),
  country_address VARCHAR(120),
  marital_status VARCHAR(50),
  father_name VARCHAR(160),
  profession VARCHAR(120),
  employer VARCHAR(160),
  employer_address VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Birth Certificate Applications table
CREATE TABLE IF NOT EXISTS birth_certificate_applications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  user_name VARCHAR(255) NOT NULL,

  -- Child Information
  child_first_name VARCHAR(100) NOT NULL,
  child_last_name VARCHAR(100) NOT NULL,
  child_middle_name VARCHAR(100),
  child_birth_date DATE NOT NULL,
  child_birth_place VARCHAR(150) NOT NULL,
  child_birth_country VARCHAR(100) NOT NULL,
  child_gender ENUM('male', 'female', 'other') NOT NULL,
  child_nationality VARCHAR(100) NOT NULL,

  -- Father Information
  father_first_name VARCHAR(100) NOT NULL,
  father_last_name VARCHAR(100) NOT NULL,
  father_birth_date DATE,
  father_birth_place VARCHAR(150),
  father_nationality VARCHAR(100) NOT NULL,
  father_occupation VARCHAR(100),
  father_address TEXT,

  -- Mother Information
  mother_first_name VARCHAR(100) NOT NULL,
  mother_last_name VARCHAR(100) NOT NULL,
  mother_maiden_name VARCHAR(100),
  mother_birth_date DATE,
  mother_birth_place VARCHAR(150),
  mother_nationality VARCHAR(100) NOT NULL,
  mother_occupation VARCHAR(100),
  mother_address TEXT,

  -- Applicant Information
  applicant_relationship VARCHAR(100) NOT NULL,
  applicant_first_name VARCHAR(100) NOT NULL,
  applicant_last_name VARCHAR(100) NOT NULL,
  applicant_phone VARCHAR(50) NOT NULL,
  applicant_email VARCHAR(150) NOT NULL,
  applicant_address TEXT NOT NULL,

  -- Certificate Details
  certificate_purpose TEXT NOT NULL,
  is_minor BOOLEAN DEFAULT TRUE,
  original_registration_number VARCHAR(100),

  -- Application Status and Tracking
  status ENUM('pending', 'under_review', 'approved', 'denied', 'shipped') DEFAULT 'pending',
  tracking_number VARCHAR(100),
  shipping_carrier VARCHAR(100),
  status_history TEXT,
  admin_notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_name (user_name),
  INDEX idx_status (status),
  INDEX idx_tracking (tracking_number),
  INDEX idx_child_name (child_last_name, child_first_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Marriage Certificate Applications table
CREATE TABLE IF NOT EXISTS marriage_applications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  user_name VARCHAR(255) NOT NULL,

  -- Spouse 1 Information
  spouse1_first_name VARCHAR(100) NOT NULL,
  spouse1_last_name VARCHAR(100) NOT NULL,
  spouse1_birth_date DATE NOT NULL,
  spouse1_birth_place VARCHAR(150),
  spouse1_nationality VARCHAR(100) NOT NULL,
  spouse1_passport_number VARCHAR(50),
  spouse1_address TEXT,
  spouse1_phone VARCHAR(50),
  spouse1_email VARCHAR(150),
  spouse1_occupation VARCHAR(150),
  spouse1_father_name VARCHAR(150),
  spouse1_mother_name VARCHAR(150),

  -- Spouse 2 Information
  spouse2_first_name VARCHAR(100) NOT NULL,
  spouse2_last_name VARCHAR(100) NOT NULL,
  spouse2_birth_date DATE NOT NULL,
  spouse2_birth_place VARCHAR(150),
  spouse2_nationality VARCHAR(100) NOT NULL,
  spouse2_passport_number VARCHAR(50),
  spouse2_address TEXT,
  spouse2_phone VARCHAR(50),
  spouse2_email VARCHAR(150),
  spouse2_occupation VARCHAR(150),
  spouse2_father_name VARCHAR(150),
  spouse2_mother_name VARCHAR(150),

  -- Marriage Details
  marriage_date DATE NOT NULL,
  marriage_place VARCHAR(150) NOT NULL,
  marriage_country VARCHAR(100) NOT NULL,
  marriage_type ENUM('civil', 'religious', 'traditional', 'other') NOT NULL,
  certificate_purpose TEXT NOT NULL,

  -- Application Status and Tracking
  status ENUM('pending', 'under_review', 'approved', 'denied', 'shipped') DEFAULT 'pending',
  tracking_number VARCHAR(100),
  shipping_carrier VARCHAR(100),
  status_history TEXT,
  admin_notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_name (user_name),
  INDEX idx_status (status),
  INDEX idx_tracking (tracking_number),
  INDEX idx_marriage_date (marriage_date),
  INDEX idx_spouse_names (spouse1_last_name, spouse2_last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Travel Pass (Laissez-Passer) Applications table
CREATE TABLE IF NOT EXISTS travel_pass_applications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  user_name VARCHAR(255) NOT NULL,

  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  maiden_name VARCHAR(100),
  date_of_birth DATE NOT NULL,
  place_of_birth VARCHAR(150) NOT NULL,
  country_of_birth VARCHAR(100) NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  nationality VARCHAR(100) NOT NULL,

  -- Physical Description
  height VARCHAR(20),
  eye_color VARCHAR(50),
  hair_color VARCHAR(50),
  distinguishing_marks TEXT,

  -- Contact Information
  current_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(150) NOT NULL,

  -- Family Information
  father_name VARCHAR(160),
  mother_name VARCHAR(160),
  mother_maiden_name VARCHAR(100),
  marital_status ENUM('single', 'married', 'divorced', 'widowed') NOT NULL,
  spouse_name VARCHAR(160),

  -- Travel Details
  travel_reason TEXT NOT NULL,
  destination_country VARCHAR(100) NOT NULL,
  destination_city VARCHAR(100),
  departure_date DATE NOT NULL,
  return_date DATE,
  travel_duration VARCHAR(50),

  -- Emergency Contact
  emergency_contact_name VARCHAR(160) NOT NULL,
  emergency_contact_relationship VARCHAR(100) NOT NULL,
  emergency_contact_phone VARCHAR(50) NOT NULL,
  emergency_contact_address TEXT,

  -- Document Information
  passport_lost BOOLEAN DEFAULT FALSE,
  passport_stolen BOOLEAN DEFAULT FALSE,
  passport_expired BOOLEAN DEFAULT FALSE,
  previous_passport_number VARCHAR(100),
  passport_issue_date DATE,
  passport_expiry_date DATE,
  police_report_number VARCHAR(100),
  police_report_date DATE,

  -- Application Status and Tracking
  status ENUM('pending', 'under_review', 'approved', 'denied', 'issued', 'collected') DEFAULT 'pending',
  tracking_number VARCHAR(100),
  shipping_carrier VARCHAR(100),
  status_history TEXT,
  admin_notes TEXT,
  issue_date DATE,
  expiry_date DATE,
  document_number VARCHAR(100),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_name (user_name),
  INDEX idx_status (status),
  INDEX idx_tracking (tracking_number),
  INDEX idx_applicant_name (last_name, first_name),
  INDEX idx_departure_date (departure_date),
  INDEX idx_document_number (document_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Chat Conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL UNIQUE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  status ENUM('active', 'closed') DEFAULT 'active',
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session_id (session_id),
  INDEX idx_user_email (user_email),
  INDEX idx_status (status),
  INDEX idx_last_message_at (last_message_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Chat Messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT UNSIGNED NOT NULL,
  sender_type ENUM('user', 'bot', 'admin') NOT NULL,
  sender_name VARCHAR(255) DEFAULT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert an admin test user (replace the hash with a real bcrypt hash)
-- Password hash below is bcrypt for the password "ChangeMe123!"
INSERT INTO users (full_name, email, password_hash)
VALUES ('Admin User', 'admin@example.com', '$2b$10$kz2yS5mIRZk5r0uohFQxB.gqXzh8bkUg.vgJmioWmTOUHw67MquB6')
ON DUPLICATE KEY UPDATE email=email;
