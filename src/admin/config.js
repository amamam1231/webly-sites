export const AdminConfig = {
  siteName: "Minimalist Landing",
  accentColor: "#6366f1",
  editableFields: [
    {
      key: "show_header",
      label: "Show Header Section",
      type: "boolean"
    },
    {
      key: "show_hero",
      label: "Show Hero Section",
      type: "boolean"
    },
    {
      key: "show_footer",
      label: "Show Footer Section",
      type: "boolean"
    },
    {
      key: "cta_link",
      label: "CTA Button Link",
      type: "text"
    }
  ],
  features: {
    analytics: false,
    inbox: false
  }
};