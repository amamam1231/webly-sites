export const AdminConfig = {
  siteName: "Minimal Landing",
  accentColor: "#2563eb",

  editableFields: [
    {
      key: "show_hero",
      label: "Показывать блок Hero",
      type: "boolean",
      default: true
    },
    {
      key: "show_features",
      label: "Показывать блок Преимуществ",
      type: "boolean",
      default: true
    },
    {
      key: "show_footer",
      label: "Показывать Футер",
      type: "boolean",
      default: true
    },
    {
      key: "cta_link",
      label: "Ссылка CTA кнопки",
      type: "text",
      default: "#features"
    },
    {
      key: "privacy_link",
      label: "Ссылка Политики конфиденциальности",
      type: "text",
      default: "#"
    },
    {
      key: "terms_link",
      label: "Ссылка Условий использования",
      type: "text",
      default: "#"
    }
  ],

  features: {
    analytics: true,
    inbox: true
  }
}