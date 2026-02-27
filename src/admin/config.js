export const AdminConfig = {
  siteName: "NeoBank RF",
  accentColor: "#06b6d4",

  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "hero_title", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
    { key: "show_features", label: "Show Features Section", type: "boolean" },
    { key: "show_transfers", label: "Show Transfers Section", type: "boolean" },
    { key: "show_currency", label: "Show Currency Section", type: "boolean" },
    { key: "show_credits", label: "Show Credits Section", type: "boolean" },
    { key: "show_payments", label: "Show Payment Systems Section", type: "boolean" },
    { key: "contact_phone", label: "Contact Phone", type: "text" },
    { key: "contact_email", label: "Contact Email", type: "email" },
    { key: "sbp_enabled", label: "SBP Enabled", type: "boolean" },
    { key: "mirpay_enabled", label: "MirPay Enabled", type: "boolean" },
    { key: "applepay_enabled", label: "Apple Pay Enabled", type: "boolean" }
  ],

  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};