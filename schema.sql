-- Create site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  service TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'new'
);

-- Insert initial values
INSERT OR REPLACE INTO site_settings (key, value) VALUES
  ('telegram_chat_id', ''),
  ('hero_title', 'Váš úsměv je naší prioritou'),
  ('hero_subtitle', 'Moderní stomatologická péče v centru Prahy s 15 lety zkušeností'),
  ('phone_number', '+420 777 888 999'),
  ('email', 'info@praha-dent.cz'),
  ('address', 'Václavské náměstí 1, Praha 1'),
  ('working_hours', 'Po-Pá: 8:00 - 18:00'),
  ('primary_color', 'blue'),
  ('show_callback_timer', 'true'),
  ('cta_text', 'Zarezervovat konzultaci');