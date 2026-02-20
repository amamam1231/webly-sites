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

// Generate random positions for photos (scattered layout)
const PHOTO_POSITIONS = PHOTOS.map((photo, index) => {
  const margin = 400
  const availableSpace = CANVAS_SIZE - (margin * 2)

  // Create clusters but with randomness
  const gridX = (index % 5) * (availableSpace / 5) + margin
  const gridY = Math.floor(index / 5) * (availableSpace / 3) + margin

  // Add randomness to create "creative chaos"
  const x = gridX + (Math.random() - 0.5) * 800
  const y = gridY + (Math.random() - 0.5) * 600

  // Random size between 350-550px
  const width = 350 + Math.random() * 200
  const aspectRatio = 0.7 + Math.random() * 0.6 // 0.7 to 1.3
  const height = width * aspectRatio

  // Random rotation -8 to 8 degrees
  const rotation = (Math.random() - 0.5) * 16

  // Random scale 0.85 to 1.15
  const scale = 0.85 + Math.random() * 0.3

  return {
    ...photo,
    x,
    y,
    width,
    height,
    rotation,
    scale,
    isVertical: aspectRatio > 1
  }
})

// Navbar Component
function Navbar({ activeModal, setActiveModal }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 md:p-8 pointer-events-none">
      <div className="pointer-events-auto">
        <h1 className="font-mono text-white text-2xl md:text-3xl font-bold tracking-tighter leading-none">
          SERGIO<br/>MUSEL
        </h1>
      </div>

      <div className="flex gap-6 md:gap-8 font-mono text-xs md:text-sm tracking-widest pointer-events-auto">
        <button
          onClick={() => setActiveModal(null)}
          className={cn( "transition-colors hover:text-orange-500",
            !activeModal ? "text-orange-500" : "text-zinc-300"
          )}
        >
          Portfolio
        </button>
        <button
          onClick={() => setActiveModal('about')}
          className={cn( "transition-colors hover:text-orange-500",
            activeModal === 'about' ? "text-orange-500" : "text-zinc-300"
          )}
        >
          About Me
        </button>
        <button
          onClick={() => setActiveModal('connect')}
          className={cn( "transition-colors hover:text-orange-500",
            activeModal === 'connect' ? "text-orange-500" : "text-zinc-300"
          )}
        >
          Connect
        </button>
        <button
          onClick={() => {}}
          className="text-zinc-300 hover:text-orange-500 transition-colors"
        >
          Blog
        </button>
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
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 bg-black/95 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="fixed top-6 right-6 text-zinc-400 hover:text-white transition-colors z-50 p-2"
      >
        <SafeIcon name="X" size={32} />
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="max-h-[75vh] max-w-full object-contain mb-8 grayscale"
        />
        <div className="text-center font-mono space-y-2">
          <h3 className="text-white text-xl md:text-2xl tracking-tight">{photo.title}</h3>
          <p className="text-zinc-500 text-sm md:text-base">
            {photo.date} — {photo.camera}
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
      className="fixed inset-0 z-40 overflow-y-auto bg-zinc-950/98 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="fixed top-6 right-6 text-zinc-400 hover:text-white transition-colors z-50 p-2"
      >
        <SafeIcon name="X" size={32} />
      </button>

      <div className="min-h-screen p-6 md:p-12 lg:p-24 pt-24" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 mb-16">
            {/* Left - Photo */}
            <div className="relative">
              <img
                src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-1425.jpg"
                alt="Sergio Musel"
                className="w-full h-auto grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent pointer-events-none" />
            </div>

            {/* Right - Bio */}
            <div className="space-y-8 flex flex-col justify-center">
              <h2 className="font-mono text-4xl md:text-6xl font-bold text-white tracking-tighter">
                ABOUT
              </h2>

              <div className="grid md:grid-cols-2 gap-8 text-zinc-300 leading-relaxed text-sm md:text-base">
                <p className="font-sans">
                  Sergio Musel is a Prague-based photographer specializing in black and white analog photography. With over a decade of experience capturing urban landscapes and intimate portraits, his work explores the interplay between light and shadow in everyday moments.
                </p>
                <p className="font-sans">
                  His approach combines classical darkroom techniques with contemporary visual storytelling. Inspired by the works of Cartier-Bresson and Josef Koudelka, Sergio seeks to find beauty in the mundane and extraordinary in the ordinary.
                </p>
              </div>

              <div className="pt-8 border-t border-zinc-800">
                <p className="font-mono text-zinc-500 text-xs tracking-widest uppercase mb-4">
                  Equipment
                </p>
                <p className="text-zinc-300 font-mono text-sm">
                  Leica M10-R, Leica Q2 Monochrom, Leica M6, Hasselblad 500CM
                </p>
              </div>
            </div>
          </div>

          {/* Awards Section */}
          <div className="border-t border-zinc-800 pt-12">
            <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-8">
              Selected Awards & Exhibitions
            </h3>
            <div className="space-y-0 max-w-3xl">
              <div className="flex justify-between text-zinc-300 py-4 border-b border-zinc-800 font-mono text-sm">
                <span>Leica Oskar Barnack Award</span>
                <span className="text-zinc-600">2023</span>
              </div>
              <div className="flex justify-between text-zinc-300 py-4 border-b border-zinc-800 font-mono text-sm">
                <span>Prague Photo Festival</span>
                <span className="text-zinc-600">2020</span>
              </div>
              <div className="flex justify-between text-zinc-300 py-4 border-b border-zinc-800 font-mono text-sm">
                <span>European Photography Award</span>
                <span className="text-zinc-600">2019</span>
              </div>
              <div className="flex justify-between text-zinc-300 py-4 font-mono text-sm">
                <span>Angkor Photo Festival</span>
                <span className="text-zinc-600">2018</span>
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
      {/* Gradient Background with Noise */}
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
  }, [x, y])

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
      {/* TV Noise Overlay - Live Film Grain */}
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
          {/* Subtle grid lines for depth */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '100px 100px'
            }} />
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
              <div className="relative w-full h-full overflow-hidden bg-zinc-800 shadow-2xl">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className={cn(
                    'w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500',
                    !photo.isVertical && 'object-center'
                  )}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
              </div>
            </div>
          ))}

          {/* Canvas center marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-orange-500/30 rounded-full" />
        </motion.div>
      </div>

      {/* Instructions overlay */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <p className="font-mono text-zinc-600 text-[10px] tracking-widest uppercase">
          Drag to explore • Click photos to view
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