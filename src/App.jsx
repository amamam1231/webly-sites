import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'

function App() {
  const handleBooking = () => {
    window.open('https://calendly.com', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight text-center">
            Запись на приём
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/30"
          >
            <Calendar className="w-12 h-12 text-white" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed"
          >
            Выберите удобное время для вашего визита. Мы подберём лучший слот специально для вас.
          </motion.p>

          {/* Main CTA Button */}
          <motion.button
            onClick={handleBooking}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl md:text-2xl px-8 py-6 md:py-8 rounded-2xl shadow-xl shadow-blue-600/20 transition-colors duration-200 flex items-center justify-center gap-3 min-h-[72px] md:min-h-[80px] touch-manipulation"
          >
            <span>Записаться сейчас</span>
            <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
          </motion.button>

          {/* Secondary info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-slate-400"
          >
            Быстро и удобно • Подтверждение за минуту
          </motion.p>
        </motion.div>
      </main>

      {/* Footer hint */}
      <footer className="telegram-safe-bottom w-full bg-white/50 border-t border-slate-200/50">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm md:text-base text-slate-500 font-medium">
            Нажмите кнопку, чтобы записаться
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App