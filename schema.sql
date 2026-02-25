-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  service TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT 0
);

-- Insert default settings
INSERT OR IGNORE INTO site_settings (key, value) VALUES
('telegram_chat_id', ''),
('clinic_name', 'Dental Care Prague'),
('hero_title', 'Váš úsměv je naší předností'),
('hero_subtitle', 'Moderní stomatologická klinika v centru Prahy'),
('clinic_phone', '+420 123 456 789'),
('clinic_email', 'info@dentalprague.cz'),
('clinic_address', 'Václavské náměstí 1, Praha 1'),
('whatsapp_number', '+420123456789'),
('opening_hours', 'Po - Pá: 8:00 - 18:00'),
('meta_title', 'Dental Care Prague | Moderní stomatologie'),
('meta_description', 'Premium dental care in Prague. Professional dentists, implants, whitening.'),
('google_maps_url', 'https://maps.google.com/?q=50.0755,14.4378'),
('enable_chat', 'true');