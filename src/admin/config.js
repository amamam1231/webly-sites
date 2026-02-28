export const AdminConfig = {
  siteName: "Контактный лендинг",
  accentColor: "#3b82f6",

  editableFields: [
    {
      key: "show_hero",
      label: "Показывать блок Hero",
      type: "boolean"
    },
    {
      key: "show_contact_form",
      label: "Показывать контактную форму",
      type: "boolean"
    },
    {
      key: "cta_button_link",
      label: "Ссылка кнопки CTA",
      type: "text"
    },
    {
      key: "form_submit_endpoint",
      label: "Endpoint для отправки формы",
      type: "text"
    }
  ],

  features: {
    analytics: false,
    inbox: true
  }
};