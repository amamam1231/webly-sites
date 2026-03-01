export const AdminConfig = {
  siteName: "Landing Page",
  accentColor: "#3b82f6",

  editableFields: [
    {
      key: "show_hero",
      label: "Показывать блок Hero",
      type: "boolean",
      default: true
    },
    {
      key: "show_form",
      label: "Показывать блок с формой",
      type: "boolean",
      default: true
    },
    {
      key: "show_footer",
      label: "Показывать футер",
      type: "boolean",
      default: true
    }
  ],

  features: {
    analytics: true,
    inbox: true
  }
};