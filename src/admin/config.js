export const AdminConfig = {
  siteName: 'Short Landing',
  accentColor: '#3b82f6',
  editableFields: [
    { key: 'telegram_chat_id', label: 'Telegram Chat ID для заявок', type: 'text' },
    { key: 'hero_title', label: 'Заголовок Hero', type: 'text' },
    { key: 'hero_subtitle', label: 'Подзаголовок Hero', type: 'text' },
    { key: 'cta_button_text', label: 'Текст кнопки CTA', type: 'text' },
    { key: 'contact_email', label: 'Email для связи', type: 'email' },
    { key: 'show_social_links', label: 'Показывать социальные ссылки', type: 'boolean' }
  ],
  features: {
    analytics: true,
    inbox: true,
    blog: false
  }
}