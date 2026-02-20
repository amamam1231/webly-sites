import { SafeIcon } from './components/SafeIcon';
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(...inputs))
}

// Canvas size
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
  { id: 15, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453925-5244.jpg?', title: 'Fragments', date: '2024.01.30', camera: 'Leica M6' },
  { id: 16, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg?', title: 'Urban Echo', date: '2023.12.15', camera: 'Leica M10-R' },
  { id: 17, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-2291.jpg?', title: 'Shadow Dance', date: '2024.03.01', camera: 'Leica Q2' },
  { id: 18, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-7476.jpg?', title: 'Golden Hour', date: '2023.11.20', camera: 'Leica M6' },
  { id: 19, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-3765.jpg?', title: 'Night Walk', date: '2024.02.28', camera: 'Leica M10-R' },
  { id: 20, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8936.jpg?', title: 'Monochrome', date: '2023.10.10', camera: 'Leica Q2 Monochrom' },
  { id: 21, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-7385.jpg?', title: 'Film Memories', date: '2024.01.25', camera: 'Leica M6' },
  { id: 22, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8284.jpg?', title: 'Mirror World', date: '2023.09.05', camera: 'Leica M10-R' },
]

// Generate random positions for photos - same layout on all devices
const PHOTO_POSITIONS = PHOTOS.map((photo, index) => {
  // Create a scattered grid layout with random offsets
  const gridSize = 5 // 5 columns
  const col = index % gridSize
  const row = Math.floor(index / gridSize)

  // Base positions with large spacing
  const baseX = 15000 + (col - 2) * 1200
  const baseY = 15000 + (row - 2) * 1400

  // Random offsets for creative disorder
  const randomX = (Math.random() - 0.5) * 400
  const randomY = (Math.random() - 0.5) * 400

  // Random rotation between -8 and 8 degrees
  const rotation = (Math.random() - 0.5) * 16

  // Random scale between 0.9 and 1.1
  const scale = 0.9 + Math.random() * 0.2

  // Photo dimensions - consistent across devices
  const width = 350 + Math.random() * 100
  const height = width * (1.2 + Math.random() * 0.4)

  return {
    ...photo,
    x: baseX + randomX,
    y: baseY + randomY,
    width,
    height,
    rotation,
    scale,
  }
})

// Navigation Component
function Navbar({ activeModal, setActiveModal }) {
  const navItems = [
    { label: 'Portfolio', action: () => setActiveModal(null) },
    { label: 'About Me', action: () => setActiveModal('about') },
    { label: 'Connect', action: () => setActiveModal('connect') },
    { label: 'Blog', action: () => window.open('https://blog.sergiomusel.com', '_blank') },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between p-4 md:p-6 pointer-events-none">
      {/* Logo */}
      <div className="pointer-events-auto">
        <h1 className="font-mono text-white text-lg md:text-xl leading-tight tracking-tight cursor-pointer hover:text-orange-500 transition-colors" onClick={() => setActiveModal(null)}>
          <span className="block">SERGIO</span>
          <span className="block">MUSEL</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-8 pointer-events-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={cn(
              "font-mono text-xs md:text-sm tracking-widest uppercase transition-colors text-right",
              activeModal === 'about' && item.label === 'About Me' ? "text-orange-500" :
              activeModal === 'connect' && item.label === 'Connect' ? "text-orange-500" :
              "text-zinc-400 hover:text-white"
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
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="max-w-full max-h-[80vh] object-contain"
        />
        <div className="mt-6 text-center font-mono text-zinc-400 text-xs md:text-sm space-y-1">
          <p className="text-white text-sm md:text-base">{photo.title}</p>
          <p>{photo.date}</p>
          <p>{photo.camera}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 font-mono text-zinc-500 hover:text-white text-xs tracking-widest uppercase transition-colors"
        >
          Close
        </button>
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
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-900/98 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-6xl p-6 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 font-mono text-zinc-500 hover:text-white text-xs tracking-widest uppercase transition-colors"
        >
          <SafeIcon name="x" size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Photo */}
          <div className="aspect-[3/4] bg-zinc-800 overflow-hidden">
            <img
              src={PHOTOS[0].src}
              alt="Sergio Musel"
              className="w-full h-full object-cover grayscale"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="font-mono text-white text-2xl md:text-4xl tracking-tight">
              About Me
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-zinc-400 text-sm leading-relaxed">
              <p>
                Based in Prague, I specialize in black and white street photography
                that captures the raw essence of urban life. My work explores the
                interplay between light and shadow, finding beauty in fleeting moments
                of everyday existence.
              </p>
              <p>
                With over a decade of experience shooting exclusively on Leica cameras,
                I've developed a distinctive aesthetic that emphasizes contrast, texture,
                and emotional depth. My photographs have been exhibited across Europe
                and featured in numerous publications.
              </p>
            </div>

            {/* Awards */}
            <div className="pt-8 border-t border-zinc-800">
              <h3 className="font-mono text-zinc-500 text-xs tracking-widest uppercase mb-4">
                Leica Awards & Recognition
              </h3>
              <ul className="font-mono text-zinc-400 text-sm space-y-2">
                <li>2024 - Leica Oskar Barnack Award, Finalist</li>
                <li>2023 - Prague Photo Festival, Best Series</li>
                <li>2022 - European Street Photography, Honorable Mention</li>
                <li>2021 - Leica Monochrome Challenge, Winner</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
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

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/sergiomusel' },
    { name: 'Twitter', url: 'https://twitter.com/sergiomusel' },
    { name: 'Behance', url: 'https://behance.net/sergiomusel' },
    { name: 'Email', url: 'mailto:hello@sergiomusel.com' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #18181b 0%, #7c2d12 50%, #18181b 100%)',
      }}
      onClick={onClose}
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full tv-noise" style={{ position: 'absolute', opacity: 0.3 }} />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 text-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 md:-top-16 md:-right-16 font-mono text-zinc-400 hover:text-white text-xs tracking-widest uppercase transition-colors"
        >
          <SafeIcon name="x" size={24} />
        </button>

        <h2 className="font-mono text-white text-3xl md:text-5xl tracking-tight mb-8">
          Let's Connect
        </h2>

        <div className="space-y-4 mb-12">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-mono text-zinc-300 hover:text-orange-500 text-sm tracking-widest uppercase transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="font-mono text-zinc-500 text-xs space-y-2">
          <p>{currentDate}</p>
          <p>Prague, CZ</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Main App Component
function App() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const dragStart = useRef({ x: 0, y: 0 })
  const canvasStart = useRef({ x: -CANVAS_SIZE / 2, y: -CANVAS_SIZE / 2 })
  const lastPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const rafId = useRef(null)

  // Motion values for smooth animation
  const x = useMotionValue(-CANVAS_SIZE / 2)
  const y = useMotionValue(-CANVAS_SIZE / 2)

  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  // Initialize canvas position
  useEffect(() => {
    x.set(-CANVAS_SIZE / 2)
    y.set(-CANVAS_SIZE / 2)
    canvasStart.current = { x: -CANVAS_SIZE / 2, y: -CANVAS_SIZE / 2 }
  }, [])

  // Mouse event handlers
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
    const vx = velocity.current.x * 2
    const vy = velocity.current.y * 2

    const currentX = x.get()
    const currentY = y.get()

    x.set(currentX + vx)
    y.set(currentY + vy)

    // Boundary checks
    const maxX = 0
    const minX = -CANVAS_SIZE + window.innerWidth
    const maxY = 0
    const minY = -CANVAS_SIZE + window.innerHeight

    const boundedX = Math.max(minX, Math.min(maxX, currentX + vx))
    const boundedY = Math.max(minY, Math.min(maxY, currentY + vy))

    x.set(boundedX)
    y.set(boundedY)
  }, [isDragging, x, y])

  // Touch event handlers
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

    e.preventDefault()

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
      {/* TV Noise Overlay */}
      <div className="tv-noise" />

      {/* Navigation */}
      <Navbar activeModal={activeModal} setActiveModal={setActiveModal} />

      {/* Infinite Canvas Container */}
      <div
        ref={containerRef}
        className={cn( "absolute inset-0 overflow-hidden canvas-container",
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

          {/* Photos - Same layout on all devices */}
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
              <div className="relative w-full h-full overflow-hidden bg-zinc-800 shadow-2xl flex flex-col justify-start">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-auto object-contain align-self-start hover:opacity-50 transition-opacity duration-300"
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
      <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <p className="font-mono text-zinc-500 text-[10px] md:text-xs tracking-widest uppercase">
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