export const AdminConfig = {
  siteName: "DentCare Praha",
  accentColor: "cyan",

  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "clinic_name", label: "Název kliniky", type: "text" },
    { key: "hero_title", label: "Hlavní nadpis", type: "text" },
    { key: "hero_subtitle", label: "Podnadpis", type: "text" },
    { key: "contact_phone", label: "Telefon", type: "text" },
    { key: "contact_email", label: "Email", type: "email" },
    { key: "contact_address", label: "Adresa", type: "text" },
    { key: "working_hours", label: "Otevírací doba", type: "text" },
    { key: "primary_cta", label: "Text hlavního tlačítka", type: "text" },
    { key: "secondary_cta", label: "Text sekundárního tlačítka", type: "text" },
    { key: "booking_enabled", label: "Povolit online rezervaci", type: "boolean" },
    { key: "emergency_phone", label: "Pohotovostní linka", type: "text" }
  ],

  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};