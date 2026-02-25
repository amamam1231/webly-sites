export const AdminConfig = {
  siteName: "Prague Dental Care",
  accentColor: "blue",
  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "clinic_name", label: "Clinic Name", type: "text" },
    { key: "hero_title", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
    { key: "phone_number", label: "Phone Number", type: "text" },
    { key: "email", label: "Email Address", type: "email" },
    { key: "address", label: "Clinic Address", type: "text" },
    { key: "booking_enabled", label: "Enable Online Booking", type: "boolean" },
    { key: "emergency_24h", label: "24/7 Emergency Available", type: "boolean" }
  ],
  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};