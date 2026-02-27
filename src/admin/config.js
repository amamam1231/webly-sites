export const AdminConfig = {
  siteName: "Cafe Lounge",
  accentColor: "#f97316",
  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "show_about", label: "Показать блок 'О нас'", type: "boolean" },
    { key: "show_menu", label: "Показать блок 'Меню'", type: "boolean" },
    { key: "show_contacts", label: "Показать блок 'Контакты'", type: "boolean" },
    { key: "hero_title", label: "Заголовок главной секции", type: "text" },
    { key: "hero_subtitle", label: "Подзаголовок главной секции", type: "text" },
    { key: "about_title", label: "Заголовок 'О нас'", type: "text" },
    { key: "about_text", label: "Текст 'О нас'", type: "text" },
    { key: "menu_title", label: "Заголовок меню", type: "text" },
    { key: "contact_phone", label: "Телефон", type: "text" },
    { key: "contact_address", label: "Адрес", type: "text" },
    { key: "contact_email", label: "Email", type: "email" }
  ],
  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};