export const AdminConfig = {
  siteName: "NexoBank",
  accentColor: "#06b6d4",

  editableFields: [
    {
      key: "show_features",
      label: "Show Features Section",
      type: "boolean",
      default: true
    },
    {
      key: "show_security",
      label: "Show Security Section",
      type: "boolean",
      default: true
    },
    {
      key: "show_testimonials",
      label: "Show Testimonials Section",
      type: "boolean",
      default: true
    },
    {
      key: "show_stats",
      label: "Show Stats Section",
      type: "boolean",
      default: true
    },
    {
      key: "cta_primary_link",
      label: "Primary CTA Button Link",
      type: "text",
      default: "#contact"
    },
    {
      key: "cta_secondary_link",
      label: "Secondary CTA Button Link",
      type: "text",
      default: "#features"
    },
    {
      key: "app_store_link",
      label: "App Store Download Link",
      type: "text",
      default: "#"
    },
    {
      key: "google_play_link",
      label: "Google Play Download Link",
      type: "text",
      default: "#"
    }
  ],

  features: {
    analytics: true,
    inbox: true,
    leads: true
  }
};