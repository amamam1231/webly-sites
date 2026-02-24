export const AdminConfig = {
  siteName: "Prague Dental Clinic",
  accentColor: "blue",
  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "hero_title", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
    { key: "phone_number", label: "Phone Number", type: "text" },
    { key: "email", label: "Contact Email", type: "email" },
    { key: "address", label: "Clinic Address", type: "text" },
    { key: "working_hours", label: "Working Hours", type: "text" },
    { key: "primary_color", label: "Primary Color", type: "text" },
    { key: "show_callback_timer", label: "Show Callback Timer", type: "boolean" },
    { key: "cta_text", label: "CTA Button Text", type: "text" }
  ],
  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};