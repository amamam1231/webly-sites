export const AdminConfig = {
  siteName: "Bistro Čeburek",
  accentColor: "#f59e0b",
  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID pro objednávky", type: "text" },
    { key: "hero_title", label: "Nadpis hlavní stránky", type: "text" },
    { key: "hero_subtitle", label: "Podnadpis hlavní stránky", type: "text" },
    { key: "phone_number", label: "Telefonní číslo", type: "text" },
    { key: "delivery_email", label: "Email pro objednávky", type: "email" },
    { key: "address", label: "Adresa restaurace", type: "text" },
    { key: "working_hours", label: "Otevírací doba", type: "text" },
    { key: "min_order_amount", label: "Minimální částka objednávky (Kč)", type: "text" },
    { key: "delivery_fee", label: "Cena doručení (Kč)", type: "text" },
    { key: "enable_online_payment", label: "Povolit online platbu", type: "boolean" }
  ],
  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};