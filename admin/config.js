// Admin Panel Configuration for Sergio Musel Barbershop
export const AdminConfig = {
  siteName: "Sergio Musel Barbershop",
  siteUrl: "https://sergio-musel.pages.dev",
  accentColor: "#f59e0b", // Amber-500
  logo: "/logo.png",

  // Editable content fields
  editableFields: [
    {
      key: "hero_title",
      label: "Заголовок на главном экране",
      type: "text",
      defaultValue: "SERGIO MUSEL"
    },
    {
      key: "hero_subtitle",
      label: "Подзаголовок",
      type: "text",
      defaultValue: "Классические стрижки и опасное бритье в атмосфере настоящего мужского клуба."
    },
    {
      key: "contact_phone",
      label: "Контактный телефон",
      type: "text",
      defaultValue: "+7 (999) 123-45-67"
    },
    {
      key: "contact_address",
      label: "Адрес",
      type: "text",
      defaultValue: "г. Москва, ул. Барберская, 15"
    },
    {
      key: "working_hours_weekdays",
      label: "Часы работы (будни)",
      type: "text",
      defaultValue: "10:00 — 21:00"
    },
    {
      key: "working_hours_weekends",
      label: "Часы работы (выходные)",
      type: "text",
      defaultValue: "10:00 — 20:00"
    },
    {
      key: "price_haircut",
      label: "Цена: Мужская стрижка",
      type: "text",
      defaultValue: "1 500 ₽"
    },
    {
      key: "price_shave",
      label: "Цена: Опасное бритье",
      type: "text",
      defaultValue: "1 200 ₽"
    },
    {
      key: "price_complex",
      label: "Цена: Комплекс",
      type: "text",
      defaultValue: "3 500 ₽"
    },
    {
      key: "whatsapp_number",
      label: "WhatsApp номер (без +)",
      type: "text",
      defaultValue: "79991234567"
    },
    {
      key: "show_whatsapp_button",
      label: "Показывать кнопку WhatsApp",
      type: "boolean",
      defaultValue: true
    }
  ],

  // Feature toggles
  features: {
    analytics: true,
    inbox: true,
    blog: false,
    gallery: true,
    booking: true
  },

  // Navigation
  navigation: [
    { label: "Главная", href: "#" },
    { label: "Услуги", href: "#services" },
    { label: "Цены", href: "#prices" },
    { label: "Галерея", href: "#gallery" },
    { label: "О нас", href: "#about" },
    { label: "Контакты", href: "#contact" }
  ],

  // Database tables needed
  database: {
    tables: ["site_settings", "leads", "bookings"]
  }
};