// === IMPORTS ===
import { SafeIcon } from './components/SafeIcon';
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(...inputs))
}

// Canvas size - large virtual canvas
const CANVAS_SIZE = 30000

// Photo data
const PHOTOS = [
  { id: 1, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg?', title: 'Urban Solitude', date: '2023.11.15', camera: 'Leica M10-R' },
  { id: 2, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-2291.jpg?', title: 'Shadow Play', date: '2023.10.22', camera: 'Leica Q2' },
  { id: 3, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-7476.jpg?', title: 'Morning Light', date: '2024.01.08', camera: 'Leica M6' },
  { id: 4, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-3765.jpg?', title: 'Silent Streets', date: '2023.09.14', camera: 'Leica M10-R' },
  { id: 5, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8936.jpg?', title: 'Contrast', date: '2024.02.01', camera: 'Leica Q2 Monochrom' },
  { id: 6, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-7385.jpg?', title: 'Analog Dreams', date: '2023.12.03', camera: 'Leica M6' },
  { id: 7, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8284.jpg?', title: 'Reflections', date: '2024.01.20', camera: 'Leica M10-R' },
  { id: 8, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8710.jpg?', title: 'Timeless', date: '2023.08.30', camera: 'Leica Q2' },
  { id: 9, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453883-2278.jpg?', title: 'Raw Emotion', date: '2024.02.15', camera: 'Leica M6' },
  { id: 10, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453883-1442.jpg?', title: 'Fleeting Moment', date: '2023.11.28', camera: 'Leica M10-R' },
  { id: 11, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-8417.jpg?', title: 'Depth', date: '2024.01.12', camera: 'Leica Q2 Monochrom' },
  { id: 12, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-9947.jpg?', title: 'Still Life', date: '2023.10.05', camera: 'Leica M6' },
  { id: 13, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-9719.jpg?', title: 'Geometry', date: '2024.02.20', camera: 'Leica M10-R' },
  { id: 14, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-1425.jpg?', title: 'Light Study', date: '2023.09.22', camera: 'Leica Q2' },
]

// Generate random positions for photos
const generatePositions = () => {
  return PHOTOS.map((photo) => {
    const margin = 800
    const x = Math.random() * (CANVAS_SIZE - margin * 2) + margin
    const y = Math.random() * (CANVAS_SIZE - margin * 2) + margin
    const rotation = (Math.random() - 0.5) * 20
    const scale = 0.9 + Math.random() * 0.3
    return { ...photo, x, y, rotation, scale }
  })
}

// === MAIN COMPONENT ===
function App() {
  const [activeModal, setActiveModal] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })

  // Generate photo positions once
  const photoPositions = useMemo(() => generatePositions(), [])

  // Set up drag constraints based on viewport
  useEffect(() => {
    const updateConstraints = () => {
      setConstraints({
        left: -CANVAS_SIZE + window.innerWidth,
        right: 0,
        top: -CANVAS_SIZE + window.innerHeight,
        bottom: 0
      })
    }

    updateConstraints()
    window.addEventListener('resize', updateConstraints)
    return () => window.removeEventListener('resize', updateConstraints)
  }, [])

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo)
    setActiveModal('photo')
  }

  const openAboutModal = () => setActiveModal('about')
  const openConnectModal = () => setActiveModal('connect')
  const closeModal = () => setActiveModal(null)

  // Calculate initial center position
  const initialX = (-CANVAS_SIZE + window.innerWidth) / 2
  const initialY = (-CANVAS_SIZE + window.innerHeight) / 2

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-900">
      {/* TV Noise Overlay */}
      <div className={isDarkTheme ? "tv-noise-dark" : "tv-noise-light"} />

      {/* Navigation - Fixed on top */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-start p-6 md:p-8 pointer-events-none">
        {/* Logo */}
        <div
          className="pointer-events-auto select-none"
          style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '85px',
            lineHeight: '0.85',
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#ffffff',
            margin: 0
          }}
        >
          SERGIO<br/>MUSEL
        </div>

        {/* Menu */}
        <div
          className="pointer-events-auto flex flex-col md:flex-row gap-4 md:gap-6 items-end md:items-center"
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '16px',
            fontWeight: 500,
            letterSpacing: '0.02em'
          }}
        >
          <button
            onClick={() => {
              setActiveModal(null)
              setIsDarkTheme(true)
            }}
            className="text-white transition-all hover:opacity-80"
            style={{
              fontFamily: 'inherit',
              backgroundColor: activeModal === null ? '#FF4400' : 'transparent',
              padding: activeModal === null ? '0px 4px' : '0px'
            }}
          >
            Portfolio
          </button>
          <button
            onClick={openAboutModal}
            className="text-white hover:text-orange-500 transition-colors"
            style={{ fontFamily: 'inherit' }}
          >
            About Me
          </button>
          <button
            onClick={openConnectModal}
            className="text-white hover:text-orange-500 transition-colors"
            style={{ fontFamily: 'inherit' }}
          >
            Connect
          </button>
          <button
            onClick={() => {}}
            className="text-white hover:text-orange-500 transition-colors"
            style={{ fontFamily: 'inherit' }}
          >
            Blog
          </button>
        </div>
      </nav>

      {/* Canvas Container - Draggable */}
      <motion.div
        drag
        dragConstraints={constraints}
        dragElastic={0}
        dragMomentum={true}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        initial={{ x: initialX, y: initialY }}
        className="absolute cursor-grab active:cursor-grabbing touch-none"
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
      >
        {photoPositions.map((photo) => (
          <div
            key={photo.id}
            className="absolute"
            style={{
              left: photo.x,
              top: photo.y,
              transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`,
              zIndex: 10
            }}
          >
            <div
              className="relative group cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                openPhotoModal(photo)
              }}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-48 md:w-64 lg:w-72 h-auto object-cover shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-500 select-none"
                draggable={false}
                style={{ pointerEvents: 'none' }}
              />
              <div className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <p className="text-white text-xs font-mono whitespace-nowrap">{photo.title}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'photo' && selectedPhoto && (
          <PhotoModal photo={selectedPhoto} onClose={closeModal} />
        )}
        {activeModal === 'about' && (
          <AboutModal onClose={closeModal} />
        )}
        {activeModal === 'connect' && (
          <ConnectModal onClose={closeModal} isDarkTheme={isDarkTheme} />
        )}
      </AnimatePresence>
    </div>
  )
}

// === MODAL COMPONENTS ===

function PhotoModal({ photo, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/95 p-4 md:p-8"
      onClick={onClose}
    >
      <div className="max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.src}
          alt={photo.title}
          className="max-h-[70vh] w-auto object-contain"
        />
        <div className="mt-8 text-center font-mono">
          <p className="text-white text-lg mb-2 tracking-wide">{photo.title}</p>
          <p className="text-zinc-500 text-sm">{photo.date} • {photo.camera}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-8 text-zinc-500 hover:text-white transition-colors font-mono text-sm"
        >
          [ CLOSE ]
        </button>
      </div>
    </motion.div>
  )
}

function AboutModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-40 bg-zinc-900 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen p-6 md:p-12 pt-32 max-w-6xl mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div className="relative">
            <img
              src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg"
              alt="Sergio Musel"
              className="w-full grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
          </div>

          <div className="text-white font-mono flex flex-col justify-center">
            <h2
              className="text-5xl md:text-6xl mb-8 text-white"
              style={{ fontFamily: 'Anton, sans-serif', letterSpacing: '-0.02em' }}
            >
              ABOUT ME
            </h2>

            <div className="space-y-6 text-sm leading-relaxed text-zinc-300 columns-1 md:columns-2 gap-8">
              <p>
                Sergio Musel is a Prague-based photographer specializing in analog and digital black and white photography. With over 15 years of experience capturing urban landscapes and intimate portraits, his work explores the interplay between light and shadow.
              </p>
              <p>
                Inspired by the works of Henri Cartier-Bresson and the tradition of Czech photography, Musel finds beauty in mundane moments and urban solitude. His approach combines classical techniques with contemporary vision.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-800">
              <h3 className="text-orange-500 mb-6 text-xs tracking-widest uppercase">Selected Awards</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex justify-between">
                  <span>Leica Oskar Barnack Award</span>
                  <span className="text-zinc-600">2023</span>
                </li>
                <li className="flex justify-between">
                  <span>World Press Photo</span>
                  <span className="text-zinc-600">2022</span>
                </li>
                <li className="flex justify-between">
                  <span>Sony World Photography Awards</span>
                  <span className="text-zinc-600">2021</span>
                </li>
                <li className="flex justify-between">
                  <span>Czech Press Photo</span>
                  <span className="text-zinc-600">2020</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="fixed top-6 right-6 md:top-8 md:right-8 text-zinc-500 hover:text-white transition-colors font-mono text-sm z-50"
      >
        [ CLOSE ]
      </button>
    </motion.div>
  )
}

function ConnectModal({ onClose, isDarkTheme }) {
  const [dateTime, setDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.')
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #FF4400 100%)'
      }}
      onClick={onClose}
    >
      {/* Additional noise overlay for this modal */}
      <div className="tv-noise-dark opacity-40" />

      <div
        className="relative z-10 text-center text-white p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-6xl md:text-7xl mb-12 text-white"
          style={{ fontFamily: 'Anton, sans-serif', letterSpacing: '-0.02em', lineHeight: 0.9 }}
        >
          CONNECT
        </h2>

        <div className="font-mono space-y-6">
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-light tracking-wider">Prague, CZ</p>
            <p className="text-sm text-zinc-400">
              {formatDate(dateTime)} {formatTime(dateTime)}
            </p>
          </div>

          <div className="w-12 h-px bg-orange-500 mx-auto my-8" />

          <div className="flex flex-col gap-4 text-sm">
            <a href="mailto:hello@sergiomusel.com" className="text-white hover:text-orange-400 transition-colors tracking-widest uppercase">
              Email
            </a>
            <a href="#" className="text-white hover:text-orange-400 transition-colors tracking-widest uppercase">
              Instagram
            </a>
            <a href="#" className="text-white hover:text-orange-400 transition-colors tracking-widest uppercase">
              Twitter
            </a>
            <a href="#" className="text-white hover:text-orange-400 transition-colors tracking-widest uppercase">
              Behance
            </a>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="fixed top-6 right-6 md:top-8 md:right-8 text-zinc-400 hover:text-white transition-colors font-mono text-sm z-50"
      >
        [ CLOSE ]
      </button>
    </motion.div>
  )
}

// === EXPORT ===
export default App