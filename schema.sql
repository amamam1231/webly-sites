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
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'new'
);

-- Insert default values
INSERT OR REPLACE INTO site_settings (key, value) VALUES
  ('telegram_chat_id', ''),
  ('hero_title_cs', 'Váš úsměv v nejlepších rukou'),
  ('hero_title_en', 'Your Smile in the Best Hands'),
  ('hero_subtitle_cs', 'Moderní zubní ordinace v centru Prahy s evropskými standardy péče'),
  ('hero_subtitle_en', 'Modern dental clinic in the center of Prague with European standards of care'),
  ('contact_phone', '+420 123 456 789'),
  ('contact_email', 'info@dentalcare.cz'),
  ('contact_address_cs', 'Václavské náměstí 123, Praha 1'),
  ('contact_address_en', 'Wenceslas Square 123, Prague 1'),
  ('opening_hours_cs', 'Po-Pá: 8:00 - 20:00, So: 9:00 - 14:00'),
  ('opening_hours_en', 'Mon-Fri: 8:00 - 20:00, Sat: 9:00 - 14:00'),
  ('free_consultation_enabled', 'true'),
  ('google_maps_lat', '50.0806'),
  ('google_maps_lng', '14.4241');