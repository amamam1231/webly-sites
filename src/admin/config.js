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
      label: "Показывать блок Особенности",
      type: "boolean"
    },
    {
      key: "show_cta",
      label: "Показывать блок CTA",
      type: "boolean"
    },
    {
      key: "cta_button_link",
      label: "Ссылка кнопки CTA",
      type: "text"
    }
  ],

  features: {
    analytics: false,
    inbox: true
  }
};