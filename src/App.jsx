import { SafeIcon } from './components/SafeIcon';
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { X, Instagram, Twitter, Mail, MapPin, Calendar, Award, Camera, Aperture } from 'lucide-react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

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
  { id: 15, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453925-5244.jpg?', title: 'Fragments', date: '2024.01.30', camera: 'Leica M6' },
]

// Generate random positions for photos
const generatePositions = () => {
  const positions = []
  const canvasWidth = 8000
  const canvasHeight = 12000
  const spacing = 20
  const cols = 12
  const rows = 20

  // Create grid layout without random transformations
  for (let i = 0; i < PHOTOS.length * 2; i++) {
    const photo = PHOTOS[i % PHOTOS.length]
    const col = i % cols
    const row = Math.floor(i / cols) % rows
    const x = 20 + col * (320 + spacing)
    const y = 20 + row * (200 + spacing)

    positions.push({
      ...photo,
      x,
      y,
      rotation: 0,
      scale: 1,
      width: 320,
    })
  }

  return positions
}

const PHOTO_POSITIONS = generatePositions()

// Navbar Component
function Navbar({ activeModal, setActiveModal }) {
  const navItems = [
    { label: 'Portfolio', id: 'portfolio', action: () => setActiveModal(null) },
    { label: 'About Me', id: 'about', action: () => setActiveModal('about') },
    { label: 'Connect', id: 'connect', action: () => setActiveModal('connect') },
    { label: 'Blog', id: 'blog', action: () => window.open('https://medium.com', '_blank') },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex justify-between items-start pointer-events-none">
      <div className="pointer-events-auto">
        <h1 className="font-serif text-white text-xl md:text-2xl font-bold leading-tight tracking-tight">
          SERGIO<br/>MUSEL
        </h1>
      </div>

      <div className="flex flex-col gap-4 pointer-events-auto items-end">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={cn( "font-sans text-xs md:text-sm tracking-wide uppercase transition-colors duration-300 hover:text-orange-500",
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
      className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center"
      onClick={onClose}
    >

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain grayscale"
        />
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
        className="min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-24"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Photo */}
          <div className="relative">
            <div className="aspect-[3/4] bg-zinc-900 overflow-hidden">
              <img
                src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453925-5768.jpg?"
                alt="Sergio Musel"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-orange-500/30" />
          </div>

          {/* Right - Content */}
          <div className="flex flex-col justify-center">
            <h2 className="font-mono text-white text-4xl md:text-5xl font-bold mb-8 tracking-tighter">
              ABOUT ME
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-zinc-400 leading-relaxed font-sans text-sm md:text-base">
                  Born in Prague and trained in the traditions of analog photography,
                  I have spent the last decade capturing the raw essence of urban landscapes.
                  My work explores the intersection of light and shadow, finding beauty in
                  the overlooked corners of metropolitan life.
                </p>
              </div>
              <div>
                <p className="text-zinc-400 leading-relaxed font-sans text-sm md:text-base">
                  Each photograph is a meditation on time and space, shot exclusively on
                  Leica rangefinders. I believe in the slow process of craft—the deliberate
                  click of the shutter, the anticipation of development, the tangible weight
                  of silver gelatin prints.
                </p>
              </div>
            </div>

            {/* Awards */}
            <div className="border-t border-zinc-800 pt-8">
              <h3 className="font-mono text-orange-500 text-sm tracking-widest mb-6 flex items-center gap-2">
                <SafeIcon name="Award" size={16} />
                LEICA AWARDS
              </h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between text-zinc-300">
                  <span>Leica Oskar Barnack Award</span>
                  <span className="text-zinc-600">2023</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Leica Street Photography Contest</span>
                  <span className="text-zinc-600">2022</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>World Press Photo</span>
                  <span className="text-zinc-600">2021</span>
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
      {/* Noise Overlay */}
      <div className="noise-overlay" />
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
          className="absolute inset-0 select-none"
          ref={canvasRef}
          style={{ x: springX, y: springY }}
          className="absolute w-[3000px] h-[3000px] bg-zinc-900"
        >
          {/* Grid lines for depth */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" />
          </div>

          {/* Photos */}
          {PHOTO_POSITIONS.map((photo) => (
            <div
              key={photo.id}
              className="photo-item absolute cursor-pointer group hover:opacity-50"
              style={{
                left: photo.x,
                top: photo.y,
                width: photo.width,
                transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`,
              }}
              onClick={() => handlePhotoClick(photo)}
            >
              <div className="relative overflow-hidden bg-zinc-800 shadow-2xl">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-auto"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/0" />

                {/* Hover info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100">
                  <p className="font-mono text-white text-xs tracking-wider">{photo.title}</p>
                </div>
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