export const AdminConfig = {
  siteName: "WebDev Agency",
  accentColor: "#64748b",

  editableFields: [
    {
      key: "show_hero",
      label: "Показывать блок Hero",
      type: "boolean",
      default: true
    },
    {
      key: "show_portfolio",
      label: "Показывать блок Портфолио",
      type: "boolean",
      default: true
    },
    {
      key: "show_team",
      label: "Показывать блок Команда",
      type: "boolean",
      default: true
    },
    {
      key: "show_reviews",
      label: "Показывать блок Отзывы",
      type: "boolean",
      default: true
    },
    {
      key: "show_form",
      label: "Показывать блок Форма заказа",
      type: "boolean",
      default: true
    }
  ],

  features: {
    analytics: true,
    inbox: true,
    leads: true
  }
};