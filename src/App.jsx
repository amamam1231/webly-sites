import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Shield, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function App() {
  const [settings, setSettings] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setIsLoaded(true)
      })
      .catch(() => {
        setIsLoaded(true)
      })
  }, [])

  if (!isLoaded) {
    return <div className="min-h-screen bg-slate-950" />
  }

  const showFeatures = settings.show_features !== false
  const ctaLink = settings.cta_link || '#contact'

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Block 1: Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8"
          >
            <SafeIcon name="sparkles" size={16} />
            <span>Новое поколение решений</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Простота.<br />Мощь. Результат.
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Минималистичный подход к максимальным результатам. Два блока — бесконечные возможности для вашего бизнеса.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href={ctaLink}
              onClick={(e) => {
                if (ctaLink.startsWith('#')) {
                  e.preventDefault()
                  document.querySelector(ctaLink)?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold text-white transition-colors shadow-lg shadow-blue-600/25"
            >
              <span>Начать сейчас</span>
              <SafeIcon name="arrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <motion.a
              href="#features"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 rounded-full font-semibold text-white transition-colors border border-slate-700"
            >
              <span>Узнать больше</span>
              <SafeIcon name="chevronRight" size={20} />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Block 2: Features */}
      {showFeatures && (
        <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
                Всё, что нужно
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Два блока — полный функционал. Без лишнего.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: "zap",
                  title: "Молниеносная скорость",
                  description: "Оптимизированный код и ресурсы для мгновенной загрузки на любом устройстве."
                },
                {
                  icon: "shield",
                  title: "Надёжность",
                  description: "Современные стандарты безопасности и стабильная работа 24/7 без сбоев."
                },
                {
                  icon: "sparkles",
                  title: "Элегантность",
                  description: "Минималистичный дизайн, который подчёркивает ваш контент без отвлечений."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                    <SafeIcon name={feature.icon} size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 text-center"
            >
              <motion.a
                href={ctaLink}
                onClick={(e) => {
                  if (ctaLink.startsWith('#')) {
                    e.preventDefault()
                    document.querySelector(ctaLink)?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold text-white transition-colors shadow-lg shadow-blue-600/25"
              >
                <span>Начать сейчас</span>
                <SafeIcon name="arrowRight" size={20} />
              </motion.a>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 Минимал. Все права защищены.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Политика</a>
            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App