export const AdminConfig = {
  siteName: "Minimal Landing",
  accentColor: "#3b82f6",

  editableFields: [
    {
      key: "show_features",
      label: "Показывать секцию преимуществ",
      type: "boolean",
      default: true
    },
    {
      key: "show_contact_form",
      label: "Показывать форму контактов",
      type: "boolean",
      default: true
    },
    {
      key: "cta_link",
      label: "Ссылка кнопки CTA",
      type: "text",
      default: "#features"
    },
    {
      key: "telegram_link",
      label: "Ссылка Telegram",
      type: "text",
      default: "https://t.me/username"
    },
    {
      key: "email_link",
      label: "Email для связи",
      type: "text",
      default: "hello@example.com"
    }
  ],

  features: {
    analytics: false,
    inbox: true,
    leads: true
  }
};