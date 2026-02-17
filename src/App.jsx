import { SafeIcon } from './components/SafeIcon';
import { motion } from 'framer-motion'
import { Zap, Shield, Rocket, ArrowRight, Check } from 'lucide-react'

function App() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: true }
  }

  const features = [
    {
      icon: 'zap',
      title: 'Быстрая работа',
      description: '
    },
    {
      icon: 'shield',
      title: 'Надёжность',
      description: '
    },
    {
      icon: 'rocket',
      title: 'Масштабируемость',
      description: '
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-800/50">
        <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">L</span>
            </div>
            <span className="text-xl font-bold">Logo</span>
          </div>
          <button
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-all text-sm md:text-base"
          >
            Начать
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
              Создаём цифровые{' '
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                решения
              </span>{' '
              будущего
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Минималистичный подход к созданию современных веб-приложений.
              Быстро, красиво, эффективно.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2 min-h-[56px]"
              >
                Узнать больше
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all border border-slate-700 min-h-[56px]"
              >
                Демо
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Почему <span className="text-blue-500">выбирают нас</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Три ключевых преимущества, которые делают нас лучшим выбором
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-all group"
              >
                <div className="bg-blue-600/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-colors">
                  <SafeIcon name={feature.icon} className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80')] opacity-10 bg-cover bg-center" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                Готовы начать?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
                Присоединяйтесь к тысячам довольных пользователей.
                Начните бесплатно прямо сейчас.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <Check className="w-5 h-5" />
                  <span>Бесплатный старт</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <Check className="w-5 h-5" />
                  <span>Без карты</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <Check className="w-5 h-5" />
                  <span>Отмена в любой момент</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-lg"
              >
                Начать бесплатно
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 md:px-6 telegram-safe-bottom">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="font-bold text-white text-sm">L</span>
              </div>
              <span className="font-bold text-slate-300">Logo</span>
            </div>
            <div className="text-slate-500 text-sm">
              © 2024 Все права защищены
            </div>
            <div className="flex gap-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Политика</a>
              <a href="#" className="hover:text-white transition-colors">Условия</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App