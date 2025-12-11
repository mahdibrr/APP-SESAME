-- Database initialization script
-- This runs when the MySQL container starts for the first time

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS university_leave_db;

-- Use the database
USE university_leave_db;

-- Grant privileges to app user
GRANT ALL PRIVILEGES ON university_leave_db.* TO 'app_user'@'%';
FLUSH PRIVILEGES;

-- Basic health check
SELECT 'Database initialized successfully' as status;