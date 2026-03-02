// === IMPORTS ===
import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(...inputs))
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Admin states
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminTab, setAdminTab] = useState('settings')
  const [leads, setLeads] = useState([])
  const [isLoadingLeads, setIsLoadingLeads] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [localSettings, setLocalSettings] = useState({})

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setLocalSettings(data)
      })
      .catch(console.error)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (err) {
      setSubmitStatus('error')
    }
    setIsSubmitting(false)
    setTimeout(() => setSubmitStatus(null), 3000)
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      })
      if (res.ok) {
        setIsAdmin(true)
        setAdminError('')
        fetchLeads()
      } else {
        setAdminError('Неверный пароль')
      }
    } catch (err) {
      setAdminError('Ошибка авторизации')
    }
  }

  const fetchLeads = async () => {
    setIsLoadingLeads(true)
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { 'Authorization': `Bearer ${adminPassword}` }
      })
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch (err) {
      console.error('Failed to fetch leads')
    }
    setIsLoadingLeads(false)
  }

  const saveSettings = async () => {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify(localSettings)
      })
      if (res.ok) {
        setSettings(localSettings)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(null), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch (err) {
      setSaveStatus('error')
    }
  }

  // Admin Panel
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900">
        <div className="container mx-auto max-w-6xl p-4 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <SafeIcon name="settings" size={24} className="text-emerald-600" />
              Админ-панель
            </h1>
            <button
              onClick={() => setIsAdmin(false)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors text-sm font-medium"
            >
              Выйти
            </button>
          </div>

          <div className="flex gap-2 mb-6 border-b border-stone-200">
            <button
              onClick={() => setAdminTab('settings')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                adminTab === 'settings'
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              )}
            >
              Настройки
            </button>
            <button
              onClick={() => setAdminTab('leads')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                adminTab === 'leads'
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              )}
            >
              Заявки
            </button>
          </div>

          {adminTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200"
            >
              <h2 className="text-lg font-semibold mb-6">Настройки сайта</h2>
              <div className="space-y-4 mb-6">
                <label className="flex items-center justify-between p-4 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors">
                  <span className="font-medium">Показывать блок Особенности</span>
                  <input
                    type="checkbox"
                    checked={localSettings.show_features !== false}
                    onChange={(e) => setLocalSettings({...localSettings, show_features: e.target.checked})}
                    className="w-5 h-5 accent-emerald-600"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors">
                  <span className="font-medium">Показывать блок Контакты</span>
                  <input
                    type="checkbox"
                    checked={localSettings.show_contact !== false}
                    onChange={(e) => setLocalSettings({...localSettings, show_contact: e.target.checked})}
                    className="w-5 h-5 accent-emerald-600"
                  />
                </label>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={saveSettings}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                >
                  Сохранить
                </button>
                {saveStatus === 'saving' && <span className="text-stone-500 text-sm">Сохранение...</span>}
                {saveStatus === 'saved' && <span className="text-emerald-600 text-sm flex items-center gap-1"><SafeIcon name="check" size={16} /> Сохранено</span>}
                {saveStatus === 'error' && <span className="text-red-600 text-sm">Ошибка</span>}
              </div>
            </motion.div>
          )}

          {adminTab === 'leads' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden"
            >
              <div className="p-6 border-b border-stone-200">
                <h2 className="text-lg font-semibold">Заявки с формы</h2>
              </div>
              {isLoadingLeads ? (
                <div className="p-8 text-center text-stone-500">Загрузка...</div>
              ) : leads.length === 0 ? (
                <div className="p-8 text-center text-stone-500">Пока нет заявок</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-stone-50">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-stone-700">Имя</th>
                        <th className="text-left p-4 text-sm font-semibold text-stone-700">Email</th>
                        <th className="text-left p-4 text-sm font-semibold text-stone-700">Сообщение</th>
                        <th className="text-left p-4 text-sm font-semibold text-stone-700">Дата</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-stone-50">
                          <td className="p-4 text-sm">{lead.name}</td>
                          <td className="p-4 text-sm">{lead.email}</td>
                          <td className="p-4 text-sm max-w-xs truncate">{lead.message}</td>
                          <td className="p-4 text-sm text-stone-500">
                            {new Date(lead.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  // Admin Login Modal
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="#" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="layers" size={18} className="text-white" />
              </div>
              <span className="text-stone-900">Layer</span>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#hero" className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium">Главная</a>
              <a href="#features" className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium">Особенности</a>
              <a href="#contact" className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium">Контакты</a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAdminLogin(true)}
                className="hidden md:flex p-2 text-stone-400 hover:text-stone-600 transition-colors"
                title="Вход для администратора"
              >
                <SafeIcon name="lock" size={18} />
              </button>
              <a
                href="#contact"
                className="hidden md:inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              >
                Связаться
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-stone-600"
              >
                <SafeIcon name={mobileMenuOpen ? "x" : "menu"} size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-stone-50 border-b border-stone-200 overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-4">
                <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium">Главная</a>
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium">Особенности</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium">Контакты</a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setShowAdminLogin(true)
                  }}
                  className="text-left text-stone-400 hover:text-stone-600 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <SafeIcon name="lock" size={14} />
                  Вход для администратора
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAdminLogin(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <SafeIcon name="shield" size={20} className="text-emerald-600" />
                  Вход в админ-панель
                </h3>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <SafeIcon name="x" size={20} />
                </button>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Пароль</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="Введите пароль"
                  />
                </div>
                {adminError && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <SafeIcon name="alertCircle" size={14} />
                    {adminError}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                >
                  Войти
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
                <SafeIcon name="sparkles" size={16} />
                <span>Новый дизайн 2024</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Создаем цифровое
                <span className="block text-emerald-700">будущее</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-lg leading-relaxed">
                Минималистичный подход к созданию продуктов. Чистый дизайн,
                интуитивная навигация и безупречный пользовательский опыт.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-emerald-700/25"
                >
                  Начать проект
                  <SafeIcon name="arrowRight" size={20} />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-stone-900 px-8 py-4 rounded-full font-semibold transition-all border border-stone-300"
                >
                  Узнать больше
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200 to-amber-200 rounded-3xl blur-3xl opacity-30" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-stone-200/50 border border-stone-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-stone-100 rounded-2xl p-6 aspect-square flex items-center justify-center">
                      <SafeIcon name="palette" size={48} className="text-emerald-600" />
                    </div>
                    <div className="bg-emerald-50 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center">
                      <SafeIcon name="code" size={40} className="text-emerald-700" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="bg-amber-50 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center">
                      <SafeIcon name="rocket" size={40} className="text-amber-600" />
                    </div>
                    <div className="bg-stone-900 rounded-2xl p-6 aspect-square flex items-center justify-center">
                      <SafeIcon name="checkCircle" size={48} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {settings.show_features !== false && (
        <section id="features" className="py-20 md:py-32 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 md:mb-20"
            >
              <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-4 block">Преимущества</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Почему выбирают нас</h2>
              <p className="text-stone-600 text-lg max-w-2xl mx-auto">
                Три ключевых принципа, которыми мы руководствуемся в работе над каждым проектом
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'zap', title: 'Скорость', desc: 'Быстрая разработка и оптимизированная загрузка сайта без компромиссов в качестве.', color: 'amber' },
                { icon: 'shield', title: 'Надежность', desc: 'Современные технологии и лучшие практики безопасности для стабильной работы.', color: 'emerald' },
                { icon: 'sparkles', title: 'Эстетика', desc: 'Продуманный дизайн, который подчеркивает уникальность вашего бренда.', color: 'blue' }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group p-8 rounded-3xl bg-stone-50 hover:bg-white border border-stone-200 hover:border-emerald-200 transition-all hover:shadow-xl hover:shadow-stone-200/50"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                    feature.color === 'amber' && "bg-amber-100 group-hover:bg-amber-200",
                    feature.color === 'emerald' && "bg-emerald-100 group-hover:bg-emerald-200",
                    feature.color === 'blue' && "bg-blue-100 group-hover:bg-blue-200"
                  )}>
                    <SafeIcon
                      name={feature.icon}
                      size={28}
                      className={cn(
                        feature.color === 'amber' && "text-amber-700",
                        feature.color === 'emerald' && "text-emerald-700",
                        feature.color === 'blue' && "text-blue-700"
                      )}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-stone-900">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {settings.show_contact !== false && (
        <section id="contact" className="py-20 md:py-32 px-4 bg-stone-100">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-4 block">Контакты</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Давайте работать вместе</h2>
                <p className="text-stone-600 text-lg mb-8 leading-relaxed">
                  Готовы начать новый проект? Заполните форму, и мы свяжемся с вами в ближайшее время для обсуждения деталей.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <SafeIcon name="mail" size={24} className="text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-500 mb-0.5">Email</p>
                      <p className="font-semibold text-stone-900">hello@layer.studio</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <SafeIcon name="mapPin" size={24} className="text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-500 mb-0.5">Адрес</p>
                      <p className="font-semibold text-stone-900">Москва, Россия</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl shadow-stone-200/50 border border-stone-200">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">Ваше имя</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-stone-50 focus:bg-white"
                        placeholder="Иван Иванов"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-stone-50 focus:bg-white"
                        placeholder="ivan@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">Сообщение</label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-stone-50 focus:bg-white resize-none"
                        placeholder="Расскажите о вашем проекте..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-400 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <SafeIcon name="loader" size={20} className="animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        <>
                          Отправить сообщение
                          <SafeIcon name="send" size={20} />
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {submitStatus && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={cn(
                            "p-4 rounded-xl text-center text-sm font-medium",
                            submitStatus === 'success' ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                          )}
                        >
                          {submitStatus === 'success' ? 'Сообщение отправлено!' : 'Ошибка отправки. Попробуйте позже.'}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 bg-stone-900 text-stone-400">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-bold text-xl text-white">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="layers" size={18} className="text-white" />
              </div>
              <span>Layer</span>
            </div>
            <p className="text-sm">© 2024 Layer Studio. Все права защищены.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">
                <SafeIcon name="twitter" size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <SafeIcon name="instagram" size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <SafeIcon name="linkedin" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App