export const AdminConfig = {
  siteName: "Лендинг",
  accentColor: "#3b82f6",

  editableFields: [
    {
      key: "show_hero",
      label: "Показывать блок Hero",
      type: "boolean"
    },
    {
      key: "show_features",
      label: "Показывать блок Features",
      type: "boolean"
    },
    {
      key: "cta_link",
      label: "Ссылка CTA кнопки",
      type: "text"
    },
    {
      key: "contact_email",
      label: "Email для контактов",
      type: "text"
    }
  ],

  features: {
    analytics: false,
    inbox: true
  }
};