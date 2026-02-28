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
      key: "show_features",
      label: "Показывать блок Features",
      type: "boolean"
    },
    {
      key: "show_contact",
      label: "Показывать блок Contact",
      type: "boolean"
    },
    {
      key: "cta_link",
      label: "Ссылка кнопки CTA",
      type: "text"
    },
    {
      key: "contact_email",
      label: "Email для связи",
      type: "text"
    }
  ],

  features: {
    analytics: false,
    inbox: true
  }
}