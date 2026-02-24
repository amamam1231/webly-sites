-- D1 Database Schema for Sergio Musel Barbershop

-- Site settings table for admin panel
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type TEXT DEFAULT 'text',
    label TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Leads/Bookings table
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT,
    date TEXT,
    time TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default site settings
INSERT OR IGNORE INTO site_settings (key, value, type, label) VALUES
('hero_title', 'SERGIO MUSEL', 'text', 'Заголовок на главном экране'),
('hero_subtitle', 'Классические стрижки и опасное бритье в атмосфере настоящего мужского клуба.', 'text', 'Подзаголовок'),
('contact_phone', '+7 (999) 123-45-67', 'text', 'Контактный телефон'),
('contact_address', 'г. Москва, ул. Барберская, 15', 'text', 'Адрес'),
('working_hours_weekdays', '10:00 — 21:00', 'text', 'Часы работы (будни)'),
('working_hours_weekends', '10:00 — 20:00', 'text', 'Часы работы (выходные)'),
('price_haircut', '1 500 ₽', 'text', 'Цена: Мужская стрижка'),
('price_shave', '1 200 ₽', 'text', 'Цена: Опасное бритье'),
('price_complex', '3 500 ₽', 'text', 'Цена: Комплекс'),
('whatsapp_number', '79991234567', 'text', 'WhatsApp номер'),
('show_whatsapp_button', 'true', 'boolean', 'Показывать кнопку WhatsApp');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_settings_key ON site_settings(key);