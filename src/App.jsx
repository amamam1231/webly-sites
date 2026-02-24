// === IMPORTS ===
import { SafeIcon } from './components/SafeIcon';
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(...inputs))
}

// Canvas size - increased for larger grid
const CANVAS_SIZE = 30000

// Photo data (unchanged)
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
  const positions = []
  const used = new Set()

  PHOTOS.forEach((photo, index) => {
    let x, y, key
    let attempts = 0
    do {
      x = Math.random() * (CANVAS_SIZE - 400) + 200
      y = Math.random() * (CANVAS_SIZE - 400) + 200
      key = `${Math.floor(x / 100)}-${Math.floor(y / 100)}`
      attempts++
    } while (used.has(key) && attempts < 100)

    used.add(key)
    positions.push({
      ...photo,
      x,
      y,
      width: 300 + Math.random() * 200,
      rotation: (Math.random() - 0.5) * 10
    })
  })

  return positions
}

// Navigation Component
const Navigation = ({ onNavigate, activeModal }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] flex justify-between items-start p-6 pointer-events-none">
      <div className="pointer-events-auto">
        <h1 className="text-white font-bold text-xl leading-tight tracking-tight">
          SERGIO<br/>MUSEL
        </h1>
      </div>

      <div className="flex gap-6 pointer-events-auto">
        {['Portfolio', 'About Me', 'Connect', 'Blog'].map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item.toLowerCase().replace(' ', '-'))}
            className={cn(
              "text-sm uppercase tracking-wider transition-colors",
              activeModal === item.toLowerCase().replace(' ', '-')
                ? "text-orange-500"
                : "text-white/70 hover:text-white"
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  )
}

// Photo Modal Component
const PhotoModal = ({ photo, onClose }) => {
  if (!photo) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="w-full h-auto object-contain"
        />
        <div className="mt-4 text-white/60 text-sm font-mono space-y-1">
          <p>{photo.title}</p>
          <p>{photo.date} — {photo.camera}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <SafeIcon name="x" size={24} />
        </button>
      </div>
    </motion.div>
  )
}

// About Modal Component
const AboutModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-zinc-900/95 overflow-auto"
      onClick={onClose}
    >
      <div
        className="min-h-screen flex flex-col md:flex-row max-w-6xl mx-auto p-8 md:p-16 gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/3">
          <img
            src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg?"
            alt="Sergio Musel"
            className="w-full h-auto grayscale"
          />
        </div>
        <div className="w-full md:w-2/3 text-white space-y-8">
          <h2 className="text-4xl font-bold uppercase tracking-tight">About Me</h2>
          <div className="grid md:grid-cols-2 gap-8 text-white/70 leading-relaxed">
            <p>
              Born in Prague and trained in the traditions of analog photography,
              I have spent the last decade capturing the raw essence of urban life.
              My work explores the intersection of light and shadow, finding beauty
              in the mundane and extraordinary alike.
            </p>
            <p>
              Using exclusively Leica cameras, I embrace the limitations of film
              and digital monochrome to create images that strip away the unnecessary,
              leaving only emotion and form. My photographs have been exhibited
              across Europe and featured in numerous publications.
            </p>
          </div>
          <div className="pt-8 border-t border-white/20">
            <h3 className="text-sm uppercase tracking-wider text-white/40 mb-4">Awards</h3>
            <ul className="space-y-2 text-white/60 font-mono text-sm">
              <li>2023 — Leica Oskar Barnack Award, Finalist</li>
              <li>2022 — World Press Photo, Honorable Mention</li>
              <li>2021 — Prague Photo Festival, Best Series</li>
            </ul>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/60 hover:text-white"
        >
          <SafeIcon name="x" size={32} />
        </button>
      </div>
    </motion.div>
  )
}

// Connect Modal Component - REDESIGNED with Analog Brutalism
const ConnectModal = ({ onClose, isDarkTheme }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-[#101010] flex flex-col"
      onClick={onClose}
    >
      <div
        className="flex-1 flex flex-col justify-center items-center px-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title - Anton font, brutalist styling */}
        <h1
          className="text-6xl md:text-8xl uppercase text-white mb-16 select-none"
          style={{
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '-0.03em',
            lineHeight: '0.85'
          }}
        >
          LET'S CONNECT
        </h1>

        {/* Interactive Links - Terminal Style, IBM Plex Mono */}
        <div className="space-y-2 text-center">
          <a
            href="https://instagram.com/sergiomusel"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-mono text-white text-lg md:text-xl px-4 py-3 hover:bg-white hover:text-[#101010] transition-none duration-0"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            <span className="opacity-40">[ IG ]</span>
            <span className="mx-2">-&gt;</span>
            <span>@sergiomusel</span>
          </a>

          <a
            href="https://twitter.com/sergiomusel"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-mono text-white text-lg md:text-xl px-4 py-3 hover:bg-white hover:text-[#101010] transition-none duration-0"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            <span className="opacity-40">[ X  ]</span>
            <span className="mx-2">-&gt;</span>
            <span>@sergiomusel</span>
          </a>

          <a
            href="mailto:hello@sergiomusel.com"
            className="block font-mono text-white text-lg md:text-xl px-4 py-3 hover:bg-white hover:text-[#101010] transition-none duration-0"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            <span className="opacity-40">[ MAIL ]</span>
            <span className="mx-2">-&gt;</span>
            <span>hello@sergiomusel.com</span>
          </a>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="flex justify-between items-end px-6 py-6 md:px-8 md:py-8">
        <div
          className="text-[11px] uppercase text-white/40 tracking-wider"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          Prague, CZ
        </div>
        <div
          className="text-[11px] uppercase text-white/40 tracking-wider"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {currentDate}
        </div>
      </div>
    </motion.div>
  )
}

// Main App Component
function App() {
  const [photos] = useState(() => generatePositions())
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const containerRef = useRef(null)
  const x = useMotionValue(-CANVAS_SIZE / 2 + window.innerWidth / 2)
  const y = useMotionValue(-CANVAS_SIZE / 2 + window.innerHeight / 2)

  const springConfig = { damping: 25, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('a')) return
    setIsDragging(true)
    const startX = e.clientX - x.get()
    const startY = e.clientY - y.get()

    const handleMouseMove = (e) => {
      x.set(e.clientX - startX)
      y.set(e.clientY - startY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [x, y])

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0]
    const startX = touch.clientX - x.get()
    const startY = touch.clientY - y.get()

    const handleTouchMove = (e) => {
      const touch = e.touches[0]
      x.set(touch.clientX - startX)
      y.set(touch.clientY - startY)
    }

    const handleTouchEnd = () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }

    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
  }, [x, y])

  const closeModal = () => setActiveModal(null)

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-900">
      {/* TV Noise Effect */}
      <div className="tv-noise-dark" />

      {/* Infinite Canvas */}
      <motion.div
        ref={containerRef}
        style={{ x: xSpring, y: ySpring }}
        className={cn(
          "absolute top-0 left-0 w-[30000px] h-[30000px] cursor-grab active:cursor-grabbing",
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="absolute transition-transform hover:scale-105 duration-300"
            style={{
              left: photo.x,
              top: photo.y,
              width: photo.width,
              transform: `rotate(${photo.rotation}deg)`,
            }}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedPhoto(photo)
            }}
          >
            <img
              src={photo.src}
              alt={photo.title}
              className="w-full h-auto shadow-2xl grayscale hover:grayscale-0 transition-all duration-500"
              draggable={false}
            />
          </div>
        ))}
      </motion.div>

      {/* Navigation */}
      <Navigation
        onNavigate={setActiveModal}
        activeModal={activeModal}
      />

      {/* Modals */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
          />
        )}
        {activeModal === 'about-me' && (
          <AboutModal onClose={closeModal} />
        )}
        {activeModal === 'connect' && (
          <ConnectModal onClose={closeModal} isDarkTheme={true} />
        )}
      </AnimatePresence>
    </div>
  )
}

// === EXPORT ===
export default App