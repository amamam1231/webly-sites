import { SafeIcon } from './components/SafeIcon';
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Brain,
  Eye,
  Heart,
  Sparkles,
  X,
  CheckCircle2,
  HelpCircle
} from 'lucide-react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const translations = {
  en: {
    title: "World's Rarest Animals",
    subtitle: "Discover the most endangered creatures on Earth",
    gallery: "Neon Gallery",
    galleryDesc: "10 unique species on the brink of extinction",
    quiz: "Expert Quiz",
    quizDesc: "Test your knowledge with 10 challenging questions",
    startQuiz: "Start Challenge",
    question: "Question",
    of: "of",
    next: "Next",
    prev: "Previous",
    submit: "Submit Answer",
    finish: "Finish Quiz",
    score: "Your Score",
    correct: "Correct",
    wrong: "Wrong",
    tryAgain: "Try Again",
    langLabel: "EN",
    explore: "Explore",
    discover: "Discover",
    learn: "Learn More",
    footer: "Protecting wildlife for future generations",
    animals: [
      { name: "Axolotl", desc: "Mexican walking fish with regenerative powers", fact: "Can regenerate entire limbs" },
      { name: "Okapi", desc: "Forest giraffe with zebra-striped legs", fact: "Found only in Congo rainforest" },
      { name: "Pangolin", desc: "Scaly anteater, most trafficked mammal", fact: "Rolls into ball when threatened" },
      { name: "Saiga", desc: "Antelope with distinctive trunk nose", fact: "Nose filters dust and warms air" },
      { name: "Blobfish", desc: "Deep-sea fish with gelatinous body", fact: "Looks different under pressure" },
      { name: "Aye-aye", desc: "Nocturnal lemur with long finger", fact: "Uses finger to dig for grubs" },
      { name: "Fossa", desc: "Madagascar's top predator", fact: "Can leap between trees" },
      { name: "Narwhal", desc: "Unicorn of the sea with spiral tusk", fact: "Tusk is actually a tooth" },
      { name: "Kakapo", desc: "Flightless parrot from New Zealand", fact: "World's heaviest parrot" },
      { name: "Vaquita", desc: "World's rarest marine mammal", fact: "Only 10 individuals remain" }
    ],
    quizQuestions: [
      { q: "Which animal can regenerate entire limbs?", options: ["Axolotl", "Starfish", "Octopus", "Gecko"], correct: 0 },
      { q: "What is the narwhal's tusk actually made of?", options: ["Bone", "Ivory", "Tooth", "Cartilage"], correct: 2 },
      { q: "Where is the Okapi found?", options: ["Amazon", "Congo", "Madagascar", "Borneo"], correct: 1 },
      { q: "Which is the world's heaviest parrot?", options: ["Macaw", "Kakapo", "Cockatoo", "Kea"], correct: 1 },
      { q: "How many Vaquitas remain in the wild?", options: ["1000", "100", "50", "10"], correct: 3 },
      { q: "What does the Saiga's nose do?", options: ["Filters dust", "Detects prey", "Makes sound", "Stores water"], correct: 0 },
      { q: "Which animal is the most trafficked mammal?", options: ["Tiger", "Pangolin", "Elephant", "Rhino"], correct: 1 },
      { q: "Where is the Fossa from?", options: ["Madagascar", "Australia", "India", "Brazil"], correct: 0 },
      { q: "What makes the Aye-aye unique?", options: ["Long finger", "Big eyes", "Striped tail", "Webbed feet"], correct: 0 },
      { q: "At what depth does Blobfish live?", options: ["100m", "500m", "1000m", "3000m"], correct: 3 }
    ]
  },
  ru: {
    title: "Самые редкие животные мира",
    subtitle: "Откройте для себя самых исчезающих существ на Земле",
    gallery: "Неоновая галерея",
    galleryDesc: "10 уникальных видов на грани исчезновения",
    quiz: "Эксперт-викторина",
    quizDesc: "Проверьте свои знания с 10 сложными вопросами",
    startQuiz: "Начать испытание",
    question: "Вопрос",
    of: "из",
    next: "Далее",
    prev: "Назад",
    submit: "Ответить",
    finish: "Завершить",
    score: "Ваш счет",
    correct: "Правильно",
    wrong: "Неправильно",
    tryAgain: "Попробовать снова",
    langLabel: "RU",
    explore: "Исследовать",
    discover: "Открыть",
    learn: "Узнать больше",
    footer: "Защита дикой природы для будущих поколений",
    animals: [
      { name: "Аксолотль", desc: "Мексиканская ходячая рыба с регенерацией", fact: "Может регенерировать конечности" },
      { name: "Окапи", desc: "Лесной жираф с полосатыми ногами", fact: "Обитает только в Конго" },
      { name: "Панголин", desc: "Чешуйчатый муравьед, самый контрабандный", fact: "Сворачивается в клубок при опасности" },
      { name: "Сайга", desc: "Антилопа с хоботком", fact: "Нос фильтрует пыль и согревает воздух" },
      { name: "Рыба-капля", desc: "Глубоководная рыба с желеобразным телом", fact: "Выглядит иначе под давлением" },
      { name: "Ай-ай", desc: "Ночной лемур с длинным пальцем", fact: "Использует палец для добычи личинок" },
      { name: "Фосса", desc: "Главный хищник Мадагаскара", fact: "Может прыгать между деревьями" },
      { name: "Нарвал", desc: "Морской единорог со спиральным бивнем", fact: "Бивень — это на самом деле зуб" },
      { name: "Какапо", desc: "Нелетающий попугай из Новой Зеландии", fact: "Самый тяжелый попугай в мире" },
      { name: "Вакита", desc: "Самое редкое морское млекопитающее", fact: "Осталось всего 10 особей" }
    ],
    quizQuestions: [
      { q: "Какое животное может регенерировать конечности?", options: ["Аксолотль", "Морская звезда", "Осьминог", "Геккон"], correct: 0 },
      { q: "Из чего состоит бивень нарвала?", options: ["Кость", "Слоновая кость", "Зуб", "Хрящ"], correct: 2 },
      { q: "Где обитает окапи?", options: ["Амазонка", "Конго", "Мадагаскар", "Борнео"], correct: 1 },
      { q: "Какой самый тяжелый попугай?", options: ["Ара", "Какапо", "Какаду", "Кеа"], correct: 1 },
      { q: "Сколько вакит осталось в дикой природе?", options: ["1000", "100", "50", "10"], correct: 3 },
      { q: "Что делает нос сайги?", options: ["Фильтрует пыль", "Ищет добычу", "Издает звуки", "Хранит воду"], correct: 0 },
      { q: "Какое животное чаще всего контрабандят?", options: ["Тигр", "Панголин", "Слон", "Носорог"], correct: 1 },
      { q: "Откуда родом фосса?", options: ["Мадагаскар", "Австралия", "Индия", "Бразилия"], correct: 0 },
      { q: "Что уникального у ай-ай?", options: ["Длинный палец", "Большие глаза", "Полосатый хвост", "Плавники"], correct: 0 },
      { q: "На какой глубине живет рыба-капля?", options: ["100м", "500м", "1000м", "3000м"], correct: 3 }
    ]
  }
}

const animalImages = [
  "https://images.unsplash.com/photo-1545590808-9b7f0d77f464?w=600&q=80",
  "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=600&q=80",
  "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&q=80",
  "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=600&q=80",
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
  "https://images.unsplash.com/photo-1516934024742-b461fba47600?w=600&q=80",
  "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=600&q=80",
  "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=600&q=80",
  "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&q=80",
  "https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_415948898/user-photo-1.jpg"
]

function App() {
  const [lang, setLang] = useState('en')
  const [activeSection, setActiveSection] = useState('gallery')
  const [quizState, setQuizState] = useState({
    active: false,
    currentQuestion: 0,
    score: 0,
    answers: [],
    showResults: false
  })
  const [selectedAnimal, setSelectedAnimal] = useState(null)

  const t = translations[lang]

  const startQuiz = () => {
    setQuizState({
      active: true,
      currentQuestion: 0,
      score: 0,
      answers: [],
      showResults: false
    })
  }

  const answerQuestion = (optionIndex) => {
    const isCorrect = optionIndex === t.quizQuestions[quizState.currentQuestion].correct
    const newAnswers = [...quizState.answers, { question: quizState.currentQuestion, correct: isCorrect, selected: optionIndex }]

    if (quizState.currentQuestion < t.quizQuestions.length - 1) {
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion + 1,
        score: isCorrect ? quizState.score + 1 : quizState.score,
        answers: newAnswers
      })
    } else {
      setQuizState({
        ...quizState,
        score: isCorrect ? quizState.score + 1 : quizState.score,
        answers: newAnswers,
        showResults: true
      })
    }
  }

  const resetQuiz = () => {
    setQuizState({
      active: false,
      currentQuestion: 0,
      score: 0,
      answers: [],
      showResults: false
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/30"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              RARE
            </span>
          </motion.div>

          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => setActiveSection('gallery')}
              className={cn(
                "text-sm font-medium transition-all hover:text-cyan-400",
                activeSection === 'gallery' ? "text-cyan-400 neon-text-cyan" : "text-gray-300"
              )}
            >
              {t.gallery}
            </button>
            <button
              onClick={() => setActiveSection('quiz')}
              className={cn(
                "text-sm font-medium transition-all hover:text-pink-400",
                activeSection === 'quiz' ? "text-pink-400 neon-text-pink" : "text-gray-300"
              )}
            >
              {t.quiz}
            </button>
          </nav>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
          >
            <SafeIcon name="Globe" size={16} className="text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">{t.langLabel}</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 neon-text-cyan">
                {t.title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              {t.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection('gallery')}
                className="px-8 py-4 bg-cyan-500/20 border border-cyan-400 rounded-full text-cyan-400 font-semibold hover:bg-cyan-500/30 transition-all neon-border-cyan"
              >
                {t.explore}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection('quiz')}
                className="px-8 py-4 bg-pink-500/20 border border-pink-400 rounded-full text-pink-400 font-semibold hover:bg-pink-500/30 transition-all neon-border-pink"
              >
                {t.startQuiz}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      {activeSection === 'gallery' && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="py-20 px-4"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400 neon-text-cyan">
                {t.gallery}
              </h2>
              <p className="text-gray-400 text-lg">{t.galleryDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {t.animals.map((animal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedAnimal(index)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl cursor-pointer",
                    "bg-slate-900/50 border border-cyan-500/30",
                    "hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20",
                    "transition-all duration-300"
                  )}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={animalImages[index]}
                      alt={animal.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-60" />
                  </div>
                  <div className="p-6 relative">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {animal.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {animal.desc}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <SafeIcon name="Eye" size={16} />
                      <span>{t.learn}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 text-xs font-bold">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Animal Detail Modal */}
      <AnimatePresence>
        {selectedAnimal !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAnimal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-cyan-500/50 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl shadow-cyan-500/20"
            >
              <div className="relative aspect-video">
                <img
                  src={animalImages[selectedAnimal]}
                  alt={t.animals[selectedAnimal].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <button
                  onClick={() => setSelectedAnimal(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <SafeIcon name="X" size={20} />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-3xl font-bold text-white neon-text-cyan">
                    {t.animals[selectedAnimal].name}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 text-lg mb-4">{t.animals[selectedAnimal].desc}</p>
                <div className="flex items-start gap-3 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                  <SafeIcon name="Sparkles" size={24} className="text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-1">{lang === 'en' ? 'Amazing Fact' : 'Удивительный факт'}</h4>
                    <p className="text-gray-300">{t.animals[selectedAnimal].fact}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Section */}
      {activeSection === 'quiz' && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="py-20 px-4 min-h-screen"
        >
          <div className="container mx-auto max-w-4xl">
            {!quizState.active ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/50">
                  <SafeIcon name="Brain" size={48} className="text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-pink-400 neon-text-pink">
                  {t.quiz}
                </h2>
                <p className="text-gray-400 text-xl mb-8 max-w-lg mx-auto">
                  {t.quizDesc}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startQuiz}
                  className="px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold text-lg shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70 transition-all"
                >
                  {t.startQuiz}
                </motion.button>
              </motion.div>
            ) : quizState.showResults ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel rounded-3xl p-8 md:p-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <SafeIcon name="Trophy" size={40} className="text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  {t.score}
                </h2>
                <div className="text-6xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {quizState.score} / {t.quizQuestions.length}
                </div>
                <div className="grid grid-cols-5 gap-2 mb-8 max-w-md mx-auto">
                  {quizState.answers.map((ans, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "aspect-square rounded-lg flex items-center justify-center text-lg font-bold",
                        ans.correct ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" : "bg-red-500/20 text-red-400 border border-red-500/50"
                      )}
                    >
                      {ans.correct ? <SafeIcon name="CheckCircle2" size={20} /> : <SafeIcon name="X" size={20} />}
                    </div>
                  ))}
                </div>
                <p className="text-gray-300 mb-8 text-lg">
                  {quizState.score >= 8 ? (lang === 'en' ? 'Incredible! You are an expert!' : 'Невероятно! Вы эксперт!') :
                   quizState.score >= 5 ? (lang === 'en' ? 'Good job! Keep learning!' : 'Хорошая работа! Продолжайте учиться!') :
                   (lang === 'en' ? 'Keep exploring rare animals!' : 'Продолжайте изучать редких животных!')}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetQuiz}
                  className="px-8 py-4 bg-cyan-500/20 border border-cyan-400 rounded-full text-cyan-400 font-semibold hover:bg-cyan-500/30 transition-all"
                >
                  {t.tryAgain}
                </motion.button>
              </motion.div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-gray-400">
                    {t.question} {quizState.currentQuestion + 1} {t.of} {t.quizQuestions.length}
                  </span>
                  <div className="flex gap-1">
                    {t.quizQuestions.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "w-8 h-2 rounded-full transition-all",
                          idx < quizState.currentQuestion ? "bg-cyan-400" :
                          idx === quizState.currentQuestion ? "bg-pink-400 w-12" : "bg-gray-700"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <motion.div
                  key={quizState.currentQuestion}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="glass-panel rounded-3xl p-8 mb-6"
                >
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-400/50 flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="HelpCircle" size={24} className="text-pink-400" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                      {t.quizQuestions[quizState.currentQuestion].q}
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    {t.quizQuestions[quizState.currentQuestion].options.map((option, optIdx) => (
                      <motion.button
                        key={optIdx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => answerQuestion(optIdx)}
                        className="w-full p-4 text-left rounded-xl border border-gray-700 bg-slate-800/50 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full border-2 border-gray-600 group-hover:border-cyan-400 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-cyan-400 transition-colors">
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="text-gray-200 group-hover:text-white font-medium">
                            {option}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 bg-slate-950 py-12 px-4 mt-20">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-pink-500 animate-pulse" />
            <span className="text-gray-400">{t.footer}</span>
            <Heart className="w-5 h-5 text-pink-500 animate-pulse" />
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 Rare Animals Gallery. Neon Edition.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App