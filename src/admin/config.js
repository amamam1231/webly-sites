export const AdminConfig = {
  siteName: "NexoBank",
  accentColor: "#3b82f6",

  editableFields: [
    { key: "telegram_chat_id", label: "Telegram Chat ID для лидов", type: "text" },
    { key: "hero_title", label: "Заголовок Hero", type: "text" },
    { key: "hero_subtitle", label: "Подзаголовок Hero", type: "textarea" },
    { key: "hero_cta_text", label: "Текст кнопки CTA", type: "text" },
    { key: "contact_email", label: "Email для связи", type: "email" },
    { key: "phone_number", label: "Телефон поддержки", type: "text" },
    { key: "show_features", label: "Показать секцию Features", type: "boolean" },
    { key: "show_pricing", label: "Показать секцию Pricing", type: "boolean" },
    { key: "show_testimonials", label: "Показать секцию Отзывы", type: "boolean" },
    { key: "show_faq", label: "Показать секцию FAQ", type: "boolean" },
    { key: "show_security", label: "Показать секцию Безопасность", type: "boolean" }
  ],

  collections: [
    {
      name: "features",
      label: "Функции",
      fields: [
        { key: "title", label: "Название", type: "text" },
        { key: "description", label: "Описание", type: "textarea" },
        { key: "icon", label: "Иконка (Lucide)", type: "text" }
      ]
    },
    {
      name: "pricing_tiers",
      label: "Тарифы",
      fields: [
        { key: "name", label: "Название тарифа", type: "text" },
        { key: "price", label: "Цена", type: "text" },
        { key: "period", label: "Период", type: "text" },
        { key: "description", label: "Описание", type: "textarea" },
        { key: "features", label: "Функции (через запятую)", type: "textarea" },
        { key: "popular", label: "Популярный", type: "boolean" }
      ]
    },
    {
      name: "testimonials",
      label: "Отзывы",
      fields: [
        { key: "name", label: "Имя", type: "text" },
        { key: "role", label: "Должность", type: "text" },
        { key: "content", label: "Текст отзыва", type: "textarea" },
        { key: "avatar", label: "URL аватара", type: "text" }
      ]
    },
    {
      name: "faq_items",
      label: "FAQ",
      fields: [
        { key: "question", label: "Вопрос", type: "text" },
        { key: "answer", label: "Ответ", type: "textarea" }
      ]
    }
  ],

  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
};