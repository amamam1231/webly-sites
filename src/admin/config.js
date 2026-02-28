export const AdminConfig = {
  siteName: "Minimal Landing",
  accentColor: "#3b82f6",

  editableFields: [
    {
      key: "show_features",
      label: "Show Features Section",
      type: "boolean",
      default: true
    },
    {
      key: "show_footer",
      label: "Show Footer Section",
      type: "boolean",
      default: true
    },
    {
      key: "cta_link",
      label: "CTA Button Link",
      type: "text",
      default: "#features"
    },
    {
      key: "contact_email",
      label: "Contact Email",
      type: "text",
      default: "hello@example.com"
    }
  ],

  features: {
    analytics: false,
    inbox: true
  }
};