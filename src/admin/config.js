export const AdminConfig = {
  siteName: 'NeoBank',
  accentColor: '#3b82f6',
  editableFields: [
    {
      key: 'show_features',
      label: 'Показывать секцию функций',
      type: 'boolean'
    },
    {
      key: 'show_crypto',
      label: 'Показывать секцию криптовалют',
      type: 'boolean'
    },
    {
      key: 'show_analytics',
      label: 'Показывать секцию аналитики',
      type: 'boolean'
    },
    {
      key: 'cta_link',
      label: 'Ссылка главной кнопки CTA',
      type: 'text'
    },
    {
      key: 'app_store_link',
      label: 'Ссылка App Store',
      type: 'text'
    },
    {
      key: 'google_play_link',
      label: 'Ссылка Google Play',
      type: 'text'
    }
  ],
  features: {
    analytics: true,
    inbox: true
  }
}