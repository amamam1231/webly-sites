export const AdminConfig = {
  siteName: "Dota 2 Landing",
  accentColor: "#dc2626",

  editableFields: [
    {
      key: "show_heroes",
      label: "Показывать блок Герои",
      type: "boolean",
      default: true
    },
    {
      key: "show_tournaments",
      label: "Показывать блок Турниры",
      type: "boolean",
      default: true
    },
    {
      key: "show_gameplay",
      label: "Показывать блок Геймплей",
      type: "boolean",
      default: true
    },
    {
      key: "show_newbie_guide",
      label: "Показывать блок Гайд для новичков",
      type: "boolean",
      default: true
    }
  ],

  features: {
    analytics: true,
    inbox: true,
    leads: true
  }
};