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
const PHOTO_POSITIONS = PHOTOS.map((photo, index) => {
  const isVertical = index % 3 === 0
  const baseWidth = isVertical ? 320 : 480
  const baseHeight = isVertical ? 480 : 320

  return {
    ...photo,
    x: 2000 + (index * 800) + Math.random() * 400,
    y: 1500 + (index % 5) * 600 + Math.random() * 300,
    width: baseWidth,
    height: baseHeight,
    rotation: (Math.random() - 0.5) * 6,
    scale: 0.9 + Math.random() * 0.2,
    isVertical
  }
})

// Navigation Component
function Navbar({ activeModal, setActiveModal }) {
  const navItems = [
    { label: 'Portfolio', action: () => setActiveModal(null) },
    { label: 'About Me', action: () => setActiveModal('about') },
    { label: 'Connect', action: () => setActiveModal('connect') },
    { label: 'Blog', action: () => window.open('https://example.com', '_blank') }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
      <div
        className="cursor-pointer"
        onClick={() => setActiveModal(null)}
      >
        <h1 className="font-mono text-white text-xl md:text-2xl font-bold tracking-tighter leading-none">
          SERGIO<br/>MUSEL
        </h1>
      </div>

      <div className="flex items-center gap-6 md:gap-8">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={cn( "font-mono text-xs md:text-sm tracking-widest uppercase transition-colors hover:text-orange-500",
              activeModal === item.label.toLowerCase().replace(' ', '')
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
      className="fixed inset-0 z-40 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="fixed top-6 right-6 text-zinc-400 hover:text-white transition-colors z-50"
      >
        <SafeIcon name="X" size={32} />
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="max-w-full max-h-[70vh] object-contain"
        />

        <div className="mt-6 text-center font-mono">
          <h3 className="text-white text-lg mb-1">{photo.title}</h3>
          <p className="text-zinc-500 text-sm">
            {photo.date} · {photo.camera}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// About Modal Component
function AboutModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-zinc-950/98 overflow-y-auto"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="fixed top-6 right-6 text-zinc-400 hover:text-white transition-colors z-50"
      >
        <SafeIcon name="X" size={32} />
      </button>

      <div
        className="min-h-screen flex flex-col justify-center p-6 md:p-12 lg:p-24 max-w-7xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="relative">
            <img
              src={PHOTOS[0].src}
              alt="Sergio Musel"
              className="w-full max-w-md grayscale contrast-125"
            />
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-orange-500/30 -z-10" />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="font-mono text-white text-3xl md:text-4xl font-bold mb-6 tracking-tighter">
                ABOUT ME
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-400 font-sans leading-relaxed">
                <p>
                  Born in Prague and trained in the classical traditions of European photography,
                  I have spent the last decade capturing the raw essence of urban landscapes.
                  My work explores the intersection of light and shadow, finding beauty in
                  forgotten corners of metropolitan areas.
                </p>
                <p>
                  Using exclusively Leica cameras, I embrace the constraints of analog
                  photography to create images that demand patience and intention. Each
                  photograph is a meditation on time, solitude, and the human condition
                  within architectural spaces.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-8">
              <h3 className="font-mono text-orange-500 text-sm tracking-widest mb-4">
                AWARDS & RECOGNITION
              </h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between text-zinc-300">
                  <span>Leica Oskar Barnack Award</span>
                  <span className="text-zinc-600">2023</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>World Press Photo</span>
                  <span className="text-zinc-600">2022</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Prague Photo Festival</span>
                  <span className="text-zinc-600">2020</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Connect Modal Component
function ConnectModal({ onClose }) {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const date = new Date()
    setCurrentDate(date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-zinc-950 to-black">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
      </div>

      <button
        onClick={onClose}
        className="fixed top-6 right-6 text-zinc-400 hover:text-white transition-colors z-50"
      >
        <SafeIcon name="X" size={32} />
      </button>

      <div
        className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl"
        >
          <h2 className="font-mono text-white text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
            LET'S CONNECT
          </h2>

          <p className="text-zinc-400 font-sans mb-12 text-lg">
            Open for collaborations, exhibitions, and commissioned work.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-zinc-300 hover:text-orange-500 transition-colors font-mono"
            >
              <SafeIcon name="Instagram" size={24} />
              <span>@sergiomusel</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-zinc-300 hover:text-orange-500 transition-colors font-mono"
            >
              <SafeIcon name="Twitter" size={24} />
              <span>@sergiomusel</span>
            </a>
            <a
              href="mailto:hello@sergiomusel.com"
              className="flex items-center gap-3 text-zinc-300 hover:text-orange-500 transition-colors font-mono"
            >
              <SafeIcon name="Mail" size={24} />
              <span>hello@sergiomusel.com</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 text-zinc-500 font-mono text-sm">
            <div className="flex items-center gap-2">
              <SafeIcon name="MapPin" size={14} />
              <span>Prague, CZ</span>
            </div>
            <div className="flex items-center gap-2">
              <SafeIcon name="Calendar" size={14} />
              <span>{currentDate}</span>
            </div>
          </div>
        </motion.div>
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

  // Motion values for smooth dragging with inertia
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for inertia
  const springX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 })

  // Drag state refs
  const dragStart = useRef({ x: 0, y: 0 })
  const canvasStart = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const lastPos = useRef({ x: 0, y: 0 })
  const rafId = useRef(null)

  // Set initial position to center of grid content on mount
  useEffect(() => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Calculate bounds from generated positions to find center of content
    const maxX = Math.max(...PHOTO_POSITIONS.map(p => p.x + p.width))
    const maxY = Math.max(...PHOTO_POSITIONS.map(p => p.y + p.height))

    // Center of the grid content
    const contentCenterX = maxX / 2
    const contentCenterY = maxY / 2

    // Position viewport to show center of content
    const centerX = -contentCenterX + (viewportWidth / 2)
    const centerY = -contentCenterY + (viewportHeight / 2)

    x.set(centerX)
    y.set(centerY)
  }, [])

  // Handle mouse down
  const handleMouseDown = useCallback((e) => {
    if (activeModal) return
    if (e.target.closest('.photo-item')) return

    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    canvasStart.current = { x: springX.get(), y: springY.get() }
    lastPos.current = { x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }

    if (rafId.current) cancelAnimationFrame(rafId.current)
  }, [activeModal, springX, springY])

  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || activeModal) return

    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    // Calculate velocity for inertia
    velocity.current = {
      x: e.clientX - lastPos.current.x,
      y: e.clientY - lastPos.current.y
    }
    lastPos.current = { x: e.clientX, y: e.clientY }

    // Update position directly for immediate response
    x.set(canvasStart.current.x + dx)
    y.set(canvasStart.current.y + dy)
  }, [isDragging, activeModal, x, y])

  // Handle mouse up with inertia
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    // Apply inertia
    const decay = 0.95
    const minVelocity = 0.5

    const animate = () => {
      if (Math.abs(velocity.current.x) > minVelocity || Math.abs(velocity.current.y) > minVelocity) {
        x.set(x.get() + velocity.current.x)
        y.set(y.get() + velocity.current.y)

        velocity.current.x *= decay
        velocity.current.y *= decay

        rafId.current = requestAnimationFrame(animate)
      }
    }

    animate()
  }, [isDragging, x, y])

  // Touch events for mobile
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
      {/* TV Noise Overlay - Living Film Grain */}
      <div className="tv-noise" />

      {/* Navigation */}
      <Navbar activeModal={activeModal} setActiveModal={setActiveModal} />

      {/* Infinite Canvas Container */}
      <div
        ref={containerRef}
        className={cn( "absolute inset-0 overflow-hidden",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <motion.div
          ref={canvasRef}
          style={{ x: springX, y: springY }}
          className="absolute w-[30000px] h-[30000px] bg-zinc-900 select-none"
        >
          {/* Grid lines for depth */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" />
          </div>

          {/* Photos */}
          {PHOTO_POSITIONS.map((photo) => (
            <div
              key={`${photo.id}-${photo.x}-${photo.y}`}
              className="absolute cursor-pointer hover:opacity-50 transition-all duration-300 photo-item"
              style={{
                left: photo.x,
                top: photo.y,
                width: photo.width,
                height: photo.height,
                transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`,
              }}
              onClick={() => handlePhotoClick(photo)}
            >
              <div className={cn( "relative w-full h-full overflow-hidden bg-zinc-800 shadow-2xl flex flex-col",
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