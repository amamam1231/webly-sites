import { SafeIcon } from './components/SafeIcon';
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Base Photo data (30 photos)
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
  { id: 22, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8284.jpg?', title: 'Mirror World', date: '2023.12.18', camera: 'Leica M10-R' },
  { id: 23, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8710.jpg?', title: 'City Rhythm', date: '2024.03.10', camera: 'Leica Q2' },
  { id: 24, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453883-2278.jpg?', title: 'Silent Witness', date: '2023.09.05', camera: 'Leica M6' },
  { id: 25, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453883-1442.jpg?', title: 'Passing Time', date: '2024.02.22', camera: 'Leica M10-R' },
  { id: 26, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-8417.jpg?', title: 'Structural', date: '2023.11.12', camera: 'Leica Q2 Monochrom' },
  { id: 27, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-9947.jpg?', title: 'Void', date: '2024.01.05', camera: 'Leica M6' },
  { id: 28, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-9719.jpg?', title: 'Intersection', date: '2023.10.28', camera: 'Leica M10-R' },
  { id: 29, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-1425.jpg?', title: 'Fade In', date: '2024.03.15', camera: 'Leica Q2' },
  { id: 30, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453925-5244.jpg?', title: 'Last Light', date: '2023.12.30', camera: 'Leica M6' },
]

// Generate positions for base photos (scattered in top-left quadrant area)
const generateBasePositions = () => {
  return BASE_PHOTOS.map((photo, index) => {
    const isVertical = index % 3 === 0
    const baseWidth = isVertical ? 280 : 420
    const baseHeight = isVertical ? 420 : 280

    // Scatter in 0-1800 range to leave margin
    const col = index % 6
    const row = Math.floor(index / 6)
    const baseX = 200 + col * 300 + Math.random() * 100
    const baseY = 200 + row * 300 + Math.random() * 100

    return {
      ...photo,
      x: baseX,
      y: baseY,
      width: baseWidth,
      height: baseHeight,
      rotation: (Math.random() - 0.5) * 20,
      scale: 0.9 + Math.random() * 0.2,
      isVertical,
    }
  })
}

// Duplicate photos to create 2x2 grid (2x rows and 2x columns = 4x total)
const QUADRANT_OFFSETS = [
  { x: 0, y: 0 },
  { x: 2000, y: 0 },
  { x: 0, y: 2000 },
  { x: 2000, y: 2000 },
]

const PHOTO_POSITIONS = []
const basePositions = generateBasePositions()

QUADRANT_OFFSETS.forEach((offset, quadIndex) => {
  basePositions.forEach((photo, idx) => {
    PHOTO_POSITIONS.push({
      ...photo,
      id: `${photo.id}-${quadIndex}`, // Unique ID for each duplicate
      originalId: photo.id,
      x: photo.x + offset.x,
      y: photo.y + offset.y,
      // Slightly vary rotation and scale for each quadrant to look natural
      rotation: photo.rotation + (Math.random() - 0.5) * 5,
      scale: photo.scale * (0.95 + Math.random() * 0.1),
    })
  })
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
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between p-6 md:p-8 pointer-events-none">
      <div className="pointer-events-auto">
        <h1 className="font-mono text-white text-xl md:text-2xl font-bold tracking-tight leading-tight">
          SERGIO<br />MUSEL
        </h1>
      </div>

      <div className="flex flex-col items-end gap-3 pointer-events-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={cn(
              "font-mono text-xs md:text-sm tracking-widest uppercase transition-colors duration-300 hover:text-orange-500",
              activeModal === item.label.toLowerCase().replace(' ', '') ||
              (item.label === 'Portfolio' && !activeModal) ? "text-orange-500" : "text-zinc-400"
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-zinc-400 hover:text-white transition-colors"
        >
          <SafeIcon name="x" size={32} />
        </button>

        <img
          src={photo.src}
          alt={photo.title}
          className="max-w-full max-h-[70vh] object-contain"
        />

        <div className="mt-6 text-center">
          <h2 className="font-mono text-white text-lg mb-2">{photo.title}</h2>
          <div className="flex items-center justify-center gap-6 text-zinc-400 font-mono text-xs tracking-wider">
            <span>{photo.date}</span>
            <span className="w-1 h-1 bg-zinc-600 rounded-full" />
            <span>{photo.camera}</span>
          </div>
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-900/95 backdrop-blur-md p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 p-6 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 text-zinc-400 hover:text-white transition-colors"
        >
          <SafeIcon name="x" size={28} />
        </button>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="aspect-[3/4] bg-zinc-900 overflow-hidden">
            <img
              src={BASE_PHOTOS[0].src}
              alt="Sergio Musel"
              className="w-full h-full object-cover grayscale"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="font-mono text-white text-2xl md:text-3xl font-bold mb-6">About Me</h2>
            <div className="space-y-4 text-zinc-400 font-mono text-sm leading-relaxed">
              <p>
                Born in Prague and trained in the traditions of analog photography,
                I have spent the last decade capturing the silent poetry of urban landscapes.
                My work explores the intersection of light and shadow, finding beauty in
                fleeting moments that often go unnoticed.
              </p>
              <p>
                Specializing in black and white photography, I believe that removing color
                reveals the true essence of a scene—the raw emotion, the geometric purity,
                the timeless quality that transcends the moment of capture.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-800">
              <h3 className="font-mono text-orange-500 text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                <SafeIcon name="award" size={16} />
                Leica Master Awards
              </h3>
              <ul className="space-y-2 text-zinc-500 font-mono text-xs">
                <li>2024 - Excellence in Monochrome Photography</li>
                <li>2023 - Urban Perspectives Series Recognition</li>
                <li>2022 - Leica M10-R Challenge Winner</li>
                <li>2021 - Emerging Talent Award</li>
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
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-orange-950 via-zinc-900 to-black p-4"
      onClick={onClose}
    >
      <div className="noise-overlay" style={{ opacity: 0.08, zIndex: 41 }} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-50 text-center max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-16 right-0 text-zinc-400 hover:text-white transition-colors"
        >
          <SafeIcon name="x" size={32} />
        </button>

        <h2 className="font-mono text-white text-3xl md:text-5xl font-bold mb-8 tracking-tight">
          LET'S CONNECT
        </h2>

        <div className="flex flex-col items-center gap-6 mb-12">
          <a
            href="mailto:hello@sergiomusel.com"
            className="group flex items-center gap-3 text-zinc-300 hover:text-orange-500 transition-colors font-mono text-sm"
          >
            <SafeIcon name="mail" size={20} />
            hello@sergiomusel.com
          </a>

          <div className="flex items-center gap-8">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-500 transition-colors">
              <SafeIcon name="instagram" size={28} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-500 transition-colors">
              <SafeIcon name="twitter" size={28} />
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 text-zinc-500 font-mono text-xs tracking-widest">
          <span className="flex items-center gap-2">
            <SafeIcon name="map-pin" size={14} />
            PRAGUE, CZ
          </span>
          <span className="flex items-center gap-2">
            <SafeIcon name="calendar" size={14} />
            {currentDate}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Main App Component
function App() {
  const [activeModal, setActiveModal] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const dragStart = useRef({ x: 0, y: 0 })
  const canvasStart = useRef({ x: 0, y: 0 })
  const lastPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const rafId = useRef(null)

  // Motion values for canvas position
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  // Center the canvas on initial load
  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      const centerX = -2000 + window.innerWidth / 2
      const centerY = -2000 + window.innerHeight / 2
      x.set(centerX)
      y.set(centerY)
      setIsInitialized(true)
    }
  }, [isInitialized, x, y])

  // Mouse/Touch event handlers
  const handleMouseDown = useCallback((e) => {
    if (activeModal) return
    if (e.target.closest('.photo-item') || e.target.closest('button') || e.target.closest('nav')) return

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
      if (Math.abs(velocity.current.x) > minVelocity || Math.abs(velocity.current.y) > minVelocity) {
        x.set(springX.get() + velocity.current.x)
        y.set(springY.get() + velocity.current.y)

        velocity.current.x *= decay
        velocity.current.y *= decay

        rafId.current = requestAnimationFrame(animate)
      }
    }

    rafId.current = requestAnimationFrame(animate)
  }, [isDragging, springX, springY, x, y])

  const handleTouchStart = useCallback((e) => {
    if (activeModal) return
    if (e.target.closest('.photo-item') || e.target.closest('button') || e.target.closest('nav')) return

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
          className="absolute w-[4000px] h-[4000px] bg-zinc-900"
        >
          {/* Grid lines for depth */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full"
              style={{
                backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
                backgroundSize: '500px 500px'
              }}
            />
          </div>

          {/* Photos - 120 items (30 base x 4 quadrants) */}
          {PHOTO_POSITIONS.map((photo) => (
            <div
              key={photo.id}
              className="photo-item absolute cursor-pointer hover:opacity-50 transition-all duration-300"
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
                "relative w-full h-full overflow-hidden bg-zinc-800 shadow-2xl",
                photo.isVertical ? "aspect-[2/3]" : "aspect-[3/2]"
              )}>
                <img
                  src={photo.src}
                  alt={photo.title}
                  className={cn(
                    'w-full h-full object-cover hover:opacity-50 transition-opacity duration-300',
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

          {/* Quadrant labels for orientation */}
          <div className="absolute left-[1000px] top-[1000px] text-zinc-800 font-mono text-xs tracking-widest opacity-20 pointer-events-none">I</div>
          <div className="absolute left-[3000px] top-[1000px] text-zinc-800 font-mono text-xs tracking-widest opacity-20 pointer-events-none">II</div>
          <div className="absolute left-[1000px] top-[3000px] text-zinc-800 font-mono text-xs tracking-widest opacity-20 pointer-events-none">III</div>
          <div className="absolute left-[3000px] top-[3000px] text-zinc-800 font-mono text-xs tracking-widest opacity-20 pointer-events-none">IV</div>
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