export const AdminConfig = {
  siteName: "Кафе Уют",
  accentColor: "#ea580c",

  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID для заявок", type: "text" },
    { key: "hero_title", label: "Заголовок главного экрана", type: "text" },
    { key: "hero_subtitle", label: "Подзаголовок главного экрана", type: "text" },
    { key: "hero_description", label: "Описание главного экрана", type: "text" },
    { key: "show_hero", label: "Показывать главный экран", type: "boolean" },
    { key: "show_menu", label: "Показывать меню", type: "boolean" },
    { key: "show_contacts", label: "Показывать контакты", type: "boolean" },
    { key: "contact_phone", label: "Телефон", type: "text" },
    { key: "contact_address", label: "Адрес", type: "text" },
    { key: "contact_email", label: "Email", type: "email" },
    { key: "booking_button_text", label: "Текст кнопки бронирования", type: "text" },
    { key: "map_embed_url", label: "URL Google Maps для встраивания", type: "text" }
  ],

  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
}