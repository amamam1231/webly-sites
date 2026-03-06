export const AdminConfig = {
  siteName: "Просто Сайт",
  accentColor: "#3b82f6",

  editableFields: [
    {
      key: "show_about",
      label: "Показывать блок О нас",
      type: "boolean"
    },
    {
      key: "show_features",
      label: "Показывать блок Возможности",
      type: "boolean"
    },
    {
      key: "show_contact",
      label: "Показывать блок Контакты",
      type: "boolean"
    }
  ],

  features: {
    analytics: false,
    inbox: true
  }
}