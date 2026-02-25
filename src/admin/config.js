export const AdminConfig = {
  siteName: "Бистро Чебурек",
  accentColor: "#f59e0b",
  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "hero_title", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
    { key: "phone_number", label: "Phone Number", type: "text" },
    { key: "delivery_email", label: "Delivery Email", type: "email" },
    { key: "address", label: "Restaurant Address", type: "text" },
    { key: "working_hours", label: "Working Hours", type: "text" },
    { key: "min_order_amount", label: "Minimum Order Amount (CZK)", type: "text" },
    { key: "delivery_fee", label: "Delivery Fee (CZK)", type: "text" },
    { key: "enable_online_payment", label: "Enable Online Payment", type: "boolean" }
  ],
  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};