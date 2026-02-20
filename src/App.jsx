import { SafeIcon } from './components/SafeIcon';
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Base photo data - 22 original photos
const BASE_PHOTOS = [
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
  { id: 15, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453925-5244.jpg?', title: 'Fragments', date: '2024.01.30', camera: 'Leica M6' },
  { id: 16, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg?', title: 'Urban Echo', date: '2023.12.15', camera: 'Leica M10-R' },
  { id: 17, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-2291.jpg?', title: 'Shadow Dance', date: '2024.03.01', camera: 'Leica Q2' },
  { id: 18, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-7476.jpg?', title: 'Golden Hour', date: '2023.11.20', camera: 'Leica M6' },
  { id: 19, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-3765.jpg?', title: 'Night Walk', date: '2024.02.28', camera: 'Leica M10-R' },
  { id: 20, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8936.jpg?', title: 'Monochrome', date: '2023.10.10', camera: 'Leica Q2 Monochrom' },
  { id: 21, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-7385.jpg?', title: 'Film Memories', date: '2024.01.25', camera: 'Leica M6' },
  { id: 22, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8284.jpg?', title: 'Mirror World', date: '2023.09.05', camera: 'Leica M10-R' },
]

// Generate 5x more photos (110 total) by replicating with variations
const PHOTOS = []
for (let i = 0; i < 5; i++) {
  BASE_PHOTOS.forEach((photo, index) => {
    PHOTOS.push({
      ...photo,
      id: i * BASE_PHOTOS.length + index + 1,
      title: `${photo.title} ${i > 0 ? `(${i + 1})` : ''}`.trim(),
    })
  })
}

// Shuffle array function
function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Generate random positions for photos on a 15000x15000 canvas (5x larger)
const CANVAS_SIZE = 15000
const PHOTO_POSITIONS = shuffleArray(PHOTOS.map((photo, index) => {
  const isVertical = Math.random() > 0.5
  const baseWidth = 280 + Math.random() * 200
  const width = baseWidth
  const height = isVertical ? baseWidth * 1.4 : baseWidth * 0.75

  // Spread photos across the entire canvas with padding
  const padding = 400
  const x = padding + Math.random() * (CANVAS_SIZE - width - padding * 2)
  const y = padding + Math.random() * (CANVAS_SIZE - height - padding * 2)

  return {
    ...photo,
    x,
    y,
    width,
    height,
    rotation: (Math.random() - 0.5) * 12,
    scale: 0.9 + Math.random() * 0.2,
    isVertical
  }
}))

// Navigation Component
function Navbar({ activeModal, setActiveModal }) {
  const navItems = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'about', label: 'About Me' },
    { id: 'connect', label: 'Connect' },
    { id: 'blog', label: 'Blog' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
      <div className="flex flex-col">
        <span className="font-mono text-white text-xl md:text-2xl font-bold tracking-tight leading-none">
          SERGIO
        </span>
        <span className="font-mono text-white text-xl md:text-2xl font-bold tracking-tight leading-none">
          MUSEL
        </span>
      </div>

      <div className="flex items-center gap-6 md:gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'portfolio') {
                setActiveModal(null)
              } else if (item.id === 'blog') {
                window.open('https://blog.sergiomusel.com', '_blank')
              } else {
                setActiveModal(item.id)
              }
            }}
            className={cn(
              "font-mono text-xs md:text-sm tracking-widest uppercase transition-colors duration-300 hover:text-orange-500",
              (activeModal === item.id || (item.id === 'portfolio' && !activeModal))
                ? "text-orange-500"
                : "text-zinc-400"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

// Photo Modal Component
function PhotoModal({ photo, onClose }) {
  if (!photo) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/95 p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors z-50"
      >
        <SafeIcon name="x" size={32} />
      </button>

      <div
        className="relative max-w-6xl w-full max-h-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="max-h-[70vh] md:max-h-[75vh] w-auto object-contain"
        />
        <div className="mt-6 text-center space-y-2">
          <h2 className="font-mono text-white text-lg md:text-xl tracking-wide">
            {photo.title}
          </h2>
          <div className="flex items-center justify-center gap-6 text-zinc-500 font-mono text-xs md:text-sm">
            <span>{photo.date}</span>
            <span className="w-1 h-1 bg-zinc-600 rounded-full" />
            <span>{photo.camera}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// About Modal Component
function AboutModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-40 bg-zinc-900/98 overflow-y-auto"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors z-50"
      >
        <SafeIcon name="x" size={32} />
      </button>

      <div
        className="min-h-screen px-6 py-24 md:px-12 md:py-32"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Photo */}
          <div className="aspect-[3/4] bg-zinc-800 overflow-hidden">
            <img
              src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg?"
              alt="Sergio Musel"
              className="w-full h-full object-cover grayscale"
            />
          </div>

          {/* Bio */}
          <div className="space-y-8">
            <div>
              <h2 className="font-mono text-white text-3xl md:text-4xl font-bold mb-6">
                About Me
              </h2>
              <div className="grid grid-cols-1 gap-6 text-zinc-400 font-mono text-sm leading-relaxed">
                <p>
                  Born in Prague and trained in the classical traditions of European photography,
                  I have spent the last fifteen years documenting the subtle interplay between
                  urban architecture and human solitude. My work seeks to find beauty in the
                  overlooked moments of city life.
                </p>
                <p>
                  Working exclusively with Leica cameras and natural light, I pursue a aesthetic
                  that strips away the unnecessary, leaving only the essential emotional core
                  of each scene. My photographs have been exhibited across Europe and featured
                  in publications including Monocle, Cereal Magazine, and Kinfolk.
                </p>
              </div>
            </div>

            {/* Awards */}
            <div className="border-t border-zinc-800 pt-8">
              <h3 className="font-mono text-orange-500 text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
                <SafeIcon name="award" size={16} />
                Leica Awards & Recognition
              </h3>
              <ul className="space-y-3 font-mono text-sm text-zinc-500">
                <li className="flex items-start gap-3">
                  <span className="text-zinc-700">2024</span>
                  <span>Leica Oskar Barnack Award - Finalist</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-700">2023</span>
                  <span>World Press Photo - Long-term Project</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-700">2022</span>
                  <span>Leica Street Photo Award - Winner</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-700">2021</span>
                  <span>European Photography - Emerging Talent</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Connect Modal Component
function ConnectModal({ onClose }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-gradient-to-br from-orange-900 via-zinc-900 to-black overflow-y-auto"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors z-50"
      >
        <SafeIcon name="x" size={32} />
      </button>

      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-2xl w-full text-center space-y-12">
          <div className="space-y-4">
            <h2 className="font-mono text-white text-4xl md:text-6xl font-bold tracking-tight">
              Let's Connect
            </h2>
            <p className="font-mono text-zinc-400 text-sm md:text-base">
              Available for commissions, collaborations, and coffee conversations.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <a
              href="mailto:hello@sergiomusel.com"
              className="font-mono text-orange-500 text-lg md:text-xl hover:text-orange-400 transition-colors"
            >
              hello@sergiomusel.com
            </a>

            <div className="flex items-center gap-8 pt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <SafeIcon name="instagram" size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <SafeIcon name="twitter" size={24} />
              </a>
              <a href="mailto:hello@sergiomusel.com" className="text-zinc-400 hover:text-white transition-colors">
                <SafeIcon name="mail" size={24} />
              </a>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 font-mono text-xs text-zinc-500">
              <span className="flex items-center gap-2">
                <SafeIcon name="map-pin" size={14} />
                Prague, CZ
              </span>
              <span className="hidden md:block w-1 h-1 bg-zinc-700 rounded-full" />
              <span className="flex items-center gap-2">
                <SafeIcon name="calendar" size={14} />
                {currentDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Main App Component
function App() {
  const [activeModal, setActiveModal] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const dragStart = useRef({ x: 0, y: 0 })
  const canvasStart = useRef({ x: 0, y: 0 })
  const lastPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const rafId = useRef(null)

  // Motion values for smooth dragging with inertia
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 30, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 150, damping: 30, mass: 0.5 })

  // Initialize canvas position to center
  useEffect(() => {
    const centerX = (window.innerWidth - CANVAS_SIZE) / 2
    const centerY = (window.innerHeight - CANVAS_SIZE) / 2
    x.set(centerX)
    y.set(centerY)
  }, [x, y])

  // Mouse/Touch event handlers
  const handleMouseDown = useCallback((e) => {
    if (activeModal) return
    if (e.target.closest('.photo-item')) return

    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    canvasStart.current = { x: springX.get(), y: springY.get() }
    lastPos.current = { x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }
  }, [activeModal, springX, springY])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || activeModal) return

    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    velocity.current = {
      x: e.clientX - lastPos.current.x,
      y: e.clientY - lastPos.current.y
    }
    lastPos.current = { x: e.clientX, y: e.clientY }

    x.set(canvasStart.current.x + dx)
    y.set(canvasStart.current.y + dy)
  }, [isDragging, activeModal, x, y])

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    // Apply inertia
    const decay = 0.95
    const minVelocity = 0.5

    const animate = () => {
      const vx = velocity.current.x * decay
      const vy = velocity.current.y * decay

      if (Math.abs(vx) > minVelocity || Math.abs(vy) > minVelocity) {
        x.set(springX.get() + vx)
        y.set(springY.get() + vy)
        velocity.current = { x: vx, y: vy }
        rafId.current = requestAnimationFrame(animate)
      }
    }

    rafId.current = requestAnimationFrame(animate)
  }, [isDragging, springX, springY, x, y])

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e) => {
    if (activeModal) return
    if (e.target.closest('.photo-item')) return

    const touch = e.touches[0]
    setIsDragging(true)
    dragStart.current = { x: touch.clientX, y: touch.clientY }
    canvasStart.current = { x: springX.get(), y: springY.get() }
    lastPos.current = { x: touch.clientX, y: touch.clientY }
    velocity.current = { x: 0, y: 0 }
  }, [activeModal, springX, springY])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || activeModal) return

    const touch = e.touches[0]
    const dx = touch.clientX - dragStart.current.x
    const dy = touch.clientY - dragStart.current.y

    velocity.current = {
      x: touch.clientX - lastPos.current.x,
      y: touch.clientY - lastPos.current.y
    }
    lastPos.current = { x: touch.clientX, y: touch.clientY }

    x.set(canvasStart.current.x + dx)
    y.set(canvasStart.current.y + dy)
  }, [isDragging, activeModal, x, y])

  const handleTouchEnd = useCallback(() => {
    handleMouseUp()
  }, [handleMouseUp])

  // Global event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // Handle photo click
  const handlePhotoClick = (photo) => {
    if (isDragging) return
    setSelectedPhoto(photo)
    setActiveModal('photo')
  }

  // Close modal
  const closeModal = () => {
    setActiveModal(null)
    setSelectedPhoto(null)
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-900 select-none">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <Navbar activeModal={activeModal} setActiveModal={setActiveModal} />

      {/* Infinite Canvas Container */}
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 overflow-hidden",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <motion.div
          ref={canvasRef}
          style={{ x: springX, y: springY }}
          className="absolute w-[15000px] h-[15000px] bg-zinc-900"
        >
          {/* Grid lines for depth */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '100px 100px'
              }}
            />
          </div>

          {/* Photos */}
          {PHOTO_POSITIONS.map((photo) => (
            <div
              key={photo.id}
              className="absolute cursor-pointer hover:opacity-50 transition-opacity duration-300 photo-item"
              style={{
                left: photo.x,
                top: photo.y,
                width: photo.width,
                height: photo.height,
                transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`,
              }}
              onClick={() => handlePhotoClick(photo)}
            >
              <div className={cn(
                "relative w-full h-full overflow-hidden bg-zinc-800 shadow-2xl flex flex-col",
                !photo.isVertical && "justify-start"
              )}>
                <img
                  src={photo.src}
                  alt={photo.title}
                  className={cn(
                    'w-full hover:opacity-50 transition-opacity duration-300',
                    photo.isVertical ? 'h-full object-cover' : 'h-auto object-contain align-self-start'
                  )}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/0" />
              </div>
            </div>
          ))}

          {/* Canvas center marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-orange-500/30 rounded-full" />
        </motion.div>
      </div>

      {/* Instructions overlay */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <p className="font-mono text-zinc-500 text-xs tracking-widest uppercase">
          2026 made with Webly AI
        </p>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'photo' && (
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