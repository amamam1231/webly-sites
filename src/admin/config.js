export const AdminConfig = {
  siteName: "Простой Сайт",
  accentColor: "#3b82f6",

  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "hero_title", label: "Заголовок на главной", type: "text" },
    { key: "hero_subtitle", label: "Подзаголовок на главной", type: "text" },
    { key: "about_text", label: "Текст раздела О нас", type: "text" },
    { key: "contact_email", label: "Email для связи", type: "email" },
    { key: "phone_number", label: "Номер телефона", type: "text" },
    { key: "show_contact_form", label: "Показывать форму контактов", type: "boolean" }
  ],

  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};