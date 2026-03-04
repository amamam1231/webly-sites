export const AdminConfig = {
  siteName: "Cycling Coach Pro",
  accentColor: "#06b6d4",

  editableFields: [
    {
      key: "show_hero",
      label: "Показывать блок Hero",
      type: "boolean",
      default: true
    },
    {
      key: "show_about",
      label: "Показывать блок О тренере",
      type: "boolean",
      default: true
    },
    {
      key: "show_benefits",
      label: "Показывать блок Преимущества",
      type: "boolean",
      default: true
    },
    {
      key: "show_packages",
      label: "Показывать блок Пакеты поддержки",
      type: "boolean",
      default: true
    },
    {
      key: "show_reviews",
      label: "Показывать блок Отзывы",
      type: "boolean",
      default: true
    },
    {
      key: "show_form",
      label: "Показывать блок Форма заявки",
      type: "boolean",
      default: true
    }
  ],

  features: {
    analytics: true,
    inbox: true
  }
}