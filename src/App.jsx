import { SafeIcon } from './components/SafeIcon';
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Photo data - mixed vertical and horizontal orientations
const PHOTOS = [
  { id: 1, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg', title: 'Urban Solitude', date: '2023.11.15', camera: 'Leica M10-R', isVertical: true },
  { id: 2, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-2291.jpg', title: 'Shadow Play', date: '2023.10.22', camera: 'Leica Q2', isVertical: true },
  { id: 3, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-7476.jpg', title: 'Morning Light', date: '2024.01.08', camera: 'Leica M6', isVertical: false },
  { id: 4, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-3765.jpg', title: 'Silent Streets', date: '2023.09.14', camera: 'Leica M10-R', isVertical: true },
  { id: 5, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8936.jpg', title: 'Contrast', date: '2024.02.01', camera: 'Leica Q2 Monochrom', isVertical: false },
  { id: 6, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-7385.jpg', title: 'Analog Dreams', date: '2023.12.03', camera: 'Leica M6', isVertical: true },
  { id: 7, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8284.jpg', title: 'Reflections', date: '2024.01.20', camera: 'Leica M10-R', isVertical: false },
  { id: 8, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8710.jpg', title: 'Timeless', date: '2023.08.30', camera: 'Leica Q2', isVertical: true },
  { id: 9, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453883-2278.jpg', title: 'Raw Emotion', date: '2024.02.15', camera: 'Leica M6', isVertical: false },
  { id: 10, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453883-1442.jpg', title: 'Fleeting Moment', date: '2023.11.28', camera: 'Leica M10-R', isVertical: true },
  { id: 11, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-8417.jpg', title: 'Depth', date: '2024.01.12', camera: 'Leica Q2 Monochrom', isVertical: true },
  { id: 12, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-9947.jpg', title: 'Still Life', date: '2023.10.05', camera: 'Leica M6', isVertical: false },
  { id: 13, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-9719.jpg', title: 'Geometry', date: '2024.02.20', camera: 'Leica M10-R', isVertical: true },
  { id: 14, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-1425.jpg', title: 'Light Study', date: '2023.09.22', camera: 'Leica Q2', isVertical: false },
  { id: 15, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453925-5244.jpg', title: 'Fragments', date: '2024.01.30', camera: 'Leica M6', isVertical: true },
  { id: 16, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg', title: 'Urban Echo', date: '2023.12.15', camera: 'Leica M10-R', isVertical: false },
  { id: 17, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-2291.jpg', title: 'Shadow Dance', date: '2024.03.01', camera: 'Leica Q2', isVertical: true },
  { id: 18, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-7476.jpg', title: 'Golden Hour', date: '2023.11.20', camera: 'Leica M6', isVertical: false },
  { id: 19, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-3765.jpg', title: 'Night Walk', date: '2024.02.28', camera: 'Leica M10-R', isVertical: true },
  { id: 20, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8936.jpg', title: 'Monochrome', date: '2023.10.10', camera: 'Leica Q2 Monochrom', isVertical: false },
  { id: 21, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-7385.jpg', title: 'Film Memories', date: '2024.01.25', camera: 'Leica M6', isVertical: true },
  { id: 22, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8284.jpg', title: 'Mirror World', date: '2023.09.05', camera: 'Leica M10-R', isVertical: false },
  { id: 23, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8710.jpg', title: 'Silent Witness', date: '2024.03.10', camera: 'Leica Q2', isVertical: true },
  { id: 24, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453883-2278.jpg', title: 'Frame Within', date: '2023.12.20', camera: 'Leica M6', isVertical: false },
]

// Generate random positions for photos with varied sizes
const GRID_WIDTH = 4000
const GRID_HEIGHT = 3000

const PHOTO_POSITIONS = PHOTOS.map((photo, index) => {
  const isVertical = photo.isVertical
  const baseWidth = isVertical ? 320 : 480
  const baseHeight = isVertical ? 420 : 320

  return {
    ...photo,
    uniqueId: `${photo.id}-${index}`,
    x: Math.random() * (GRID_WIDTH - baseWidth - 400) + 200,
    y: Math.random() * (GRID_HEIGHT - baseHeight - 400) + 200,
    width: baseWidth,
    height: baseHeight,
    rotation: (Math.random() - 0.5) * 6,
    scale: 0.9 + Math.random() * 0.2
  }
})

// Photo Modal Component
function PhotoModal({ photo, onClose }) {
  if (!photo) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
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
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-zinc-400 hover:text-white transition-colors"
        >
          <SafeIcon name="x" size={24} />
        </button>

        <div className={cn(
          "relative overflow-hidden bg-zinc-900",
          photo.isVertical ? "h-[80vh] w-auto" : "w-[85vw] h-auto max-h-[70vh]"
        )}>
          <img
            src={photo.src}
            alt={photo.title}
            className={cn(
              "object-contain",
              photo.isVertical ? "h-full w-auto" : "w-full h-auto"
            )}
          />
        </div>

        <div className="mt-6 text-center font-mono text-zinc-400 text-sm">
          <p className="text-white text-lg mb-1">{photo.title}</p>
          <p>{photo.date} — {photo.camera}</p>
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
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-900/98 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-6xl mx-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-zinc-400 hover:text-white transition-colors z-10"
        >
          <SafeIcon name="x" size={24} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
          <div className="aspect-[3/4] bg-zinc-800 overflow-hidden">
            <img
              src={PHOTOS[0].src}
              alt="Sergio Musel"
              className="w-full h-full object-cover grayscale"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="font-mono text-4xl text-white mb-8 tracking-tight">Sergio Musel</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-zinc-400 text-sm leading-relaxed">
              <p>
                Born in Prague and trained in the traditions of European documentary photography,
                Sergio Musel has spent over two decades capturing the quiet poetry of urban landscapes.
                His work explores the intersection of light and shadow, finding beauty in overlooked moments.
              </p>
              <p>
                Working exclusively with analog and digital Leica systems, Sergio maintains a
                commitment to the craft of photography that transcends the digital age. His images
                are characterized by their stark contrast and emotional depth.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-800">
              <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">Recognition</h3>
              <ul className="font-mono text-zinc-400 text-sm space-y-2">
                <li>Leica Oskar Barnack Award 2023 — Finalist</li>
                <li>World Press Photo — Honorable Mention 2022</li>
                <li>European Photo Exhibition — Featured Artist 2021</li>
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
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #1a0f00 0%, #0a0a0a 50%, #1c1001 100%)'
      }}
      onClick={onClose}
    >
      <div className="noise-overlay !opacity-[0.08]" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative text-center p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-zinc-500 hover:text-orange-500 transition-colors"
        >
          <SafeIcon name="x" size={24} />
        </button>

        <h2 className="font-mono text-5xl text-white mb-4 tracking-tight">Let's Connect</h2>
        <p className="font-mono text-zinc-500 text-sm mb-12">Prague, CZ</p>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-16">
          <a href="mailto:hello@sergiomuseel.com" className="group flex items-center gap-3 font-mono text-zinc-400 hover:text-orange-500 transition-colors">
            <SafeIcon name="mail" size={20} />
            <span>hello@sergiomusel.com</span>
          </a>
          <a href="#" className="group flex items-center gap-3 font-mono text-zinc-400 hover:text-orange-500 transition-colors">
            <SafeIcon name="instagram" size={20} />
            <span>@sergiomusel</span>
          </a>
          <a href="#" className="group flex items-center gap-3 font-mono text-zinc-400 hover:text-orange-500 transition-colors">
            <SafeIcon name="twitter" size={20} />
            <span>@smusel</span>
          </a>
        </div>

        <div className="font-mono text-zinc-600 text-xs tracking-widest">
          <p>{formattedDate}</p>
          <p className="mt-1">{formattedTime} CET</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Navbar Component
function Navbar({ activeModal, setActiveModal }) {
  const navItems = [
    { label: 'Portfolio', action: () => setActiveModal(null) },
    { label: 'About Me', action: () => setActiveModal('about') },
    { label: 'Connect', action: () => setActiveModal('connect') },
    { label: 'Blog', action: () => {} },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-start p-8 pointer-events-none">
      <div className="pointer-events-auto">
        <h1
          className="font-mono text-2xl text-white leading-tight cursor-pointer hover:text-orange-500 transition-colors"
          onClick={() => setActiveModal(null)}
        >
          SERGIO<br/>MUSEL
        </h1>
      </div>

      <div className="flex gap-8 pointer-events-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={cn(
              "font-mono text-sm tracking-wider transition-colors relative",
              (activeModal === null && item.label === 'Portfolio') || activeModal === item.label.toLowerCase().replace(' ', '')
                ? "text-orange-500"
                : "text-zinc-400 hover:text-white"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

// Main App Component
function App() {
  const [isDragging, setIsDragging] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const dragStart = useRef({ x: 0, y: 0 })
  const canvasStart = useRef({ x: 0, y: 0 })
  const lastPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const rafId = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 150, damping: 30, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 150, damping: 30, mass: 0.5 })

  // Mouse/Touch handlers
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
    const vx = velocity.current.x * 15
    const vy = velocity.current.y * 15

    x.set(springX.get() + vx)
    y.set(springY.get() + vy)
  }, [isDragging, springX, springY, x, y])

  // Touch handlers
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
          style={{
            x: springX,
            y: springY,
            width: GRID_WIDTH,
            height: GRID_HEIGHT
          }}
          className="absolute bg-zinc-900"
        >
          {/* Grid lines for depth */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" />
          </div>

          {/* Photos */}
          {PHOTO_POSITIONS.map((photo) => (
            <div
              key={photo.uniqueId}
              className="absolute cursor-pointer hover:opacity-80 transition-all duration-300 photo-item"
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
                    'w-full h-full transition-opacity duration-300',
                    photo.isVertical ? 'object-cover' : 'object-cover'
                  )}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
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