export const AdminConfig = {
  siteName: "Dental Care Prague",
  accentColor: "#0ea5e9",

  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID for Leads", type: "text" },
    { key: "clinic_name", label: "Название клиники", type: "text" },
    { key: "hero_title", label: "Заголовок главного экрана", type: "text" },
    { key: "hero_subtitle", label: "Подзаголовок главного экрана", type: "text" },
    { key: "contact_phone", label: "Телефон", type: "text" },
    { key: "contact_email", label: "Email", type: "email" },
    { key: "contact_address", label: "Адрес", type: "text" },
    { key: "working_hours_weekdays", label: "Часы работы (пн-пт)", type: "text" },
    { key: "working_hours_saturday", label: "Часы работы (сб)", type: "text" },
    { key: "working_hours_sunday", label: "Часы работы (вс)", type: "text" },
    { key: "service_1_title", label: "Услуга 1 - Название", type: "text" },
    { key: "service_1_desc", label: "Услуга 1 - Описание", type: "text" },
    { key: "service_2_title", label: "Услуга 2 - Название", type: "text" },
    { key: "service_2_desc", label: "Услуга 2 - Описание", type: "text" },
    { key: "service_3_title", label: "Услуга 3 - Название", type: "text" },
    { key: "service_3_desc", label: "Услуга 3 - Описание", type: "text" },
    { key: "service_4_title", label: "Услуга 4 - Название", type: "text" },
    { key: "service_4_desc", label: "Услуга 4 - Описание", type: "text" },
    { key: "service_5_title", label: "Услуга 5 - Название", type: "text" },
    { key: "service_5_desc", label: "Услуга 5 - Описание", type: "text" },
    { key: "service_6_title", label: "Услуга 6 - Название", type: "text" },
    { key: "service_6_desc", label: "Услуга 6 - Описание", type: "text" }
  ],

  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};