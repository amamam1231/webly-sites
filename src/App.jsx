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
      .catch(() => {
        const defaults = { show_features: true, show_contact: true }
        setSettings(defaults)
        setLocalSettings(defaults)
      })
  }, [])

  useEffect(() => {
    if (isAdmin && adminTab === 'inbox') {
      loadLeads()
    }
  }, [isAdmin, adminTab])

  const loadLeads = async () => {
    setIsLoadingLeads(true)
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads || [])
      }
    } catch (error) {
      console.error('Failed to load leads')
    }
    setIsLoadingLeads(false)
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    // Simple password protection - in production this should be server-side
    if (adminPassword === 'admin123') {
      setIsAdmin(true)
      setAdminError('')
    } else {
      setAdminError('Неверный пароль')
    }
  }

  const handleSaveSettings = async () => {
    setSaveStatus('saving')
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localSettings)
      })

      if (response.ok) {
        setSettings(localSettings)
        setSaveStatus('success')
        setTimeout(() => setSaveStatus(null), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      setSaveStatus('error')
    }
  }

  const handleDeleteLead = async (id) => {
    try {
      const response = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setLeads(leads.filter(lead => lead.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete lead')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    }

    setIsSubmitting(false)
    setTimeout(() => setSubmitStatus(null), 3000)
  }

  // Admin Panel View
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Admin Header */}
        <header className="bg-slate-900 border-b border-slate-800">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <SafeIcon name="settings" size={20} className="text-white" />
                </div>
                <span className="font-bold text-lg">Админ-панель</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsAdmin(false)}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Navigation */}
        <div className="bg-slate-900/50 border-b border-slate-800">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <nav className="flex gap-6">
              <button
                onClick={() => setAdminTab('settings')}
                className={cn(
                  "py-4 text-sm font-medium border-b-2 transition-colors",
                  adminTab === 'settings'
                    ? "border-purple-500 text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                )}
              >
                <span className="flex items-center gap-2">
                  <SafeIcon name="slidersHorizontal" size={16} />
                  Настройки
                </span>
              </button>
              <button
                onClick={() => setAdminTab('inbox')}
                className={cn(
                  "py-4 text-sm font-medium border-b-2 transition-colors",
                  adminTab === 'inbox'
                    ? "border-purple-500 text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                )}
              >
                <span className="flex items-center gap-2">
                  <SafeIcon name="inbox" size={16} />
                  Заявки
                  {leads.length > 0 && (
                    <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full">
                      {leads.length}
                    </span>
                  )}
                </span>
              </button>
              <button
                onClick={() => setAdminTab('analytics')}
                className={cn(
                  "py-4 text-sm font-medium border-b-2 transition-colors",
                  adminTab === 'analytics'
                    ? "border-purple-500 text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                )}
              >
                <span className="flex items-center gap-2">
                  <SafeIcon name="barChart3" size={16} />
                  Аналитика
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Admin Content */}
        <main className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
          <AnimatePresence mode="wait">
            {adminTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl"
              >
                <h2 className="text-2xl font-bold mb-6">Настройки сайта</h2>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <h3 className="font-semibold mb-1">Блок Особенности</h3>
                      <p className="text-sm text-slate-400">Показывать секцию с преимуществами на главной</p>
                    </div>
                    <button
                      onClick={() => setLocalSettings({...localSettings, show_features: !localSettings.show_features})}
                      className={cn(
                        "w-14 h-8 rounded-full transition-colors relative",
                        localSettings.show_features ? "bg-purple-600" : "bg-slate-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-6 h-6 bg-white rounded-full transition-transform",
                        localSettings.show_features ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <h3 className="font-semibold mb-1">Блок Контакты</h3>
                      <p className="text-sm text-slate-400">Показывать форму обратной связи</p>
                    </div>
                    <button
                      onClick={() => setLocalSettings({...localSettings, show_contact: !localSettings.show_contact})}
                      className={cn(
                        "w-14 h-8 rounded-full transition-colors relative",
                        localSettings.show_contact ? "bg-purple-600" : "bg-slate-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-6 h-6 bg-white rounded-full transition-transform",
                        localSettings.show_contact ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <button
                      onClick={handleSaveSettings}
                      disabled={saveStatus === 'saving'}
                      className={cn(
                        "px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all",
                        saveStatus === 'saving'
                          ? "bg-slate-700 cursor-not-allowed"
                          : saveStatus === 'success'
                            ? "bg-green-600 hover:bg-green-500"
                            : "bg-purple-600 hover:bg-purple-500"
                      )}
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Сохранение...
                        </>
                      ) : saveStatus === 'success' ? (
                        <>
                          <SafeIcon name="check" size={18} />
                          Сохранено!
                        </>
                      ) : (
                        <>
                          <SafeIcon name="save" size={18} />
                          Сохранить изменения
                        </>
                      )}
                    </button>
                    {saveStatus === 'error' && (
                      <p className="text-red-400 text-sm mt-2">Ошибка сохранения</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 p-6 bg-slate-800/30 rounded-2xl border border-slate-800">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <SafeIcon name="eye" size={18} className="text-slate-400" />
                    Предпросмотр
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Особенности:</span>
                      <span className={localSettings.show_features ? "text-green-400" : "text-red-400"}>
                        {localSettings.show_features ? 'Включено' : 'Выключено'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Контакты:</span>
                      <span className={localSettings.show_contact ? "text-green-400" : "text-red-400"}>
                        {localSettings.show_contact ? 'Включено' : 'Выключено'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {adminTab === 'inbox' && (
              <motion.div
                key="inbox"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Входящие заявки</h2>
                  <button
                    onClick={loadLeads}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title="Обновить"
                  >
                    <SafeIcon name="refreshCw" size={20} />
                  </button>
                </div>

                {isLoadingLeads ? (
                  <div className="flex items-center justify-center py-12">
                    <span className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : leads.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800">
                    <SafeIcon name="inbox" size={48} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Нет входящих заявок</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                                <SafeIcon name="user" size={20} className="text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{lead.name}</h3>
                                <p className="text-sm text-slate-400">{lead.email}</p>
                              </div>
                            </div>
                            <p className="text-slate-300 mt-4 pl-13 ml-13 leading-relaxed">
                              {lead.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-4">
                              {new Date(lead.created_at).toLocaleString('ru-RU')}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                            title="Удалить"
                          >
                            <SafeIcon name="trash2" size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {adminTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-2xl font-bold mb-6">Аналитика</h2>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <SafeIcon name="eye" size={20} className="text-blue-400" />
                      </div>
                      <span className="text-slate-400">Просмотры</span>
                    </div>
                    <p className="text-3xl font-bold">1,234</p>
                    <p className="text-sm text-green-400 mt-2">+12% за неделю</p>
                  </div>

                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <SafeIcon name="send" size={20} className="text-purple-400" />
                      </div>
                      <span className="text-slate-400">Заявки</span>
                    </div>
                    <p className="text-3xl font-bold">{leads.length}</p>
                    <p className="text-sm text-slate-500 mt-2">Всего получено</p>
                  </div>

                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <SafeIcon name="percent" size={20} className="text-green-400" />
                      </div>
                      <span className="text-slate-400">Конверсия</span>
                    </div>
                    <p className="text-3xl font-bold">3.2%</p>
                    <p className="text-sm text-green-400 mt-2">+0.5% за неделю</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <h3 className="font-semibold mb-4">Активность по дням</h3>
                  <div className="h-64 flex items-end gap-2">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-purple-600/50 rounded-t-lg hover:bg-purple-600 transition-colors"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-slate-500">
                          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][idx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    )
  }

  // Admin Login Modal
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Admin Access Button (hidden in corner) */}
      <button
        onClick={() => setShowAdminLogin(true)}
        className="fixed bottom-4 right-4 w-10 h-10 bg-slate-800/50 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all z-50 opacity-0 hover:opacity-100 focus:opacity-100"
        title="Админ-панель"
      >
        <SafeIcon name="lock" size={18} />
      </button>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAdminLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <SafeIcon name="shield" size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Админ-панель</h2>
                    <p className="text-sm text-slate-400">Введите пароль для входа</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="text-slate-500 hover:text-white"
                >
                  <SafeIcon name="x" size={24} />
                </button>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Пароль"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-slate-500"
                  />
                </div>
                {adminError && (
                  <p className="text-red-400 text-sm">{adminError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-colors"
                >
                  Войти
                </button>
              </form>

              <p className="text-xs text-slate-600 text-center mt-4">
                Пароль по умолчанию: admin123
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="zap" size={20} className="text-white" />
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#hero" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Главная</a>
              <a href="#features" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Особенности</a>
              <a href="#contact" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Контакты</a>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              <SafeIcon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800"
          >
            <nav className="flex flex-col p-4 gap-4">
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Главная</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Особенности</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Контакты</a>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Простота
              </span>
              <br />
              <span className="text-white">в деталях</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Минималистичный подход к созданию цифровых продуктов.
              Чистый дизайн, интуитивная навигация и безупречный пользовательский опыт.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/25"
              >
                Начать проект
                <SafeIcon name="arrowRight" size={20} />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-semibold transition-all border border-slate-700"
              >
                Узнать больше
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      {settings.show_features !== false && (
        <section id="features" className="py-20 md:py-32 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Почему мы?</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Три ключевых принципа, которыми мы руководствуемся в работе
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'zap', title: 'Скорость', desc: 'Быстрая разработка и оптимизированная загрузка сайта без компромиссов в качестве.' },
                { icon: 'shield', title: 'Надежность', desc: 'Современные технологии и лучшие практики безопасности для стабильной работы.' },
                { icon: 'sparkles', title: 'Эстетика', desc: 'Продуманный дизайн, который подчеркивает уникальность вашего бренда.' }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all hover:scale-105"
                >
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
                    <SafeIcon name={feature.icon} size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact/Footer Section */}
      {settings.show_contact !== false && (
        <section id="contact" className="py-20 md:py-32 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Давайте работать вместе</h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Готовы начать новый проект? Свяжитесь с нами любым удобным способом
                  или заполните форму справа.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                      <SafeIcon name="mail" size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Email</div>
                      <div className="font-medium">hello@example.com</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                      <SafeIcon name="phone" size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Телефон</div>
                      <div className="font-medium">+7 (999) 123-45-67</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                      <SafeIcon name="mapPin" size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Адрес</div>
                      <div className="font-medium">Москва, Россия</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ваше имя</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-500"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-500"
                      placeholder="ivan@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Сообщение</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-500 resize-none"
                      placeholder="Расскажите о вашем проекте..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                      isSubmitting
                        ? "bg-slate-700 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] shadow-lg shadow-blue-600/25"
                    )}
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : submitStatus === 'success' ? (
                      <>
                        <SafeIcon name="check" size={20} />
                        Отправлено!
                      </>
                    ) : (
                      <>
                        Отправить сообщение
                        <SafeIcon name="send" size={20} />
                      </>
                    )}
                  </button>

                  {submitStatus === 'error' && (
                    <p className="text-red-400 text-sm text-center">Произошла ошибка. Попробуйте позже.</p>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800/50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <SafeIcon name="zap" size={14} className="text-white" />
              </div>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 Все права защищены.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App