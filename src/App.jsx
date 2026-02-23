// === IMPORTS ===
import { SafeIcon } from './components/SafeIcon';
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Canvas size - increased for larger grid
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
const generatePhotoPositions = () => {
  const positions = []
  const usedRegions = []

  PHOTOS.forEach((photo, index) => {
    let x, y, validPosition
    let attempts = 0

    do {
      validPosition = true
      x = Math.random() * (CANVAS_SIZE - 600) + 300
      y = Math.random() * (CANVAS_SIZE - 800) + 400

      // Check minimum distance from other photos
      for (const region of usedRegions) {
        const dx = x - region.x
        const dy = y - region.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 400) {
          validPosition = false
          break
        }
      }
      attempts++
    } while (!validPosition && attempts < 100)

    usedRegions.push({ x, y })
    positions.push({
      ...photo,
      x,
      y,
      rotation: (Math.random() - 0.5) * 10,
      scale: 0.8 + Math.random() * 0.4
    })
  })

  return positions
}

// Navigation Component
const Navigation = ({ onNavigate, activeModal }) => {
  const navItems = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'about', label: 'About Me' },
    { id: 'connect', label: 'Connect' },
    { id: 'blog', label: 'Blog' }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 md:py-8">
      {/* Gradient overlay - updated as requested: black to transparent, 75% opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #000000, rgba(0, 0, 0, 0))',
          opacity: 0.75
        }}
      />

      <div className="relative flex justify-between items-start max-w-[1800px] mx-auto">
        {/* Logo */}
        <div className="flex flex-col">
          <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight leading-none">
            SERGIO
          </h1>
          <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight leading-none">
            MUSEL
          </h1>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col items-end gap-2 md:gap-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "text-sm md:text-base font-medium transition-colors duration-200 hover:text-orange-500",
                activeModal === item.id ? "text-orange-500" : "text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-6xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="max-h-[80vh] w-auto object-contain"
        />
        <div className="mt-6 text-center text-white">
          <h3 className="text-xl font-medium mb-1">{photo.title}</h3>
          <p className="text-sm text-zinc-400 font-mono">
            {photo.date} — {photo.camera}
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-white hover:text-orange-500 transition-colors"
        >
          <SafeIcon name="x" size={32} />
        </button>
      </motion.div>
    </motion.div>
  )
}

// About Modal Component
const AboutModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 bg-black/95 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="min-h-screen flex items-center justify-center p-6 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Photo */}
          <div className="relative aspect-[3/4] md:aspect-auto md:h-[600px]">
            <img
              src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg?"
              alt="Sergio Musel"
              className="w-full h-full object-cover grayscale"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">About Me</h2>
            <div className="grid grid-cols-1 gap-6 text-zinc-300 leading-relaxed">
              <p>
                Based in Prague, I specialize in black and white analog photography,
                capturing the raw essence of urban landscapes and human emotion. My work
                explores the interplay between light and shadow, finding beauty in
                fleeting moments of solitude.
              </p>
              <p>
                With over a decade of experience shooting exclusively on Leica cameras,
                I pursue a minimalist approach that strips away distraction to reveal
                the fundamental truth of each scene.
              </p>
            </div>

            {/* Awards */}
            <div className="mt-8 pt-8 border-t border-zinc-800">
              <h3 className="text-sm font-mono text-orange-500 mb-4">LEICA AWARDS</h3>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>2023 — Leica Oskar Barnack Award, Finalist</li>
                <li>2022 — Leica Street Photography, Honorable Mention</li>
                <li>2021 — Leica Monochrom Challenge, Winner</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 md:top-12 md:right-12 text-white hover:text-orange-500 transition-colors"
        >
          <SafeIcon name="x" size={32} />
        </button>
      </div>
    </motion.div>
  )
}

// Connect Modal Component
const ConnectModal = ({ onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 overflow-y-auto"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a0a00 50%, #000000 100%)'
      }}
      onClick={onClose}
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Connect</h2>

          <div className="space-y-6 text-zinc-300">
            <p className="text-lg">
              Available for commissions and collaborations worldwide.
            </p>

            <div className="flex flex-col items-center gap-4 pt-8">
              <a href="mailto:hello@sergiomusel.com" className="text-xl md:text-2xl text-white hover:text-orange-500 transition-colors">
                hello@sergiomusel.com
              </a>

              <div className="flex gap-6 mt-4">
                <a href="#" className="text-zinc-400 hover:text-orange-500 transition-colors">
                  <SafeIcon name="instagram" size={24} />
                </a>
                <a href="#" className="text-zinc-400 hover:text-orange-500 transition-colors">
                  <SafeIcon name="twitter" size={24} />
                </a>
                <a href="#" className="text-zinc-400 hover:text-orange-500 transition-colors">
                  <SafeIcon name="linkedin" size={24} />
                </a>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-800 font-mono text-sm text-zinc-500">
              <p>{currentTime.toLocaleDateString()} — {currentTime.toLocaleTimeString()}</p>
              <p className="mt-1">Prague, CZ</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 md:top-12 md:right-12 text-white hover:text-orange-500 transition-colors"
        >
          <SafeIcon name="x" size={32} />
        </button>
      </div>
    </motion.div>
  )
}

// Main App Component
function App() {
  const [photoPositions] = useState(() => generatePhotoPositions())
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const containerRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 200 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  // Center the canvas initially
  useEffect(() => {
    const centerX = (window.innerWidth - CANVAS_SIZE) / 2
    const centerY = (window.innerHeight - CANVAS_SIZE) / 2
    x.set(centerX)
    y.set(centerY)
  }, [x, y])

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('img')) return
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    x.set(x.get() + e.movementX)
    y.set(y.get() + e.movementY)
  }, [isDragging, x, y])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('img')) return
    setIsDragging(true)
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const lastTouch = e.changedTouches[0]
    // Simplified touch handling
  }, [isDragging])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  const handleNavigate = (id) => {
    if (id === 'portfolio') {
      setActiveModal(null)
      // Reset view to center
      const centerX = (window.innerWidth - CANVAS_SIZE) / 2
      const centerY = (window.innerHeight - CANVAS_SIZE) / 2
      x.set(centerX)
      y.set(centerY)
    } else {
      setActiveModal(id)
    }
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedPhoto(null)
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-900">
      {/* Noise Background */}
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none z-10" />

      {/* Canvas Container */}
      <motion.div
        ref={containerRef}
        style={{ x: xSpring, y: ySpring }}
        className={cn(
          "absolute top-0 left-0 bg-zinc-800",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Canvas Background */}
        <div
          className="relative"
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        >
          {/* Photos */}
          {photoPositions.map((photo) => (
            <motion.div
              key={photo.id}
              className="absolute"
              style={{
                left: photo.x,
                top: photo.y,
                transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`
              }}
              whileHover={{ scale: photo.scale * 1.05, zIndex: 20 }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhoto(photo)
              }}
            >
              <div className="relative group">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-64 h-80 object-cover grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <Navigation onNavigate={handleNavigate} activeModal={activeModal} />

      {/* Modals */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal photo={selectedPhoto} onClose={closeModal} />
        )}
        {activeModal === 'about' && (
          <AboutModal onClose={closeModal} />
        )}
        {activeModal === 'connect' && (
          <ConnectModal onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App