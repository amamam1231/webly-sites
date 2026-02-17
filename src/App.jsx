import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Play, Scissors, Camera, Send, CheckCircle, MessageSquare } from 'lucide-react'

// Web3Forms Hook
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
      setErrorMessage('Ошибка сети. Попробуйте ещё раз.')
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

// Portfolio Data - Easy to replace with real video links
const portfolioItems = [
  {
    id: 1,
    title: "Рекламный ролик",
    description: "Промо-видео для локального бренда",
    videoUrl: "#", // Replace with YouTube/Vimeo link
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80"
  },
  {
    id: 2,
    title: "Корпоративное видео",
    description: "Съёмка мероприятия для компании",
    videoUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&q=80"
  },
  {
    id: 3,
    title: "Музыкальный клип",
    description: "Творческий проект для артиста",
    videoUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80"
  },
  {
    id: 4,
    title: "Интервью",
    description: "Документальная съёмка",
    videoUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80"
  },
  {
    id: 5,
    title: "Event-видео",
    description: "Съёмка конференции в Праге",
    videoUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"
  },
  {
    id: 6,
    title: "Личный проект",
    description: "Творческая работа",
    videoUrl: "#",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=80"
  }
]

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Replace with your Web3Forms Access Key from https://web3forms.com

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
        <nav className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight text-slate-900">
            Видеограф Прага
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('hero')} className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
              Главная
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
              Портфолио
            </button>
            <button onClick={() => scrollToSection('services')} className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
              Услуги
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
              Контакты
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-4">
                <button onClick={() => scrollToSection('hero')} className="block w-full text-left text-slate-600 hover:text-slate-900 transition-colors text-sm">
                  Главная
                </button>
                <button onClick={() => scrollToSection('portfolio')} className="block w-full text-left text-slate-600 hover:text-slate-900 transition-colors text-sm">
                  Портфолио
                </button>
                <button onClick={() => scrollToSection('services')} className="block w-full text-left text-slate-600 hover:text-slate-900 transition-colors text-sm">
                  Услуги
                </button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-slate-600 hover:text-slate-900 transition-colors text-sm">
                  Контакты
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Видеограф в Праге
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Съёмка и монтаж видео для бизнеса и личных проектов. Работаю в Праге и по Чехии.
            </p>
            <a
              href="https://t.me/MatveIIuechenko"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              <MessageSquare size={20} />
              Записаться / обсудить проект
            </a>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 md:py-32 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Портфолио
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Примеры работ. Нажмите на карточку, чтобы посмотреть видео.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {portfolioItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-video bg-slate-200 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play size={20} className="text-slate-900 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Услуги
            </h2>
            <p className="text-slate-600">
              Профессиональная работа с видеоматериалом
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
            {/* Editing Service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                <Scissors size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Монтаж</h3>
              <div className="text-2xl font-bold text-slate-900 mb-4">750 CZK / час</div>
              <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
                <li>• Монтаж по структуре</li>
                <li>• Базовая цветокоррекция</li>
                <li>• Чистка звука</li>
                <li>• Титры/субтитры по запросу</li>
                <li>• Экспорт под нужные форматы</li>
              </ul>
            </motion.div>

            {/* Filming Service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                <Camera size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Съёмка</h3>
              <div className="text-2xl font-bold text-slate-900 mb-4">750 CZK / час</div>
              <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
                <li>• Съёмка на локации</li>
                <li>• Базовый свет и звук по необходимости</li>
                <li>• Исходники или материал под монтаж</li>
                <li>• Консультация по задаче</li>
                <li>• Помощь с планированием съёмки</li>
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center text-slate-500 text-sm"
          >
            Минимальный заказ и детали обсуждаются в переписке
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 px-6 bg-slate-900 text-white telegram-safe-bottom">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Связаться
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Напишите в Telegram — отвечу и уточню задачу, сроки и формат.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-12"
          >
            <a
              href="https://t.me/MatveIIuechenko"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-10 py-5 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
            >
              <MessageSquare size={24} />
              Написать в Telegram
            </a>
          </motion.div>

          {/* Mini Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className="border-t border-slate-800 pt-10">
              <p className="text-slate-400 text-sm text-center mb-6">
                Или оставьте сообщение здесь:
              </p>

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
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
                      />
                    </div>

                    <div>
                      <textarea
                        name="message"
                        placeholder="Сообщение"
                        rows="4"
                        required
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors resize-none"
                      ></textarea>
                    </div>

                    {isError && (
                      <div className="text-red-400 text-sm">
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Отправка...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Отправить сообщение
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
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Сообщение отправлено!
                    </h3>
                    <p className="text-slate-400 mb-6 text-sm">
                      Спасибо за обращение. Я свяжусь с вами в ближайшее время.
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      Отправить ещё сообщение
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-950 text-slate-500 text-sm">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            © {new Date().getFullYear()} Видеограф Прага
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://t.me/MatveIIuechenko"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <MessageSquare size={16} />
              Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App