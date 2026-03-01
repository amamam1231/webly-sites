export const AdminConfig = {
  siteName: "Landing Page",
  accentColor: "#3b82f6",
  editableFields: [
    {
      key: "show_hero",
      label: "Показывать секцию Hero",
      type: "boolean",
      default: true
    },
    {
      key: "show_form",
      label: "Показывать форму",
      type: "boolean",
      default: true
    }
  ],
  features: {
    analytics: true,
    inbox: true
  }
};