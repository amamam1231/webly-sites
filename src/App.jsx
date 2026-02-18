import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Plus,
  Trash2,
  Check,
  Calendar,
  TrendingUp,
  Target,
  Edit2,
  X,
  Save,
  RotateCcw
} from 'lucide-react'

// Utility for class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Get today's date string
const getTodayString = () => {
  return new Date().toISOString().split('T')[0]
}

// Get dates for last 7 days
const getLast7Days = () => {
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

export default function App() {
  const [habits, setHabits] = useState([])
  const [newHabitName, setNewHabitName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('habits')
    if (saved) {
      try {
        setHabits(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse habits:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever habits change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('habits', JSON.stringify(habits))
    }
  }, [habits, isLoaded])

  const addHabit = (e) => {
    e.preventDefault()
    if (!newHabitName.trim()) return

    const newHabit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      createdAt: getTodayString(),
      completedDates: [],
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }

    setHabits([...habits, newHabit])
    setNewHabitName('')
  }

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id))
  }

  const toggleHabit = (id, date) => {
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit

      const isCompleted = habit.completedDates.includes(date)
      return {
        ...habit,
        completedDates: isCompleted
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date]
      }
    }))
  }

  const startEdit = (habit) => {
    setEditingId(habit.id)
    setEditName(habit.name)
  }

  const saveEdit = () => {
    if (!editName.trim()) return
    setHabits(habits.map(h =>
      h.id === editingId ? { ...h, name: editName.trim() } : h
    ))
    setEditingId(null)
    setEditName('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const resetHabit = (id) => {
    setHabits(habits.map(h =>
      h.id === id ? { ...h, completedDates: [] } : h
    ))
  }

  // Calculate statistics
  const getHabitStats = (habit) => {
    const last7Days = getLast7Days()
    const completedInLast7 = last7Days.filter(date =>
      habit.completedDates.includes(date)
    ).length

    const totalDays = Math.max(1, Math.floor(
      (new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)
    ) + 1)

    const totalCompleted = habit.completedDates.length
    const completionRate = Math.round((totalCompleted / totalDays) * 100)
    const weeklyRate = Math.round((completedInLast7 / 7) * 100)

    return { completedInLast7, totalCompleted, completionRate, weeklyRate, totalDays }
  }

  const getOverallStats = () => {
    if (habits.length === 0) return { total: 0, completed: 0, rate: 0 }

    const last7Days = getLast7Days()
    let totalChecks = 0
    let completedChecks = 0

    habits.forEach(habit => {
      last7Days.forEach(date => {
        totalChecks++
        if (habit.completedDates.includes(date)) {
          completedChecks++
        }
      })
    })

    return {
      total: totalChecks,
      completed: completedChecks,
      rate: totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0
    }
  }

  const overallStats = getOverallStats()
  const last7Days = getLast7Days()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <SafeIcon name="RotateCcw" size={32} className="text-blue-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <SafeIcon name="Target" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Habit Tracker</h1>
                <p className="text-xs text-slate-400">Трекер привычек</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <SafeIcon name="Calendar" size={16} />
              <span>{new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 pt-24">
        {/* Stats Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <SafeIcon name="Target" size={16} className="text-blue-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wider">Привычек</span>
              </div>
              <p className="text-2xl font-bold text-white">{habits.length}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <SafeIcon name="Check" size={16} className="text-emerald-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wider">Выполнено</span>
              </div>
              <p className="text-2xl font-bold text-white">{overallStats.completed}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <SafeIcon name="TrendingUp" size={16} className="text-purple-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wider">Успех</span>
              </div>
              <p className="text-2xl font-bold text-white">{overallStats.rate}%</p>
            </div>
          </div>
        </motion.section>

        {/* Add Habit Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <form onSubmit={addHabit} className="glass rounded-2xl p-4 flex gap-3">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Добавить новую привычку..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={!newHabitName.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-medium flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <SafeIcon name="Plus" size={18} />
              <span className="hidden sm:inline">Добавить</span>
            </button>
          </form>
        </motion.section>

        {/* Habits List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <SafeIcon name="Calendar" size={18} className="text-slate-400" />
            Мои привычки
          </h2>

          {habits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <SafeIcon name="Target" size={32} className="text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Нет привычек</h3>
              <p className="text-slate-400 text-sm">Добавьте свою первую привычку выше</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {habits.map((habit, index) => {
                  const stats = getHabitStats(habit)
                  const isEditing = editingId === habit.id

                  return (
                    <motion.div
                      key={habit.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass rounded-2xl p-4 sm:p-6"
                    >
                      {/* Habit Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEdit()
                                  if (e.key === 'Escape') cancelEdit()
                                }}
                              />
                              <button
                                onClick={saveEdit}
                                className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-colors"
                              >
                                <SafeIcon name="Save" size={16} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                              >
                                <SafeIcon name="X" size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-white truncate">
                                {habit.name}
                              </h3>
                              <button
                                onClick={() => startEdit(habit)}
                                className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                style={{ opacity: '0.6' }}
                              >
                                <SafeIcon name="Edit2" size={14} />
                              </button>
                            </div>
                          )}

                          {!isEditing && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <SafeIcon name="TrendingUp" size={12} />
                                {stats.completionRate}% всего времени
                              </span>
                              <span className="flex items-center gap-1">
                                <SafeIcon name="Check" size={12} />
                                {stats.totalCompleted} выполнено
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => resetHabit(habit.id)}
                            className="p-2 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                            title="Сбросить прогресс"
                          >
                            <SafeIcon name="RotateCcw" size={16} />
                          </button>
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Удалить"
                          >
                            <SafeIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Weekly Progress */}
                      <div className="flex items-center gap-2">
                        {last7Days.map((date, dayIndex) => {
                          const isCompleted = habit.completedDates.includes(date)
                          const dayName = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][new Date(date).getDay()]
                          const isToday = date === getTodayString()

                          return (
                            <button
                              key={date}
                              onClick={() => toggleHabit(habit.id, date)}
                              className={cn(
                                "flex-1 aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all",
                                isCompleted
                                  ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                                  : "bg-white/5 border border-white/10 text-slate-500 hover:bg-white/10",
                                isToday && !isCompleted && "border-blue-500/50 text-blue-400 ring-1 ring-blue-500/30"
                              )}
                            >
                              <span className="text-[10px] uppercase">{dayName}</span>
                              <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                                isCompleted ? "bg-emerald-500 text-white" : "bg-white/10"
                              )}>
                                {isCompleted && <SafeIcon name="Check" size={12} />}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                          <span>Прогресс за 7 дней</span>
                          <span>{stats.weeklyRate}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.weeklyRate}%` }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.section>

        {/* Overall Progress */}
        {habits.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 glass rounded-2xl p-6"
          >
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              Общий прогресс за неделю
            </h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-white">{overallStats.rate}%</span>
              <span className="text-slate-400 mb-1">выполнено</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallStats.rate}%` }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full"
              />
            </div>
            <p className="mt-3 text-sm text-slate-400">
              {overallStats.completed} из {overallStats.total} возможных отметок
            </p>
          </motion.section>
        )}
      </main>
    </div>
  )
}