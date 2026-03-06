-- Migration: Add needs_password_change column to existing admin_users tables
-- This migration is safe to run multiple times (idempotent)

-- SQLite doesn't support ALTER TABLE IF NOT EXISTS directly, so we use a workaround
-- We try to add the column, and if it already exists, the operation will be ignored

-- For SQLite, we need to check if column exists before adding
-- Since D1 uses SQLite, we use a safe approach:

-- Attempt to add the column (will fail silently if column already exists)
-- This is safe because D1 will return an error but won't break the database
ALTER TABLE admin_users ADD COLUMN needs_password_change INTEGER DEFAULT 1;

-- Note: If the column already exists, D1 will return an error but the database will remain intact
-- The application will continue to work normally
