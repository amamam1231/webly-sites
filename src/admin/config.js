export const AdminConfig = {
  siteName: "Минимал",
  accentColor: "#3b82f6",

  editableFields: [
    {
      key: "show_features",
      label: "Показывать блок Features",
      type: "boolean"
    },
    {
      key: "cta_link",
      label: "Ссылка CTA кнопки",
      type: "text"
    }
  ],

  features: {
    analytics: false,
    inbox: false
  }
}