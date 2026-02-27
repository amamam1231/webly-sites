export const AdminConfig = {
  siteName: "FinTech Pro",
  accentColor: "#3b82f6",

  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "hero_title", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
    { key: "hero_cta", label: "Hero CTA Button Text", type: "text" },
    { key: "contact_phone", label: "Contact Phone", type: "text" },
    { key: "contact_email", label: "Contact Email", type: "email" },
    { key: "show_features", label: "Show Features Section", type: "boolean" },
    { key: "show_calculator", label: "Show Calculator Section", type: "boolean" },
    { key: "show_tariffs", label: "Show Tariffs Section", type: "boolean" },
    { key: "show_testimonials", label: "Show Testimonials Section", type: "boolean" },
    { key: "tariff_basic_price", label: "Basic Tariff Price", type: "text" },
    { key: "tariff_pro_price", label: "Pro Tariff Price", type: "text" },
    { key: "tariff_enterprise_price", label: "Enterprise Tariff Price", type: "text" }
  ],

  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
}