export const AdminConfig = {
  siteName: "Minimal Landing",
  accentColor: "#3b82f6",

  editableFields: [
    {
      key: "show_hero",
      label: "Показывать блок Hero",
      type: "boolean"
    },
    {
      key: "show_contact",
      label: "Показывать контактную форму",
      type: "boolean"
    },
    {
      key: "cta_link",
      label: "Ссылка кнопки CTA",
      type: "text"
    },
    {
      key: "form_submit_link",
      label: "Ссылка для отправки формы",
      type: "text"
    }
  ],

  features: {
    analytics: true,
    inbox: true
  }
};