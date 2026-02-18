import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// Utility for class merging
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

// FAQ Data for Chat Widget
const FAQ_DATA = [
  {
    question: "Как записаться на встречу?",
    answer: "Записаться на встречу можно через форму на сайте в разделе 'Расписание встреч'. Все встречи анонимны и бесплатны. Вы также можете просто прийти без предварительной записи.",
    keywords: ["записаться", "встреча", "регистрация", "как прийти", "запись"]
  },
  {
    question: "Это конфиденциально?",
    answer: "Абсолютно. Анонимность — основа нашей программы. Мы не требуем имен, телефонов или других данных. То, что вы услышите на встрече, остаётся на встрече.",
    keywords: ["анонимность", "конфиденциальность", "безопасно", "скрытно", "никто не узнает"]
  },
  {
    question: "Сколько стоит участие?",
    answer: "Участие во всех встречах полностью бесплатное. Клуб Анонимных Алкоголиков не имеет членских взносов и не принимает пожертвования от посторонних.",
    keywords: ["стоимость", "цена", "деньги", "бесплатно", "платно", "взносы"]
  },
  {
    question: "Что такое программа 12 шагов?",
    answer: "Программа 12 шагов — это метод выздоровления, основанный на взаимопомощи и духовных принципах. Мы признаём бессилие перед алкоголем, верим в силу, большую нас, и помогаем другим алкоголикам.",
    keywords: ["12 шагов", "программа", "метод", "лечение", "выздоровление", "шаги"]
  },
  {
    question: "Нужно ли готовиться к первой встрече?",
    answer: "Никакой подготовки не требуется. Приходите такими, какие вы есть. Достаточно иметь желание бросить пить. Мы понимаем, что первый шаг бывает трудным.",
    keywords: ["подготовка", "первая встреча", "как подготовиться", "что брать", "начало"]
  }
]

const SITE_CONTEXT = "Клуб Анонимных Алкоголиков — сообщество взаимопомощи для людей, страдающих алкоголизмом. Мы предлагаем программу 12 шагов, анонимные встречи поддержки, личные истории выздоровления и инструменты для самодиагностики. Конфиденциальность и анонимность — наш главный принцип."

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Здравствуйте! Я виртуальный помощник Клуба Анонимных Алкоголиков. Задайте мне вопрос о встречах, анонимности или программе 12 шагов.' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findFAQAnswer = (input) => {
    const lowerInput = input.toLowerCase()
    for (const faq of FAQ_DATA) {
      if (faq.keywords.some(keyword => lowerInput.includes(keyword))) {
        return faq.answer
      }
    }
    return null
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setInputValue('')
    setIsLoading(true)

    // Check FAQ first
    const faqAnswer = findFAQAnswer(userMessage)

    if (faqAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: faqAnswer }])
        setIsLoading(false)
      }, 500)
      return
    }

    // Fallback to API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: SITE_CONTEXT })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { type: 'bot', text: data.response || 'Спасибо за вопрос. Для уточнения информации свяжитесь с нами через форму обратной связи.' }])
      } else {
        throw new Error('API error')
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Извините, я не смог найти ответ на ваш вопрос. Попробуйте спросить о: записи на встречу, анонимности, программе 12 шагов, стоимости или первой встрече. Или свяжитесь с нами через форму обратной связи.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30 transition-colors",
          isOpen && "hidden"
        )}
      >
        <SafeIcon name="message-square" size={24} className="text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <SafeIcon name="bot" size={20} className="text-blue-400" />
                <span className="font-semibold text-white">Помощник АА</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <SafeIcon name="x" size={20} />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-900">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex",
                    msg.type === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    msg.type === 'user'
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-slate-800 text-slate-200 rounded-bl-md border border-slate-700"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-md p-3 flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-800 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ваш вопрос..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                  <SafeIcon name="send" size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Self-Diagnostic Test Component
const SelfTest = () => {
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      question: "Пытались ли вы когда-нибудь сократить употребление алкоголя?",
      options: ["Нет", "Да, но не смог", "Да, временно получалось", "Не пытался"]
    },
    {
      question: "Критиковали ли вас люди из-за вашего питья?",
      options: ["Нет", "Редко", "Иногда", "Часто"]
    },
    {
      question: "Чувствуете ли вы вину из-за употребления алкоголя?",
      options: ["Нет", "Иногда", "Часто", "Постоянно"]
    },
    {
      question: "Нуждаетесь ли вы в алкоголе с утра?",
      options: ["Нет", "Редко", "Иногда", "Часто"]
    },
    {
      question: "Есть ли у вас проблемы с памятью после распитий?",
      options: ["Нет", "Иногда", "Часто", "Очень часто"]
    }
  ]

  const handleAnswer = (index) => {
    const newAnswers = [...answers, index]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
      localStorage.setItem('aa_selftest_results', JSON.stringify(newAnswers))
    }
  }

  const getResult = () => {
    const score = answers.reduce((sum, val) => sum + val, 0)
    if (score <= 3) return { level: "low", text: "Ваши ответы не указывают на серьёзную зависимость. Однако если вас беспокоит ваше питьё, мы готовы поговорить.", color: "text-green-400" }
    if (score <= 7) return { level: "medium", text: "Ваши ответы указывают на возможную проблему с алкоголем. Мы рекомендуем посетить встречу АА для консультации.", color: "text-yellow-400" }
    return { level: "high", text: "Ваши ответы указывают на вероятную зависимость от алкоголя. Мы настоятельно рекомендуем обратиться за помощью. Вы не одни.", color: "text-red-400" }
  }

  const resetTest = () => {
    setStarted(false)
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
  }

  if (!started) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
        <SafeIcon name="clipboard-check" size={48} className="mx-auto text-blue-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-3">Тест самодиагностики</h3>
        <p className="text-slate-400 mb-6">Ответьте на 5 вопросов, чтобы оценить ваши отношения с алкоголем. Это анонимно и займёт 2 минуты.</p>
        <button
          onClick={() => setStarted(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
        >
          Начать тест
        </button>
      </div>
    )
  }

  if (showResults) {
    const result = getResult()
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
        <SafeIcon name="check-circle" size={48} className={cn("mx-auto mb-4", result.color)} />
        <h3 className="text-xl font-bold text-white mb-3">Результаты теста</h3>
        <p className={cn("mb-6", result.color)}>{result.text}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={resetTest}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Пройти снова
          </button>
          <a
            href="#meetings"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('meetings').scrollIntoView({behavior: 'smooth'})
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Записаться на встречу
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
          <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-6">{questions[currentQuestion].question}</h3>

      <div className="space-y-3">
        {questions[currentQuestion].options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="w-full text-left p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-xl transition-all"
          >
            <span className="text-slate-200">{option}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Progress Tracker Component
const ProgressTracker = () => {
  const [soberDays, setSoberDays] = useState(0)
  const [meetingsAttended, setMeetingsAttended] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('aa_progress')
    if (saved) {
      const data = JSON.parse(saved)
      setSoberDays(data.soberDays || 0)
      setMeetingsAttended(data.meetings || 0)
    }
  }, [])

  const saveProgress = () => {
    localStorage.setItem('aa_progress', JSON.stringify({ soberDays, meetings: meetingsAttended }))
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <SafeIcon name="target" size={24} className="text-blue-500" />
        Трекер прогресса
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">{soberDays}</div>
          <div className="text-sm text-slate-400">Дней трезвости</div>
          <div className="flex gap-2 justify-center mt-3">
            <button
              onClick={() => { setSoberDays(Math.max(0, soberDays - 1)); saveProgress() }}
              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white transition-colors"
            >
              -
            </button>
            <button
              onClick={() => { setSoberDays(soberDays + 1); saveProgress() }}
              className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">{meetingsAttended}</div>
          <div className="text-sm text-slate-400">Встреч посещено</div>
          <div className="flex gap-2 justify-center mt-3">
            <button
              onClick={() => { setMeetingsAttended(Math.max(0, meetingsAttended - 1)); saveProgress() }}
              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white transition-colors"
            >
              -
            </button>
            <button
              onClick={() => { setMeetingsAttended(meetingsAttended + 1); saveProgress() }}
              className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center text-white transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Прогресс к 90 дням</span>
          <span className="text-blue-400">{Math.min(100, Math.round((soberDays / 90) * 100))}%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (soberDays / 90) * 100)}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
          />
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4 text-center">Данные сохраняются локально в вашем браузере</p>
    </div>
  )
}

// Contact Form with Web3Forms
const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)
    setIsError(false)

    const formData = new FormData(e.target)
    formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setIsSuccess(true)
        e.target.reset()
      } else {
        throw new Error('Submit failed')
      }
    } catch (error) {
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6">Связаться с нами</h3>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-8"
          >
            <SafeIcon name="check-circle" size={64} className="mx-auto text-green-500 mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Сообщение отправлено</h4>
            <p className="text-slate-400 mb-4">Спасибо. Мы свяжемся с вами в ближайшее время.</p>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-blue-400 hover:text-blue-300"
            >
              Отправить ещё сообщение
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {isError && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg text-sm">
                Произошла ошибка. Пожалуйста, попробуйте позже или позвоните нам напрямую.
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Имя (можно псевдоним)</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Телефон или Email</label>
                <input
                  type="text"
                  name="contact"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Для связи (необязательно)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Сообщение</label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Опишите вашу ситуацию или задайте вопрос..."
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="anonymous"
                name="anonymous"
                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="anonymous" className="text-sm text-slate-400">
                Я хочу остаться анонимным. Не сохраняйте мои контактные данные.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <SafeIcon name="loader-2" size={20} className="animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <SafeIcon name="send" size={20} />
                  Отправить сообщение
                </>
              )}
            </button>

            <p className="text-xs text-slate-500 text-center">
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main App Component
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  const navLinks = [
    { href: '#program', label: '12 шагов' },
    { href: '#meetings', label: 'Встречи' },
    { href: '#test', label: 'Тест' },
    { href: '#stories', label: 'Истории' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Контакты' },
  ]

  const steps = [
    { number: "01", title: "Признание", desc: "Мы признаём бессилие перед алкоголем — наша жизнь стала неуправляемой" },
    { number: "02", title: "Вера", desc: "Приходим к убеждению, что только сила, бóльшая нас самих, способна вернуть нам здравый смысл" },
    { number: "03", title: "Принятие", desc: "Решили препоручить свою волю и свою жизнь заботе Бога, как мы понимали Его" },
    { number: "04", title: "Инвентаризация", desc: "Составили искренний и бесстрашный нравственный обзор самих себя" },
    { number: "05", title: "Признание", desc: "Признали перед Богом, собой и другим человеком истинную природу наших заблуждений" },
    { number: "06", title: "Готовность", desc: "Полностью подготовились к тому, чтобы Бог избавил нас от всех пороков характера" },
    { number: "07", title: "Просьба", desc: "Смиренно просили Его исправить наши недостатки" },
    { number: "08", title: "Список", desc: "Составили список всех людей, которым причинили зло, и выразили готовность загладить вину перед ними" },
    { number: "09", title: "Возмещение", desc: "Возместили личный ущерб этим людям, где только возможно" },
    { number: "10", title: "Продолжение", desc: "Продолжали личную инвентаризацию и, когда ошибались, тотчас признавали это" },
    { number: "11", title: "Молитва", desc: "Стремились путём молитвы и размышления сознательно общаться с Богом" },
    { number: "12", title: "Пробуждение", desc: "Пережив духовное пробуждение, пытались нести эту весть другим алкоголикам" },
  ]

  const meetings = [
    { day: "Понедельник", time: "19:00", location: "Центр 'Возрождение'", address: "ул. Надежды, 15", type: "Открытая" },
    { day: "Среда", time: "19:00", location: "Центр 'Возрождение'", address: "ул. Надежды, 15", type: "Закрытая" },
    { day: "Пятница", time: "18:30", location: "Центр 'Новая жизнь'", address: "пр. Мира, 42", type: "Открытая" },
    { day: "Суббота", time: "11:00", location: "Центр 'Возрождение'", address: "ул. Надежды, 15", type: "Для новичков" },
    { day: "Воскресенье", time: "16:00", location: "Центр 'Солидарность'", address: "ул. Свободы, 28", type: "Открытая" },
  ]

  const stories = [
    { name: "Александр, 45 лет", years: "12 лет трезвости", text: "Я потерял семью, работу, квартиру. Думал, конец. Но на первой встрече я понял — я не один. Сегодня у меня новая жизнь, новая работа, я помогаю другим." },
    { name: "Елена, 38 лет", years: "5 лет трезвости", text: "Женщинам сложнее признать проблему. Я прятала бутылки, врала близким. Программа 12 шагов научила меня честности с собой." },
    { name: "Михаил, 52 года", years: "20 лет трезвости", text: "Пришёл в АА после третьей попытки суицида. Сегодня я благодарен за каждый день трезвости. Программа работает, если работаешь по ней." },
  ]

  const faqItems = [
    { q: "Нужно ли регистрироваться?", a: "Нет. Все встречи анонимны и бесплатны. Вы можете просто прийти." },
    { q: "Что такое открытая и закрытая встреча?", a: "На открытые встречи можно прийти с родственниками. Закрытые только для тех, у кого есть проблема с алкоголем." },
    { q: "Это религиозная организация?", a: "Нет. Мы духовная, но не религиозная программа. Каждый понимает высшую силу по-своему." },
    { q: "Можно ли прийти онлайн?", a: "Да, некоторые группы проводят онлайн-встречи. Уточняйте расписание." },
  ]

  const scrollToSection = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const SectionTitle = ({ children, subtitle }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
      <div ref={ref} className="text-center mb-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-blue-500 font-semibold mb-3 tracking-wider uppercase text-sm"
        >
          {subtitle}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white tracking-tight"
        >
          {children}
        </motion.h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="#" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="shield" size={24} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white hidden sm:block">Клуб АА</span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-sm text-slate-300 hover:text-white transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#meetings"
                onClick={(e) => scrollToSection(e, '#meetings')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
              >
                Записаться
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              <SafeIcon name={isMenuOpen ? "x" : "menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800"
            >
              <nav className="container mx-auto px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="block py-2 text-slate-300 hover:text-white font-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-950 to-slate-950" />
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <SafeIcon name="shield-check" size={16} className="text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">Анонимность и конфиденциальность</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
                Вы не одни.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Есть выход.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Клуб Анонимных Алкоголиков — сообщество взаимопомощи, где каждый может найти поддержку и начать новую жизнь без алкоголя.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#meetings"
                  onClick={(e) => scrollToSection(e, '#meetings')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center justify-center gap-2"
                >
                  <SafeIcon name="calendar" size={20} />
                  Найти встречу
                </a>
                <a
                  href="#test"
                  onClick={(e) => scrollToSection(e, '#test')}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2"
                >
                  <SafeIcon name="clipboard-check" size={20} />
                  Пройти тест
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-800/50 bg-slate-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2M+", label: "Участников мирового" },
              { value: "180", label: "Стран присутствия" },
              { value: "100+", label: "Групп в России" },
              { value: "0", label: "Стоимость участия" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-black text-blue-400 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 12 Steps Program */}
      <section id="program" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle subtitle="Программа выздоровления">12 шагов АА</SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl font-black text-slate-800 group-hover:text-blue-500/30 transition-colors">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meetings Schedule */}
      <section id="meetings" className="py-20 md:py-32 bg-slate-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle subtitle="Расписание">Встречи групп поддержки</SectionTitle>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              {meetings.map((meeting, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-800 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-400 uppercase">{meeting.day.slice(0, 3)}</span>
                        <span className="text-lg font-bold text-white">{meeting.time}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{meeting.location}</h3>
                        <p className="text-sm text-slate-400">{meeting.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        meeting.type === "Открытая" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        meeting.type === "Закрытая" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      )}>
                        {meeting.type}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Записаться на встречу</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Выберите встречу</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                    <option>Понедельник, 19:00 — Центр 'Возрождение'</option>
                    <option>Среда, 19:00 — Центр 'Возрождение'</option>
                    <option>Пятница, 18:30 — Центр 'Новая жизнь'</option>
                    <option>Суббота, 11:00 — Центр 'Возрождение'</option>
                    <option>Воскресенье, 16:00 — Центр 'Солидарность'</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Как к вам обращаться</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    placeholder="Имя или псевдоним"
                  />
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="first-time"
                    className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="first-time" className="text-sm text-slate-400">
                    Это моя первая встреча. Я немного волнуюсь.
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all hover:scale-[1.02]"
                >
                  Подтвердить запись
                </button>
                <p className="text-xs text-slate-500 text-center">
                  Запись необязательна — вы можете просто прийти
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Self Test & Progress Tracker */}
      <section id="test" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle subtitle="Инструменты самопомощи">Тест и трекер прогресса</SectionTitle>

          <div className="grid lg:grid-cols-2 gap-8">
            <SelfTest />
            <ProgressTracker />
          </div>
        </div>
      </section>

      {/* Personal Stories */}
      <section id="stories" className="py-20 md:py-32 bg-slate-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle subtitle="Истории выздоровления">Личный опыт участников</SectionTitle>

          <div className="grid md:grid-cols-3 gap-6">
            {stories.map((story, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{story.name}</h3>
                    <p className="text-sm text-green-400">{story.years}</p>
                  </div>
                </div>
                <SafeIcon name="quote" size={24} className="text-slate-700 mb-4" />
                <p className="text-slate-300 leading-relaxed">{story.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle subtitle="Частые вопросы">FAQ</SectionTitle>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-semibold text-white pr-4">{item.q}</span>
                  <SafeIcon
                    name="chevron-down"
                    size={20}
                    className={cn(
                      "text-slate-400 transition-transform flex-shrink-0",
                      activeFaq === idx && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-slate-400 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 md:py-32 bg-slate-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle subtitle="Контакты">Связаться с нами</SectionTitle>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ContactForm />

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="phone" size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Горячая линия</h3>
                    <p className="text-2xl font-bold text-blue-400 mb-2">8-800-123-45-67</p>
                    <p className="text-sm text-slate-400">Бесплатно, анонимно, 24/7</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="message-circle" size={24} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Мессенджеры</h3>
                    <p className="text-slate-400 text-sm mb-3">Напишите нам анонимно</p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition-colors">
                        Telegram
                      </button>
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition-colors">
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 rounded-2xl p-6 text-center">
                <SafeIcon name="shield" size={40} className="mx-auto text-white/80 mb-3" />
                <h3 className="font-bold text-white mb-2">Ваша анонимность важна</h3>
                <p className="text-blue-100 text-sm">
                  Мы не храним данные о звонках и переписке. Вы можете обратиться к нам без опасений.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="shield" size={18} className="text-white" />
              </div>
              <span className="font-bold text-white">Клуб Анонимных Алкоголиков</span>
            </div>

            <nav className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <a href="#program" onClick={(e) => scrollToSection(e, '#program')} className="hover:text-white transition-colors">12 шагов</a>
              <a href="#meetings" onClick={(e) => scrollToSection(e, '#meetings')} className="hover:text-white transition-colors">Встречи</a>
              <a href="#stories" onClick={(e) => scrollToSection(e, '#stories')} className="hover:text-white transition-colors">Истории</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="hover:text-white transition-colors">Контакты</a>
            </nav>

            <p className="text-sm text-slate-500 text-center md:text-right">
              © 2024 Клуб АА. Некоммерческая организация.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-xs text-slate-600 max-w-2xl mx-auto">
              Анонимные Алкоголики не связаны ни с какой сектой, деноминацией, политической, экономической или правительственной организацией.
              Наша цель — оставаться трезвыми и помочь другим алкоголикам достичь трезвости.
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default App