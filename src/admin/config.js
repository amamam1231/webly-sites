export const AdminConfig = {
  siteName: "Nexus DeFi Protocol",
  accentColor: "cyan",

  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "hero_title", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
    { key: "protocol_description", label: "Protocol Description", type: "text" },
    { key: "apy_rate", label: "Current APY Rate (%)", type: "text" },
    { key: "tvl_amount", label: "Total Value Locked", type: "text" },
    { key: "contact_email", label: "Contact Email", type: "email" },
    { key: "enable_calculator", label: "Enable Yield Calculator", type: "boolean" },
    { key: "enable_testimonials", label: "Enable Testimonials", type: "boolean" }
  ],

  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};