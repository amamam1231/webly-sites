import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Firebase Configuration - REPLACE WITH YOUR CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB7dK7XyG7v4K7Xy7Xy7Xy7Xy7Xy7Xy7Xy7",
  authDomain: "my-project-12345.firebaseapp.com",
  projectId: "my-project-12345",
  storageBucket: "my-project-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function App() {
  const [habits, setHabits] = useState([])
  const [newHabitName, setNewHabitName] = useState('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits')
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  const addHabit = async (e) => {
    e.preventDefault()
    if (!newHabitName.trim()) return

    try {
      const newHabit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        logs: {},
        createdAt: new Date().toISOString()
      }
      setHabits(prev => [...prev, newHabit])
      setNewHabitName('')
    } catch (error) {
      console.error('Error adding habit:', error)
    }
  }

  const toggleHabit = async (habit) => {
    const today = new Date().toISOString().split('T')[0]
    const newLogs = { ...habit.logs, [today]: !habit.logs?.[today] }

    try {
      await updateDoc(doc(db, 'habits', habit.id), { logs: newLogs })
    } catch (error) {
      console.error('Error updating habit:', error)
    }
  }

  const deleteHabit = async (habitId) => {
    try {
      await deleteDoc(doc(db, 'habits', habitId))
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const getTodayString = () => new Date().toISOString().split('T')[0]

  const calculateStreak = (logs) => {
    if (!logs) return 0
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    let streak = 0
    let checkDate = new Date(today)

    // If not done today, start checking from yesterday
    if (!logs[todayStr]) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (logs[dateStr]) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().split('T')[0])
    }
    return days
  }

  const todayStr = getTodayString()
  const completedToday = habits.filter(h => h.logs?.[todayStr]).length
  const totalHabits = habits.length
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0
  const totalStreak = habits.reduce((sum, h) => sum + calculateStreak(h.logs), 0)

  const last7Days = getLast7Days()
  const chartData = last7Days.map(date => {
    const completed = habits.filter(h => h.logs?.[date]).length
    const total = habits.length || 1
    return {
      date: date.slice(5), // MM-DD
      percent: Math.round((completed / total) * 100)
    }
  })

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SafeIcon name="activity" size={28} className="text-indigo-400" />
            <span className="font-black text-xl tracking-tight">HabitFlow</span>
          </div>

          <div className="flex items-center gap-4">
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <SafeIcon name="flame" size={20} className="text-orange-400" />
              </div>
              <span className="text-slate-400 text-sm font-medium">Дней подряд</span>
            </div>
            <div className="text-3xl font-black">{totalStreak}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <SafeIcon name="trending-up" size={20} className="text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm font-medium">Выполнено сегодня</span>
            </div>
            <div className="text-3xl font-black">{completionRate}%</div>
            <div className="text-sm text-slate-500 mt-1">{completedToday} из {totalHabits}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <SafeIcon name="award" size={20} className="text-indigo-400" />
              </div>
              <span className="text-slate-400 text-sm font-medium">Всего привычек</span>
            </div>
            <div className="text-3xl font-black">{totalHabits}</div>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <SafeIcon name="calendar" size={20} className="text-slate-400" />
            Прогресс за 7 дней
          </h3>

          <div className="h-48 flex items-end justify-between gap-2">
            {chartData.map((day, index) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative h-32 bg-slate-800/50 rounded-t-lg overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${day.percent}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg"
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">{day.date}</span>
                <span className="text-xs font-bold text-slate-300">{day.percent}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Habits List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl">Мои привычки</h3>
            <span className="text-sm text-slate-500">{new Date().toLocaleDateString('ru-RU')}</span>
          </div>

          <AnimatePresence mode="popLayout">
            {habits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800"
              >
                <SafeIcon name="activity" size={48} className="mx-auto mb-4 opacity-20" />
                <p>Добавь свою первую привычку ниже</p>
              </motion.div>
            ) : (
              habits.map((habit, index) => {
                const isDone = habit.logs?.[todayStr]
                const streak = calculateStreak(habit.logs)

                return (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200",
                      isDone
                        ? "bg-indigo-900/20 border-indigo-500/30"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    )}
                  >
                    <button
                      onClick={() => toggleHabit(habit)}
                      className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                        isDone
                          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                          : "bg-slate-800 text-slate-600 hover:bg-slate-700"
                      )}
                    >
                      <SafeIcon name="check" size={24} className={isDone ? "text-white" : "text-slate-500"} />
                    </button>

                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        "font-semibold text-lg truncate transition-colors",
                        isDone ? "text-indigo-200 line-through opacity-60" : "text-slate-200"
                      )}>
                        {habit.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        {streak > 0 && (
                          <span className="flex items-center gap-1 text-xs font-medium text-orange-400">
                            <SafeIcon name="flame" size={12} />
                            {streak} дней
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 hover:text-red-400 text-slate-600 rounded-lg transition-all"
                    >
                      <SafeIcon name="trash" size={18} />
                    </button>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </motion.div>

        {/* Add Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onSubmit={addHabit}
          className="flex gap-3 sticky bottom-6 bg-slate-950/80 backdrop-blur-md p-2 rounded-2xl border border-slate-800"
        >
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Новая привычка..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={!newHabitName.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 rounded-xl transition-colors flex items-center gap-2"
          >
            <SafeIcon name="plus" size={20} />
            <span className="hidden sm:inline">Добавить</span>
          </button>
        </motion.form>
      </main>
    </div>
  )
}