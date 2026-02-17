import { SafeIcon } from './components/SafeIcon';
import { useState } from 'react'
import { motion } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Menu, X, ArrowRight, Mail, Phone, MapPin } from 'lucide-react'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  }

  const features = [
    {
      title: 'Быстро',
      desc: 'Молниеносная загрузка страниц без задержек'
    },
    {
      title: 'Просто',
      desc: 'Интуитивно понятный интерфейс без сложностей'
    },
    {
      title: 'Надёжно',
      desc: 'Стабильная работа на всех устройствах'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="text-xl font-bold text-white tracking-tight">
              Лого
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['Главная', 'О нас', 'Контакты'].map((item, i) => (
                <a
                  key={item}
                  href={['#hero', '#about', '#contact'][i]}
                  onClick={(e) => scrollToSection(e, ['hero', 'about', 'contact'][i])}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                Начать
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <SafeIcon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-3">
              {['Главная', 'О нас', 'Контакты'].map((item, i) => (
                <a
                  key={item}
                  href={['#hero', '#about', '#contact'][i]}
                  onClick={(e) => scrollToSection(e, ['hero', 'about', 'contact'][i])}
                  className="block py-2 text-slate-300 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section id="hero" className="pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
              Короткий сайт<br />
              <span className="text-blue-500">без лишнего</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-xl leading-relaxed">
              Минималистичный дизайн, максимальная скорость, чистый код.
              Всё необходимое — ничего лишнего.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all hover:scale-105">
                Узнать больше
                <SafeIcon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium rounded-lg transition-all">
                Подробности
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="py-20 md:py-32 border-t border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Почему мы
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Три ключевых принципа нашей работы
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-all hover:scale-[1.02]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-500">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-8 md:p-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Готовы начать?
              </h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
                Свяжитесь с нами прямо сейчас и получите консультацию бесплатно
              </p>
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-slate-100 transition-all hover:scale-105 shadow-lg">
                Связаться
                <SafeIcon name="ArrowRight" size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 md:py-16 border-t border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Лого</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Короткий сайт с минималистичным дизайном для быстрого старта вашего проекта.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Контакты</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-400 text-sm">
                  <SafeIcon name="Mail" size={16} />
                  hello@example.com
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-sm">
                  <SafeIcon name="Phone" size={16} />
                  +7 (999) 123-45-67
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-sm">
                  <SafeIcon name="MapPin" size={16} />
                  Москва, Россия
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Ссылки</h4>
              <ul className="space-y-2">
                {['Главная', 'О нас', 'Контакты'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 Все права защищены
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                Политика конфиденциальности
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}