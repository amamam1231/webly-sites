import { motion } from 'framer-motion'

function App() {
  const handleClick = () => {
    window.open('https://t.me/MatveIIuechenko', '_blank')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className="w-[280px] h-[70px] md:w-[300px] md:h-[80px] bg-[#3498db] hover:bg-[#2980b9] text-white font-bold text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center"
      >
        Записаться на приём
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 text-gray-400 text-sm md:text-base"
      >
        Нажмите кнопку, чтобы записаться
      </motion.p>
    </div>
  )
}

export default App