export const AdminConfig = {
  siteName: "Dental Care Prague",
  accentColor: "#0ea5e9",

  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "clinic_name", label: "Clinic Name", type: "text" },
    { key: "hero_title", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
    { key: "clinic_phone", label: "Phone Number", type: "text" },
    { key: "clinic_email", label: "Email Address", type: "email" },
    { key: "clinic_address", label: "Address", type: "text" },
    { key: "whatsapp_number", label: "WhatsApp Number", type: "text" },
    { key: "opening_hours", label: "Opening Hours", type: "text" },
    { key: "meta_title", label: "SEO Title", type: "text" },
    { key: "meta_description", label: "SEO Description", type: "text" },
    { key: "google_maps_url", label: "Google Maps URL", type: "text" },
    { key: "enable_chat", label: "Enable Chat Widget", type: "boolean" }
  ],

  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
}