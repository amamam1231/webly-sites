import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Flame,
  Droplets,
  BookOpen,
  Dumbbell,
  Moon,
  Sun,
  Heart,
  Brain,
  Target,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const ICONS = {
  flame: Flame,
  droplets: Droplets,
  book: BookOpen,
  dumbbell: Dumbbell,
  moon: Moon,
  sun: Sun,
  heart: Heart,
  brain: Brain,
  target: Target
}

const COLORS = [
  { name: 'red', bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-500', light: 'bg-red-500/20' },
  { name: 'orange', bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', light: 'bg-orange-500/20' },
  { name: 'amber', bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-500', light: 'bg-amber-500/20' },
  { name: 'green', bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-500/20' },
  { name: 'teal', bg: 'bg-teal-500', border: 'border-teal-500', text: 'text-teal-500', light: 'bg-teal-500/20' },
  { name: 'blue', bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500', light: 'bg-blue-500/20' },
  { name: 'indigo', bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-500/20' },
  { name: 'purple', bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-500', light: 'bg-purple-500/20' },
  { name: 'pink', bg: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-500', light: 'bg-pink-500/20' },
  { name: 'rose', bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-500', light: 'bg-rose-500/20' }
]

const FREQUENCIES = [
  { value: 'daily', label: 'Ежедневно' },
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'custom', label: 'Пользовательское' }
]

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

function getWeekKey() {
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  return startOfWeek.toISOString().split('T')[0]
}

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

function App() {
  const [habits, setHabits] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('habits')
    if (saved) {
      try {
        setHabits(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse habits', e)
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('habits', JSON.stringify(habits))
    }
  }, [habits, mounted])

  const today = getTodayKey()
  const weekKey = getWeekKey()

  const todayStats = habits.filter(h => {
    const completions = h.completions || {}
    return completions[today]
  }).length

  const weekStats = habits.reduce((acc, habit) => {
    const completions = habit.completions || {}
    let weekCount = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      if (completions[key]) weekCount++
    }
    return acc + weekCount
  }, 0)

  const totalCompletions = habits.reduce((acc, habit) => {
    const completions = habit.completions || {}
    return acc + Object.keys(completions).length
  }, 0)

  const toggleHabit = (habitId) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit
      const completions = { ...habit.completions }
      if (completions[today]) {
        delete completions[today]
      } else {
        completions[today] = true
      }
      return { ...habit, completions }
    }))
  }

  const deleteHabit = (habitId) => {
    if (confirm('Удалить привычку?')) {
      setHabits(prev => prev.filter(h => h.id !== habitId))
    }
  }

  const saveHabit = (habitData) => {
    if (editingHabit) {
      setHabits(prev => prev.map(h =>
        h.id === editingHabit.id ? { ...h, ...habitData } : h
      ))
    } else {
      const newHabit = {
        id: generateId(),
        ...habitData,
        completions: {},
        createdAt: new Date().toISOString()
      }
      setHabits(prev => [...prev, newHabit])
    }
    setIsModalOpen(false)
    setEditingHabit(null)
  }

  const openEditModal = (habit) => {
    setEditingHabit(habit)
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    setEditingHabit(null)
    setIsModalOpen(true)
  }

  const filteredHabits = habits.filter(habit => {
    if (activeTab === 'completed') {
      const completions = habit.completions || {}
      return completions[today]
    }
    if (activeTab === 'pending') {
      const completions = habit.completions || {}
      return !completions[today]
    }
    return true
  })

  const getStreak = (habit) => {
    const completions = habit.completions || {}
    let streak = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().split('T')[0]
      if (completions[key]) {
        streak++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  const getWeeklyProgress = (habit) => {
    const completions = habit.completions || {}
    let count = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      if (completions[key]) count++
    }
    return count
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">HabitFlow</h1>
                <p className="text-xs text-slate-400">Трекер привычек</p>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Новая привычка</span>
              <span className="sm:hidden">Новая</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Сегодня выполнено</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {todayStats} <span className="text-lg text-slate-500">/ {habits.length}</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">За неделю</p>
                <p className="text-3xl font-bold text-white mt-1">{weekStats}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Всего выполнений</p>
                <p className="text-3xl font-bold text-white mt-1">{totalCompletions}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {[
            { id: 'all', label: 'Все', count: habits.length },
            { id: 'completed', label: 'Выполнено', count: habits.filter(h => (h.completions || {})[today]).length },
            { id: 'pending', label: 'В процессе', count: habits.filter(h => !(h.completions || {})[today]).length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center mb-4">
              <Plus className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Нет привычек</h3>
            <p className="text-slate-400 mb-6">Создайте свою первую привычку и начните отслеживать прогресс</p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              Создать привычку
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredHabits.map((habit, index) => {
                const color = COLORS.find(c => c.name === habit.color) || COLORS[0]
                const Icon = ICONS[habit.icon] || Target
                const isCompleted = (habit.completions || {})[today]
                const streak = getStreak(habit)
                const weeklyProgress = getWeeklyProgress(habit)

                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group relative bg-slate-900 border rounded-2xl p-5 transition-all duration-300",
                      isCompleted ? "border-slate-800" : "border-slate-800 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300", color.light)}>
                        <Icon className={cn("w-6 h-6", color.text)} />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(habit)}
                          className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1">{habit.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {FREQUENCIES.find(f => f.value === habit.frequency)?.label || 'Ежедневно'}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Flame className={cn("w-4 h-4", streak > 0 ? "text-orange-500" : "text-slate-600")} />
                        <span className={streak > 0 ? "text-orange-500 font-medium" : "text-slate-500"}>
                          {streak} дней
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-500">{weeklyProgress}/7 неделя</span>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-4">
                      {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
                        const d = new Date()
                        d.setDate(d.getDate() - (6 - dayOffset))
                        const key = d.toISOString().split('T')[0]
                        const isDone = (habit.completions || {})[key]
                        return (
                          <div
                            key={dayOffset}
                            className={cn(
                              "flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all",
                              isDone
                                ? cn(color.bg, "text-white")
                                : "bg-slate-800 text-slate-600"
                            )}
                          >
                            {d.toLocaleDateString('ru', { weekday: 'narrow' })}
                          </div>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={cn(
                        "w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2",
                        isCompleted
                          ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          : cn(color.bg, "text-white hover:opacity-90 hover:scale-[1.02]")
                      )}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="w-5 h-5" />
                          Выполнено
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Отметить
                        </>
                      )}
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <HabitModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setEditingHabit(null)
            }}
            onSave={saveHabit}
            initialData={editingHabit}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function HabitModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState(initialData?.name || '')
  const [selectedColor, setSelectedColor] = useState(initialData?.color || 'indigo')
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icon || 'target')
  const [frequency, setFrequency] = useState(initialData?.frequency || 'daily')
  const [target, setTarget] = useState(initialData?.target || 1)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      color: selectedColor,
      icon: selectedIcon,
      frequency,
      target: parseInt(target) || 1
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Редактировать' : 'Новая привычка'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Название привычки
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Читать 30 минут"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Цвет
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(color => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "w-10 h-10 rounded-xl transition-all duration-200",
                    color.bg,
                    selectedColor === color.name
                      ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110"
                      : "hover:scale-105 opacity-70 hover:opacity-100"
                  )}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Иконка
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ICONS).map(([key, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedIcon(key)}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                    selectedIcon === key
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Периодичность
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {FREQUENCIES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Цель (раз в день)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
            >
              {initialData ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default App