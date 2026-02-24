// Admin Panel Configuration for Sergio Musel Barbershop
export const AdminConfig = {
  siteName: "Sergio Musel Barbershop",
  accentColor: "#d97706", // amber-600

  editableFields: [
    // Hero Section
    { key: "hero_title", label: "Заголовок Hero", type: "text", default: "Sergio Musel" },
    { key: "hero_subtitle", label: "Подзаголовок Hero", type: "text", default: "Классические стрижки и бритьё опасной бритвой в атмосфере винтажного джаза и лучшего виски" },
    { key: "hero_cta_primary", label: "Текст кнопки Записаться", type: "text", default: "Записаться онлайн" },
    { key: "hero_cta_secondary", label: "Текст кнопки Позвонить", type: "text", default: "Позвонить" },

    // Contact Info
    { key: "phone", label: "Телефон", type: "text", default: "+7 (999) 123-45-67" },
    { key: "address", label: "Адрес", type: "text", default: "г. Москва, ул. Барберская, д. 42" },
    { key: "work_hours", label: "Часы работы", type: "text", default: "Ежедневно: 10:00 — 22:00" },
    { key: "instagram", label: "Instagram", type: "text", default: "@sergio_musel" },
    { key: "telegram", label: "Telegram", type: "text", default: "@sergio_musel_bot" },

    // Services Prices
    { key: "price_haircut", label: "Цена: Мужская стрижка", type: "text", default: "1500₽" },
    { key: "price_beard", label: "Цена: Стрижка бороды", type: "text", default: "800₽" },
    { key: "price_shave", label: "Цена: Королевское бритьё", type: "text", default: "1200₽" },
    { key: "price_complex", label: "Цена: Комплекс", type: "text", default: "2500₽" },

    // About Section
    { key: "about_title", label: "Заголовок О мастере", type: "text", default: "Sergio Musel" },
    { key: "about_text", label: "Текст О мастере", type: "text", default: "Более 10 лет я посвятил искусству барберинга..." },

    // Features
    { key: "enable_chat", label: "Включить чат-виджет", type: "boolean", default: true },
    { key: "enable_booking", label: "Включить онлайн-запись", type: "boolean", default: true },
    { key: "enable_reviews", label: "Показывать отзывы", type: "boolean", default: true }
  ],

  features: {
    analytics: true,
    inbox: true,
    blog: false,
    leads: true
  },

  navigation: [
    { label: "Главная", href: "#hero" },
    { label: "Услуги", href: "#services" },
    { label: "Галерея", href: "#gallery" },
    { label: "О мастере", href: "#about" },
    { label: "Отзывы", href: "#reviews" },
    { label: "Контакты", href: "#contacts" }
  ]
}