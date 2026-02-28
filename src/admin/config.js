export const AdminConfig = {
  siteName: "Minimal Landing",
  accentColor: "indigo",
  editableFields: [
    {
      key: "show_hero",
      label: "Show Hero Section",
      type: "boolean"
    },
    {
      key: "show_features",
      label: "Show Features Section",
      type: "boolean"
    },
    {
      key: "show_contact",
      label: "Show Contact Section",
      type: "boolean"
    },
    {
      key: "cta_link",
      label: "Primary CTA Button Link",
      type: "text"
    }
  ],
  features: {
    analytics: true,
    inbox: false
  }
};