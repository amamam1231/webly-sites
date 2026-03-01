export const AdminConfig = {
  siteName: "Landing Consultation",
  accentColor: "blue",
  editableFields: [
    {
      key: "show_features",
      label: "Показывать блок преимуществ",
      type: "boolean"
    },
    {
      key: "show_testimonials",
      label: "Показывать блок отзывов",
      type: "boolean"
    }
  ],
  features: {
    analytics: true,
    inbox: true,
    aiChat: false
  }
};