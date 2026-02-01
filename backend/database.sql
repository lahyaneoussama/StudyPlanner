
-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS study_planner_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE study_planner_db;

-- جدول المستخدمين
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    education_level VARCHAR(50),
    daily_study_goal INT DEFAULT 4,
    streak INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المواد الدراسية
CREATE TABLE subjects (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20),
    icon VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول المهام
CREATE TABLE tasks (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    subject_id VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    due_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
);

-- جدول جلسات الدراسة
CREATE TABLE study_sessions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    subject_id VARCHAR(50),
    day_name VARCHAR(20),
    start_time TIME,
    duration INT,
    goal TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
);
