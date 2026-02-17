import { SafeIcon } from './components/SafeIcon\';
import { motion } from \'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

function App() {
  const featuresRef = useRef(null)
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" })

  const ctaRef = useRef(null)
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" })

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const features = [
    {
      icon: 'zap',
      title: 'Молниеносная скорость',
      description: 'Оптимизированный код и ресурсы для мгновенной загрузки страницы'
    },
    {
      icon: 'smartphone',
      title: 'Адаптивный дизайн',
      description: 'Идеальное отображение на любых устройствах — от телефона до десктопа'
    },
    {
      icon: 'trending-up',
      title: 'Высокая конверсия',
      description: 'Продуманная структура и призывы к действию для максимального результата'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-white">Landing</span>
          </div>
          <button
            onClick={() => scrollToSection('cta')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Начать
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium mb-6">
              Минимализм в деталях
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              Создайте свой{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                идеальный
              </span>{' '}
              лендинг
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Простой, быстрый и эффективный инструмент для привлечения клиентов.
              Без лишних сложностей — только результат.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => scrollToSection(\'cta')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-600/25 active:scale-95"
              >
                Начать бесплатно
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-slate-700 hover:border-slate-600"
              >
                Узнать больше
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 md:mt-20"
          >
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-30" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-2 md:p-4">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
                  alt="Dashboard Preview"
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="py-20 md:py-32 px-4 md:px-6 bg-slate-900/50"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Почему мы?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Всё необходимое для успешного запуска вашего проекта
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <SafeIcon name={feature.icon} className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        ref={ctaRef}
        className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 to-purple-600/10" />
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isCtaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Готовы начать?
            </h2>
            <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам довольных пользователей.
              Создайте свой лендинг за считанные минуты.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-600/25 active:scale-95 min-h-[44px] min-w-[44px]">
              Создать лендинг
            </button>
            <p className="text-slate-500 text-sm mt-4">
              Бесплатно • Без регистрации • Без компромиссов
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 border-t border-slate-800 telegram-safe-bottom">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">L</span>
              </div>
              <span className="text-slate-300 font-semibold">Landing</span>
            </div>
            <div className="text-slate-500 text-sm">
              © 2024 Landing. Все права защищены.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App