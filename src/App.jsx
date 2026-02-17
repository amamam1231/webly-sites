import { SafeIcon } from './components/SafeIcon';
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Shield, Rocket, ChevronRight, Menu, X, CheckCircle, Send } from 'lucide-react'

// Form hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e, accessKey) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)

    const formData = new FormData(e.target)
    formData.append('access_key', accessKey)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        e.target.reset()
      } else {
        setIsError(true)
        setErrorMessage(data.message || 'Что-то пошло не так')
      }
    } catch (error) {
      setIsError(true)
      setErrorMessage('Ошибка сети. Попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setIsError(false)
    setErrorMessage('')
  }

  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm }
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Замените на ключ с https://web3forms.com

  const scrollToSection = (e, sectionId) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white mobile-safe-container">
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-slate-950/90 backdrop-blur-md z-50 border-b border-slate-800">
        <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SafeIcon name="zap" size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Продукт</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
              Возможности
            </a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
              Контакты
            </a>
            <button
              onClick={(e) => scrollToSection(e, 'cta')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all transform hover:scale-105"
            >
              Начать
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <SafeIcon name={mobileMenuOpen ? "x" : "menu"} size={24} className="text-slate-300" />
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800"
            >
              <div className="px-4 py-4 space-y-3">
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="block py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Возможности
                </a>
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="block py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Контакты
                </a>
                <button
                  onClick={(e) => scrollToSection(e, 'cta')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-semibold text-sm transition-all mt-2"
                >
                  Начать сейчас
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
              Решение для <br/>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                вашего бизнеса
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Простая интеграция, мощный результат. Начните использовать наш продукт уже сегодня и увидьте разницу.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={(e) => scrollToSection(e, 'cta')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 min-h-[56px]"
              >
                Попробовать бесплатно
                <SafeIcon name="chevron-right" size={20} />
              </button>
              <button
                onClick={(e) => scrollToSection(e, 'features')}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all border border-slate-700 min-h-[56px]"
              >
                Узнать больше
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 md:py-20 px-4 md:px-6 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему выбирают нас?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Три ключевых преимущества, которые делают наш продукт незаменимым</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <SafeIcon name="rocket" size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Быстрый старт</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Настройка за 5 минут без сложной интеграции. Работает сразу после подключения.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <SafeIcon name="shield" size={24} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Надёжность</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                99.9% uptime, шифрование данных и регулярные бэкапы. Ваши данные в безопасности.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 hover:border-pink-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <SafeIcon name="zap" size={24} className="text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Автоматизация</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Автоматические процессы экономят ваше время. Фокусируйтесь на главном.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="cta" className="py-16 md:py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0  opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Готовы начать?</h2>
              <p className="text-indigo-100 mb-8 max-w-lg mx-auto text-lg">
                Присоединяйтесь к тысячам довольных клиентов. Первые 14 дней бесплатно.
              </p>
              <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-xl min-h-[56px]">
                Создать аккаунт
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="py-16 md:py-20 px-4 md:px-6 bg-slate-900/30">
        <div className="container mx-auto max-w-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Свяжитесь с нами</h2>
            <p className="text-slate-400 text-sm">Есть вопросы? Мы ответим в течение часа</p>
          </div>

          <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Ваше имя"
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      placeholder="Сообщение"
                      rows="3"
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  {isError && (
                    <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Отправка...
                      </>
                    ) : (
                      <>
                        <SafeIcon name="send" size={18} />
                        Отправить
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="text-center py-8"
                >
                  <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon name="check-circle" size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Сообщение отправлено!
                  </h3>
                  <p className="text-slate-400 mb-6 text-sm">
                    Спасибо за обращение. Мы свяжемся с вами в ближайшее время.
                  </p>
                  <button
                    onClick={resetForm}
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors text-sm"
                  >
                    Отправить ещё
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 md:px-6 telegram-safe-bottom">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
                <SafeIcon name="zap" size={14} className="text-white" />
              </div>
              <span className="font-bold">Продукт</span>
            </div>
            <div className="text-slate-500 text-sm text-center md:text-right">
              © 2024 Все права защищены
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App