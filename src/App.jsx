import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const FAQ_DATA = [
  {
    question: "Jak zapisać się na wizytę?",
    answer: "Możesz zapisać się przez formularz na stronie, telefon +48 123 456 789 lub czat. Pracujemy codziennie od 9:00 do 21:00.",
    keywords: ["zapisać", "wizyta", "rejestracja", "telefon", "jak dostać"]
  },
  {
    question: "Jakie usługi świadczycie?",
    answer: "Oferujemy pełen zakres usług stomatologicznych: leczenie próchnicy, protetyka, implantologia, wybielanie, korekta zgryzu i higiena profesjonalna.",
    keywords: ["usługi", "leczenie", "czym się zajmujecie", "implanty", "protetyka"]
  },
  {
    question: "Czy implantacja jest bolesna?",
    answer: "Implantacja wykonywana jest w znieczuleniu miejscowym, więc nie poczujesz bólu. Po zabiegu może wystąpić lekki dyskomfort, który mija po 1-2 dniach.",
    keywords: ["boli", "ból", "implantacja", "strach", "znieczulenie", "bezbolesnie"]
  }
]

const SITE_CONTEXT = "Stomatologia M - nowoczesna klinika premium w Warszawie. Specjalizacja: leczenie, protetyka, implantologia, ortodoncja. Godziny otwarcia: 9:00-21:00. Adres: Warszawa, Złota 12. Telefon: +48 123 456 789."

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Cześć! Pomogę odpowiedzieć na Twoje pytania o naszą klinikę. Co Cię interesuje?' }
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

  const findAnswer = (input) => {
    const lowerInput = input.toLowerCase()
    const match = FAQ_DATA.find(faq =>
      faq.keywords.some(keyword => lowerInput.includes(keyword))
    )
    return match ? match.answer : null
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setIsLoading(true)

    const localAnswer = findAnswer(userMessage)

    if (localAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: localAnswer }])
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
          setMessages(prev => [...prev, { type: 'bot', text: data.reply }])
        } else {
          throw new Error('API Error')
        }
      } catch (error) {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'Przepraszam, nie znalazłem odpowiedzi na to pytanie. Proszę zadzwoń do nas pod numer +48 123 456 789 lub zostaw wiadomość na stronie.'
        }])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/30 flex items-center justify-center transition-colors hover:bg-slate-800",
          isOpen && "hidden"
        )}
      >
        <SafeIcon name="messageSquare" size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-slate-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <SafeIcon name="bot" size={20} />
                <span className="font-semibold">Asystent kliniki</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <SafeIcon name="x" size={20} />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    msg.type === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    msg.type === 'user'
                      ? "bg-slate-900 text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Napisz pytanie..."
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)
    setIsError(false)

    const data = new FormData()
    data.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY')
    data.append('name', formData.name)
    data.append('phone', formData.phone)
    data.append('service', formData.service)
    data.append('message', formData.message)
    data.append('subject', 'Nowa wiadomość ze strony Stomatologia M')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData({ name: '', phone: '', service: '', message: '' })
      } else {
        setIsError(true)
      }
    } catch (error) {
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Imię i nazwisko</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
            placeholder="Jan Kowalski"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
            placeholder="+48 123 456 789"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Usługa</label>
        <select
          value={formData.service}
          onChange={(e) => setFormData({...formData, service: e.target.value})}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all bg-white"
        >
          <option value="">Wybierz usługę</option>
          <option value="therapy">Leczenie próchnicy</option>
          <option value="implantation">Implantologia</option>
          <option value="prosthetics">Protetyka</option>
          <option value="whitening">Wybielanie</option>
          <option value="hygiene">Higienizacja</option>
          <option value="orthodontics">Ortodoncja</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Wiadomość (opcjonalnie)</label>
        <textarea
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all resize-none"
          placeholder="Opisz swój problem lub pytanie..."
        />
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <SafeIcon name="checkCircle2" size={20} />
            <span>Dziękujemy! Skontaktujemy się z Tobą wkrótce.</span>
          </motion.div>
        ) : (
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-slate-900 text-white font-semibold py-4 rounded-lg hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Wysyłanie...
              </>
            ) : (
              <>
                <SafeIcon name="calendar" size={20} />
                Zapisz się na wizytę
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {isError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm"
        >
          Wystąpił błąd. Proszę zadzwoń do nas bezpośrednio lub spróbuj później.
        </motion.div>
      )}
    </form>
  )
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  const servicesRef = useRef(null)
  const isServicesInView = useInView(servicesRef, { once: true, margin: "-100px" })

  const aboutRef = useRef(null)
  const isAboutInView = useInView(aboutRef, { once: true, margin: "-100px" })

  const contactRef = useRef(null)
  const isContactInView = useInView(contactRef, { once: true, margin: "-100px" })

  const services = [
    {
      icon: 'shield',
      title: 'Leczenie próchnicy',
      description: 'Nowoczesne metody leczenia z wykorzystaniem wysokiej jakości materiałów. Bezbolesnie i niezawodnie.',
      price: 'od 300 zł'
    },
    {
      icon: 'award',
      title: 'Implantologia',
      description: 'Wszczepianie implantów klasy premium. Gwarancja na pracę do 10 lat.',
      price: 'od 2500 zł'
    },
    {
      icon: 'heart',
      title: 'Protetyka',
      description: 'Korony, mosty i protezy dowolnej złożoności. Naturalny wygląd.',
      price: 'od 1500 zł'
    },
    {
      icon: 'star',
      title: 'Wybielanie',
      description: 'Profesjonalne wybielanie Zoom 4. Efekt już po pierwszym zabiegu.',
      price: 'od 1000 zł'
    },
    {
      icon: 'checkCircle2',
      title: 'Higienizacja',
      description: 'Czyszczenie ultradźwiękowe, AirFlow, polerowanie. Profilaktyka chorób.',
      price: 'od 300 zł'
    },
    {
      icon: 'shield',
      title: 'Ortodoncja',
      description: 'Aparaty stałe i nakładki Invisalign. Indywidualny plan leczenia.',
      price: 'od 8000 zł'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="flex items-center gap-3">
              <img
                src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_387814377/user-photo-1.jpg"
                alt="Logo Stomatologia M"
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <div className="font-bold text-slate-900 text-lg leading-tight">Stomatologia M</div>
                <div className="text-xs text-slate-500">Klasa premium</div>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Usługi', id: 'services' },
                { label: 'O nas', id: 'about' },
                { label: 'Kontakt', id: 'contact' }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 transition-all group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <a href="tel:+48123456789" className="flex items-center gap-2 text-slate-900 font-semibold hover:text-slate-700 transition-colors">
                <SafeIcon name="phone" size={18} />
                +48 123 456 789
              </a>
              <button
                onClick={(e) => scrollToSection(e, 'contact')}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-medium hover:bg-slate-800 transition-colors"
              >
                Zapisz się
              </button>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-0.5 bg-slate-900 mb-1.5 transition-all" style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <div className="w-6 h-0.5 bg-slate-900 mb-1.5 transition-all" style={{ opacity: mobileMenuOpen ? 0 : 1 }} />
              <div className="w-6 h-0.5 bg-slate-900 transition-all" style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {[
                  { label: 'Usługi', id: 'services' },
                  { label: 'O nas', id: 'about' },
                  { label: 'Kontakt', id: 'contact' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className="block text-slate-600 hover:text-slate-900 font-medium py-2"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-slate-100">
                  <a href="tel:+48123456789" className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
                    <SafeIcon name="phone" size={18} />
                    +48 123 456 789
                  </a>
                  <button
                    onClick={(e) => scrollToSection(e, 'contact')}
                    className="w-full bg-slate-900 text-white px-5 py-3 rounded-full font-medium"
                  >
                    Zapisz się na wizytę
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <SafeIcon name="star" size={16} className="text-yellow-400" />
                <span className="text-white/90 text-sm font-medium">Top 10 klinik w Warszawie</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                Twój uśmiech —<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                  nasza troska
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
                Nowoczesna stomatologia klasy premium. Bezbolesne leczenie, nowoczesne technologie, indywidualne podejście do każdego pacjenta.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <SafeIcon name="calendar" size={20} />
                  Zapisz się online
                </button>
                <button
                  onClick={(e) => scrollToSection(e, 'services')}
                  className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Nasze usługi
                  <SafeIcon name="chevronDown" size={18} />
                </button>
              </div>

              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-white">15+</div>
                  <div className="text-slate-400 text-sm">lat doświadczenia</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">5000+</div>
                  <div className="text-slate-400 text-sm">zadowolonych pacjentów</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">4.9</div>
                  <div className="text-slate-400 text-sm">ocena w Google</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl" />
                <img
                  src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_387814377/user-photo-1.jpg"
                  alt="Logo Stomatologia M"
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-white text-slate-900 p-4 rounded-2xl shadow-xl"
                >
                  <SafeIcon name="checkCircle2" size={32} className="text-green-500" />
                  <div className="font-bold mt-1">Gwarancja</div>
                  <div className="text-xs text-slate-500">na wszystkie usługi</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="services" ref={servicesRef} className="py-20 md:py-32 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
              Nasze usługi
            </h2>
            <p className="text-lg text-slate-600">
              Oferujemy pełen zakres usług stomatologicznych z wykorzystaniem nowoczesnego sprzętu i materiałów premium
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <SafeIcon name={service.icon} size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-slate-900 font-bold text-lg">{service.price}</span>
                  <button
                    onClick={(e) => scrollToSection(e, 'contact')}
                    className="text-slate-900 font-medium text-sm hover:underline flex items-center gap-1"
                  >
                    Więcej
                    <SafeIcon name="chevronDown" size={14} className="-rotate-90" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" ref={aboutRef} className="py-20 md:py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_50%)]" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isAboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-black mb-6">
                Dlaczego warto nas wybrać?
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Klinika M to połączenie wieloletniego doświadczenia, nowoczesnych technologii i troski o każdego pacjenta. Tworzymy atmosferę zaufania i komfortu.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Bezbolesne leczenie', desc: 'Nowoczesna anestezja i delikatne metody' },
                  { title: 'Nowoczesny sprzęt', desc: 'Diagnostyka 3D i technologie cyfrowe' },
                  { title: 'Indywidualne podejście', desc: 'Personalizowany plan leczenia dla każdego' },
                  { title: 'Gwarancja rezultatu', desc: 'Długoterminowa gwarancja na wszystkie prace' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="checkCircle2" size={24} className="text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isAboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4 mt-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <SafeIcon name="shield" size={32} className="text-blue-400 mb-4" />
                  <div className="text-3xl font-black mb-1">100%</div>
                  <div className="text-slate-400 text-sm">sterylność</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <SafeIcon name="clock" size={32} className="text-yellow-400 mb-4" />
                  <div className="text-3xl font-black mb-1">24/7</div>
                  <div className="text-slate-400 text-sm">pomoc doraźna</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <SafeIcon name="award" size={32} className="text-purple-400 mb-4" />
                  <div className="text-3xl font-black mb-1">20+</div>
                  <div className="text-slate-400 text-sm">certyfikowanych lekarzy</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <SafeIcon name="heart" size={32} className="text-red-400 mb-4" />
                  <div className="text-3xl font-black mb-1">99%</div>
                  <div className="text-slate-400 text-sm">zadowolonych pacjentów</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="contact" ref={contactRef} className="py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isContactInView ? { opacity: 1, y: 0 } : {}}
            >
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                Zapisz się na wizytę
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Zostaw wiadomość, a skontaktujemy się z Tobą wkrótce w celu potwierdzenia wizyty. Lub zadzwoń do nas bezpośrednio.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                    <SafeIcon name="phone" size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Telefon</div>
                    <a href="tel:+48123456789" className="text-lg font-bold text-slate-900 hover:text-slate-700 transition-colors">
                      +48 123 456 789
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                    <SafeIcon name="mapPin" size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Adres</div>
                    <div className="text-lg font-bold text-slate-900">Warszawa, Złota 12</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                    <SafeIcon name="clock" size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Godziny otwarcia</div>
                    <div className="text-lg font-bold text-slate-900">Codziennie 9:00 — 21:00</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isContactInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 border-t border-white/10">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_387814377/user-photo-1.jpg"
                  alt="Logo"
                  className="h-10 w-auto"
                />
                <span className="font-bold text-xl">Stomatologia M</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Nowoczesna klinika stomatologiczna premium. Dbamy o Twój uśmiech od 2009 roku.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Usługi</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-white transition-colors">Leczenie próchnicy</a></li>
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-white transition-colors">Implantologia</a></li>
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-white transition-colors">Protetyka</a></li>
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-white transition-colors">Wybielanie</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>+48 123 456 789</li>
                <li>Warszawa, Złota 12</li>
                <li>Codziennie 9:00 — 21:00</li>
                <li>info@stomatologia-m.pl</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div>© 2024 Stomatologia M. Wszelkie prawa zastrzeżone.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Polityka prywatności</a>
              <a href="#" className="hover:text-white transition-colors">Licencje</a>
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  )
}

export default App