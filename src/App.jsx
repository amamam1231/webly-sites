import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
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
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export default function App() {
  const [user, setUser] = useState(null)
  const [habits, setHabits] = useState([])
  const [newHabitName, setNewHabitName] = useState('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setHabits([])
      return
    }

    const q = query(
      collection(db, 'habits'),
      where('userId', '==', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setHabits(habitsData)
    }, (error) => {
      console.error('Error fetching habits:', error)
    })

    return () => unsubscribe()
  }, [user])

  const handleGoogleSignIn = async () => {
    try {
      console.log('Attempting Google sign-in...')
      const result = await signInWithPopup(auth, googleProvider)
      console.log('Sign-in successful:', result.user.email)
    } catch (error) {
      console.error('Auth error:', error.code, error.message)
      if (error.code === 'auth/popup-blocked') {
        alert('Пожалуйста, разрешите всплывающие окна для этого сайта')
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('Popup was cancelled')
      } else {
        alert('Ошибка авторизации: ' + error.message)
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const addHabit = async (e) => {
    e.preventDefault()
    if (!newHabitName.trim() || !user) return

    try {
      await addDoc(collection(db, 'habits'), {
        userId: user.uid,
        name: newHabitName.trim(),
        logs: {},
        createdAt: serverTimestamp()
      })
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

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 text-center"
        >
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              HabitFlow
            </h1>
            <p className="text-slate-400 text-lg">Отслеживай привычки. Меняй жизнь.</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold py-3 px-6 rounded-xl hover:bg-slate-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Войти через Google
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 text-sm text-slate-500">
              Синхронизация между устройствами через облако
            </div>
          </div>
        </motion.div>
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
            <div className="hidden sm:flex items-center gap-3 text-sm text-slate-400">
              <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-slate-700" />
              <span className="truncate max-w-[120px]">{user.displayName}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Выйти"
            >
              <SafeIcon name="log-out" size={20} className="text-slate-400" />
            </button>
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