-- D1 Database Schema for Sergio Musel Barbershop

-- Site settings table for admin panel
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Leads table for contact form submissions
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  is_bot BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default site settings
INSERT OR IGNORE INTO site_settings (key, value, type) VALUES
  ('hero_title', 'Sergio Musel', 'text'),
  ('hero_subtitle', 'Классические стрижки и бритьё опасной бритвой в атмосфере винтажного джаза и лучшего виски', 'text'),
  ('hero_cta_primary', 'Записаться онлайн', 'text'),
  ('hero_cta_secondary', 'Позвонить', 'text'),
  ('phone', '+7 (999) 123-45-67', 'text'),
  ('address', 'г. Москва, ул. Барберская, д. 42', 'text'),
  ('work_hours', 'Ежедневно: 10:00 — 22:00', 'text'),
  ('instagram', '@sergio_musel', 'text'),
  ('telegram', '@sergio_musel_bot', 'text'),
  ('price_haircut', '1500₽', 'text'),
  ('price_beard', '800₽', 'text'),
  ('price_shave', '1200₽', 'text'),
  ('price_complex', '2500₽', 'text'),
  ('about_title', 'Sergio Musel', 'text'),
  ('about_text', 'Более 10 лет я посвятил искусству барберинга. Начинал в Италии, обучался у лучших мастеров Лондона и Нью-Йорка.', 'text'),
  ('enable_chat', 'true', 'boolean'),
  ('enable_booking', 'true', 'boolean'),
  ('enable_reviews', 'true', 'boolean');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages(session_id);