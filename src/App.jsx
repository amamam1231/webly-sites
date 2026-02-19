import { SafeIcon } from './components/SafeIcon';
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const FAQ_DATA = [
  {
    question: "Сколько стоит беседка?",
    answer: "Цены на наши беседки начинаются от 45 000 рублей для базовых моделей и достигают 350 000 рублей для премиум вариантов с террасой и освещением.",
    keywords: ["цена", "стоимость", "сколько стоит", "дорого", "дешево", "рублей", "цену"]
  },
  {
    question: "Из какого материала изготовлены беседки?",
    answer: "Мы используем только качественные материалы: северная сосна, дуб, кедр, а также металлические конструкции с порошковым покрытием. Все материалы обработаны антисептиками.",
    keywords: ["материал", "дерево", "металл", "из чего", "сосна", "дуб", "качество"]
  },
  {
    question: "Как происходит доставка и установка?",
    answer: "Доставка осуществляется по всей России в течение 7-14 дней. Установка бесплатна в пределах 100 км от города. Дальше — 50 руб/км. Монтаж занимает 1-2 дня.",
    keywords: ["доставка", "установка", "монтаж", "привезти", "собрать", "как привезете"]
  },
  {
    question: "Можно ли заказать индивидуальный размер?",
    answer: "Да, конечно! Мы изготавливаем беседки по индивидуальным размерам. Срок изготовления нестандартной беседки — 3-4 недели. Дизайн-проект бесплатно.",
    keywords: ["размер", "индивидуальный", "свой размер", "заказать", "под заказ", "нестандарт"]
  },
  {
    question: "Какой срок изготовления?",
    answer: "Стандартные модели — 2-3 недели. Индивидуальные проекты — 3-4 недели. В летний сезон возможно увеличение срока до 5 недель из-за высокой загрузки.",
    keywords: ["срок", "когда будет готово", "сколько ждать", "время", "быстро", "долго"]
  }
]

const SITE_CONTEXT = "Мы продаем высококачественные деревянные и металлические беседки для садов и дач. Цены от 45 000 до 350 000 рублей. Доставка по всей России за 7-14 дней. Бесплатная установка в пределах 100 км. Индивидуальное проектирование доступно. Гарантия 5 лет на все конструкции."

const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'

const products = [
  {
    id: 1,
    name: "Классическая деревянная",
    price: "от 45 000 ₽",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    features: ["Северная сосна", "Базовая комплектация", "Без покраски"]
  },
  {
    id: 2,
    name: "Премиум с террасой",
    price: "от 120 000 ₽",
    image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&q=80",
    features: ["Дуб/Кедр", "Полная обработка", "Освещение included"]
  },
  {
    id: 3,
    name: "Металлопрофиль Modern",
    price: "от 85 000 ₽",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    features: ["Металл 2мм", "Порошковая покраска", "Современный дизайн"]
  },
  {
    id: 4,
    name: "Закрытая беседка",
    price: "от 180 000 ₽",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    features: ["Остекление", "Утепление", "Всесезонная"]
  }
]

function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50" : "bg-transparent"
    )}>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2">
            <SafeIcon name="home" size={28} className="text-emerald-500" />
            <span className="text-xl font-bold text-white">Беседки<span className="text-emerald-500">Премиум</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('products')} className="text-slate-300 hover:text-white transition-colors">Каталог</button>
            <button onClick={() => scrollTo('order')} className="text-slate-300 hover:text-white transition-colors">Заказать</button>
            <button onClick={() => scrollTo('contacts')} className="text-slate-300 hover:text-white transition-colors">Контакты</button>
          </nav>

          <button
            onClick={() => scrollTo('order')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
          >
            Оставить заявку
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const scrollToOrder = () => {
    const element = document.getElementById('order')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 z-0" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Идеальная беседка для <span className="text-emerald-500">вашего сада</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed">
              Изготавливаем премиальные деревянные и металлические беседки с доставкой и установкой по всей России. Гарантия 5 лет.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToOrder}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-600/25"
              >
                Рассчитать стоимость
              </button>
              <button
                onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-slate-700"
              >
                Смотреть каталог
              </button>
            </div>

            <div className="flex items-center gap-8 mt-12">
              <div className="flex items-center gap-2">
                <SafeIcon name="check-circle" size={20} className="text-emerald-500" />
                <span className="text-slate-300">Бесплатная доставка</span>
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon name="check-circle" size={20} className="text-emerald-500" />
                <span className="text-slate-300">Гарантия 5 лет</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/20">
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"
                alt="Беседка"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
              <div className="text-3xl font-black text-emerald-500">500+</div>
              <div className="text-slate-400 text-sm">Установленных беседок</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Products() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="products" className="py-20 md:py-32 bg-slate-950">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Наши беседки</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Выберите подходящую модель или закажите индивидуальный проект</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{product.name}</h3>
                <ul className="space-y-2 mb-4">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-400 text-sm">
                      <SafeIcon name="check" size={16} className="text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => document.getElementById('order').scrollIntoView({ behavior: 'smooth' })}
                  className="w-full bg-slate-800 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Заказать
                  <SafeIcon name="arrow-right" size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function OrderForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gazeboType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)

    const data = new FormData()
    data.append('access_key', ACCESS_KEY)
    data.append('name', formData.name)
    data.append('phone', formData.phone)
    data.append('email', formData.email)
    data.append('gazeboType', formData.gazeboType)
    data.append('message', formData.message)
    data.append('subject', 'Новая заявка на беседку')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })
      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
        setFormData({ name: '', phone: '', email: '', gazeboType: '', message: '' })
      } else {
        setIsError(true)
      }
    } catch (error) {
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section id="order" className="py-20 md:py-32 bg-slate-900">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Оставить заявку</h2>
            <p className="text-slate-400 text-lg">Заполните форму и мы свяжемся с вами в течение 30 минут</p>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-600/20 border border-emerald-500/50 rounded-2xl p-8 text-center"
              >
                <SafeIcon name="check-circle" size={64} className="text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Заявка отправлена!</h3>
                <p className="text-slate-300">Мы получили вашу заявку и скоро свяжемся с вами.</p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Отправить еще одну
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="bg-slate-950 rounded-2xl p-8 border border-slate-800 shadow-2xl"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Ваше имя</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-300 mb-2 font-medium">Телефон</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="+7 (999) 999-99-99"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-2 font-medium">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Тип беседки</label>
                    <select
                      name="gazeboType"
                      value={formData.gazeboType}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="">Выберите тип</option>
                      <option value="wooden-classic">Классическая деревянная</option>
                      <option value="premium-terrace">Премиум с террасой</option>
                      <option value="metal-modern">Металлопрофиль Modern</option>
                      <option value="closed-glass">Закрытая беседка</option>
                      <option value="custom">Индивидуальный проект</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Сообщение</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                      placeholder="Опишите ваши пожелания..."
                    />
                  </div>

                  {isError && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-center">
                      Произошла ошибка. Пожалуйста, попробуйте еще раз.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <SafeIcon name="loader-2" size={20} className="animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        Отправить заявку
                        <SafeIcon name="send" size={20} />
                      </>
                    )}
                  </button>

                  <p className="text-slate-500 text-sm text-center">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Здравствуйте! Чем могу помочь? Спросите о ценах, материалах или доставке.' }
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
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setInputValue('')
    setIsLoading(true)

    const faqAnswer = findFAQAnswer(userMessage)

    if (faqAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: faqAnswer }])
        setIsLoading(false)
      }, 500)
    } else {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage, context: SITE_CONTEXT })
        })

        if (response.ok) {
          const data = await response.json()
          setMessages(prev => [...prev, { type: 'bot', text: data.reply || 'Извините, я не понял вопрос. Попробуйте спросить о цене, материалах или доставке.' }])
        } else {
          throw new Error('API Error')
        }
      } catch (error) {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'К сожалению, я не смог обработать ваш запрос. Пожалуйста, позвоните нам или оставьте заявку на сайте. Часто задаваемые вопросы: цена, материалы, сроки доставки.'
        }])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden"
          >
            <div className="bg-emerald-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SafeIcon name="bot" size={24} className="text-white" />
                <span className="text-white font-bold">Помощник</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <SafeIcon name="x" size={20} />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-950">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-2",
                    msg.type === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="bot" size={16} className="text-white" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    msg.type === 'user'
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-200 rounded-bl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="bot" size={16} className="text-white" />
                  </div>
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Введите сообщение..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white p-2 rounded-lg transition-colors"
                >
                  <SafeIcon name="send" size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg shadow-emerald-600/30 flex items-center gap-2"
      >
        <SafeIcon name={isOpen ? "x" : "message-square"} size={24} />
        {!isOpen && <span className="font-medium pr-2">Задать вопрос</span>}
      </motion.button>
    </div>
  )
}

function Footer() {
  return (
    <footer id="contacts" className="bg-slate-950 border-t border-slate-800 py-12 pb-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <SafeIcon name="home" size={24} className="text-emerald-500" />
              <span className="text-lg font-bold text-white">Беседки<span className="text-emerald-500">Премиум</span></span>
            </div>
            <p className="text-slate-400 text-sm">Производство и продажа качественных беседок с 2015 года.</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Контакты</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex items-center gap-2">
                <SafeIcon name="phone" size={16} />
                +7 (999) 123-45-67
              </li>
              <li className="flex items-center gap-2">
                <SafeIcon name="mail" size={16} />
                info@besedki-premium.ru
              </li>
              <li className="flex items-center gap-2">
                <SafeIcon name="map-pin" size={16} />
                г. Москва, ул. Лесная, 10
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Режим работы</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Пн-Пт: 9:00 - 20:00</li>
              <li>Сб: 10:00 - 18:00</li>
              <li>Вс: Выходной</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          © 2024 Беседки Премиум. Все права защищены.
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <Hero />
      <Products />
      <OrderForm />
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App