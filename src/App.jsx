import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Shield, ArrowRight } from 'lucide-react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function App() {
  const [clicked, setClicked] = useState(false)

  const features = [
    { icon: Zap, title: 'Быстрый', desc: 'Мгновенная загрузка страниц' },
    { icon: Shield, title: 'Надёжный', desc: 'Стабильная работа 24/7' },
    { icon: Sparkles, title: 'Красивый', desc: 'Чистый минималистичный дизайн' },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg">Logo</span>
          <nav className="hidden sm:flex gap-6 text-sm">
            <a href="#about" className="hover:text-blue-600 transition-colors">О нас</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Возможности</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl font-black tracking-tight mb-6"
          >
            Просто. Быстро. Эффективно.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 mb-8 max-w-lg mx-auto"
          >
            Минималистичный сайт без лишних сложностей. Идеально для быстрого старта.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setClicked(!clicked)}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all",
              clicked
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
            )}
          >
            {clicked ? 'Готово!' : 'Начать'}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="container mx-auto max-w-4xl text-center text-sm text-gray-500">
          © 2024 Минималистичный сайт. Все права защищены.
        </div>
      </footer>
    </div>
  )
}

export default App