export const AdminConfig = {
  siteName: "Minimalist Landing",
  accentColor: "#3b82f6",

  editableFields: [
    {
      key: "show_hero_section",
      label: "Show Hero Section",
      type: "boolean",
      default: true
    },
    {
      key: "show_features_section",
      label: "Show Features Section",
      type: "boolean",
      default: true
    },
    {
      key: "show_footer_section",
      label: "Show Footer Section",
      type: "boolean",
      default: true
    },
    {
      key: "primary_cta_link",
      label: "Primary CTA Button Link",
      type: "text",
      default: "#contact"
    },
    {
      key: "secondary_cta_link",
      label: "Secondary CTA Button Link",
      type: "text",
      default: "#features"
    }
  ],

  features: {
    analytics: false,
    inbox: true
  }
};