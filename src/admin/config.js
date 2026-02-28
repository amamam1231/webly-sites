export const AdminConfig = {
  siteName: "Minimal Landing",
  accentColor: "#3b82f6",

  editableFields: [
    {
      key: "show_hero",
      label: "Показывать блок Hero",
      type: "boolean"
    },
    {
      key: "show_contact",
      label: "Показывать контактную форму",
      type: "boolean"
    },
    {
      key: "cta_button_link",
      label: "Ссылка кнопки CTA",
      type: "text"
    },
    {
      key: "telegram_link",
      label: "Ссылка Telegram",
      type: "text"
    },
    {
      key: "email_link",
      label: "Ссылка Email",
      type: "text"
    }
  ],

  features: {
    analytics: false,
    inbox: true
  }
};