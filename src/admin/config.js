export const AdminConfig = {
  siteName: "Кафе Уют",
  accentColor: "#f59e0b",
  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID для заявок", type: "text" },
    { key: "show_hero", label: "Показывать блок Hero", type: "boolean" },
    { key: "show_menu", label: "Показывать блок Меню", type: "boolean" },
    { key: "show_contacts", label: "Показывать блок Контакты", type: "boolean" },
    { key: "hero_title", label: "Заголовок Hero", type: "text" },
    { key: "hero_subtitle", label: "Подзаголовок Hero", type: "text" },
    { key: "cafe_name", label: "Название кафе", type: "text" },
    { key: "contact_phone", label: "Телефон", type: "text" },
    { key: "contact_address", label: "Адрес", type: "text" },
    { key: "contact_email", label: "Email", type: "email" },
    { key: "working_hours", label: "Часы работы", type: "text" }
  ],
  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};