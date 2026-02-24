export const AdminConfig = {
  siteName: "Dental Care Prague",
  accentColor: "#0ea5e9",

  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "hero_title_cs", label: "Hero Title (Czech)", type: "text" },
    { key: "hero_title_en", label: "Hero Title (English)", type: "text" },
    { key: "hero_subtitle_cs", label: "Hero Subtitle (Czech)", type: "text" },
    { key: "hero_subtitle_en", label: "Hero Subtitle (English)", type: "text" },
    { key: "contact_phone", label: "Contact Phone", type: "text" },
    { key: "contact_email", label: "Contact Email", type: "email" },
    { key: "contact_address_cs", label: "Address (Czech)", type: "text" },
    { key: "contact_address_en", label: "Address (English)", type: "text" },
    { key: "opening_hours_cs", label: "Opening Hours (Czech)", type: "text" },
    { key: "opening_hours_en", label: "Opening Hours (English)", type: "text" },
    { key: "free_consultation_enabled", label: "Show Free Consultation Badge", type: "boolean" },
    { key: "google_maps_lat", label: "Google Maps Latitude", type: "text" },
    { key: "google_maps_lng", label: "Google Maps Longitude", type: "text" }
  ],

  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
}