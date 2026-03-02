export const AdminConfig = {
  siteName: "Layer Studio",
  accentColor: "#059669",

  editableFields: [
    {
      key: "show_features",
      label: "Показывать блок Особенности",
      type: "boolean",
      default: true
    },
    {
      key: "show_contact",
      label: "Показывать блок Контакты",
      type: "boolean",
      default: true
    }
  ],

  features: {
    analytics: true,
    inbox: true
  }
};