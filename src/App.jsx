import { SafeIcon } from './components/SafeIcon';
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Base photo data - source images
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
  { id: 22, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8284.jpg?', title: 'City Lines', date: '2023.09.05', camera: 'Leica M10-R' },
]

// Generate 900 photos (30x30) by cycling through base photos and shuffling
const generatePhotos = () => {
  const totalPhotos = 900 // 30 columns x 30 rows
  const photos = []

  for (let i = 0; i < totalPhotos; i++) {
    const basePhoto = BASE_PHOTOS[i % BASE_PHOTOS.length]
    photos.push({
      ...basePhoto,
      uniqueId: i, // unique identifier for each instance
    })
  }

  // Shuffle array using Fisher-Yates algorithm
  for (let i = photos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photos[i], photos[j]] = [photos[j], photos[i]]
  }

  return photos
}

const PHOTOS = generatePhotos()

// Grid configuration
const COLS = 30
const ROWS = 30
const CELL_WIDTH = 400
const CELL_HEIGHT = 320
const CANVAS_WIDTH = COLS * CELL_WIDTH
const CANVAS_HEIGHT = ROWS * CELL_HEIGHT

// Generate positions for 30x30 grid with random offsets
const PHOTO_POSITIONS = PHOTOS.map((photo, index) => {
  const col = index % COLS
  const row = Math.floor(index / COLS)

  // Base position in grid
  const baseX = col * CELL_WIDTH + CELL_WIDTH / 2
  const baseY = row * CELL_HEIGHT + CELL_HEIGHT / 2

  // Random offsets for creative disorder (-30% to +30% of cell size)
  const offsetX = (Math.random() - 0.5) * CELL_WIDTH * 0.6
  const offsetY = (Math.random() - 0.5) * CELL_HEIGHT * 0.6

  // Random rotation (-8 to 8 degrees)
  const rotation = (Math.random() - 0.5) * 16

  // Random scale (0.85 to 1.15)
  const scale = 0.85 + Math.random() * 0.3

  // Random size variation
  const isVertical = Math.random() > 0.5
  const width = isVertical ? 200 + Math.random() * 80 : 280 + Math.random() * 100
  const height = isVertical ? 280 + Math.random() * 100 : 200 + Math.random() * 80

  return {
    ...photo,
    x: baseX + offsetX - width / 2,
    y: baseY + offsetY - height / 2,
    width,
    height,
    rotation,
    scale,
    isVertical,
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
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
      {/* Logo */}
      <div
        className="cursor-pointer"
        onClick={() => setActiveModal(null)}
      >
        <h1 className="text-white font-bold text-xl md:text-2xl tracking-tight leading-none">
          SERGIO<br />MUSEL
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 md:gap-10">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={cn(
              "font-mono text-xs md:text-sm tracking-widest uppercase transition-colors duration-300 hover:text-orange-500",
              (activeModal === null && item.label === 'Portfolio') || activeModal === item.label.toLowerCase().replace(' ', '')
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-6xl w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-zinc-400 hover:text-white transition-colors"
        >
          <SafeIcon name="x" size={32} />
        </button>

        {/* Image */}
        <div className="relative max-h-[70vh] overflow-hidden">
          <img
            src={photo.src}
            alt={photo.title}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>

        {/* Info */}
        <div className="mt-8 text-center font-mono text-zinc-400 space-y-2">
          <h2 className="text-white text-lg tracking-widest uppercase">{photo.title}</h2>
          <p className="text-sm">{photo.date}</p>
          <p className="text-sm text-orange-500">{photo.camera}</p>
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-900/98 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-6xl mx-4 my-8 p-8 md:p-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 text-zinc-500 hover:text-white transition-colors"
        >
          <SafeIcon name="x" size={32} />
        </button>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Photo */}
          <div className="relative aspect-[3/4] bg-zinc-800 overflow-hidden">
            <img
              src={BASE_PHOTOS[0].src}
              alt="Sergio Musel"
              className="w-full h-full object-cover grayscale"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-6">
                About Me
              </h2>
              <div className="grid md:grid-cols-2 gap-6 font-mono text-zinc-400 text-sm leading-relaxed">
                <p>
                  Born in Prague and trained in the classical traditions of European photography,
                  I have spent the last decade capturing the subtle interplay between light and shadow
                  in urban environments.
                </p>
                <p>
                  My work is deeply influenced by the Bauhaus movement and the photographic philosophy
                  of Albert Renger-Patzsch. I believe in the objective beauty of the everyday,
                  finding extraordinary moments in ordinary scenes.
                </p>
              </div>
            </div>

            {/* Awards */}
            <div className="border-t border-zinc-800 pt-8">
              <h3 className="text-orange-500 font-mono text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
                <SafeIcon name="award" size={16} />
                Leica Awards & Recognition
              </h3>
              <div className="grid grid-cols-2 gap-4 font-mono text-xs text-zinc-500">
                <div className="space-y-2">
                  <p>2024 - Leica Oskar Barnack Award</p>
                  <p>2023 - World Press Photo (2nd Place)</p>
                  <p>2022 - Sony World Photography Awards</p>
                </div>
                <div className="space-y-2">
                  <p>2021 - Leica Street Photo Festival</p>
                  <p>2020 - IPA International Photography</p>
                  <p>2019 - Prague Photo Festival</p>
                </div>
              </div>
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
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto"
      onClick={onClose}
    >
      {/* Gradient Background with Noise */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-zinc-900 to-black opacity-95" />
      <div className="absolute inset-0 noise-overlay opacity-10" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative z-10 w-full max-w-2xl mx-4 p-8 md:p-16 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 text-zinc-400 hover:text-white transition-colors"
        >
          <SafeIcon name="x" size={32} />
        </button>

        <h2 className="text-white text-5xl md:text-7xl font-bold tracking-tight mb-8">
          Let's Connect
        </h2>

        <p className="text-zinc-300 font-mono text-sm md:text-base mb-12 max-w-md mx-auto leading-relaxed">
          Currently available for commissions and collaborative projects.
          Based in Prague, working worldwide.
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-8 mb-12">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-orange-500 transition-colors"
          >
            <SafeIcon name="instagram" size={28} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-orange-500 transition-colors"
          >
            <SafeIcon name="twitter" size={28} />
          </a>
          <a
            href="mailto:hello@sergiomusel.com"
            className="text-zinc-400 hover:text-orange-500 transition-colors"
          >
            <SafeIcon name="mail" size={28} />
          </a>
        </div>

        {/* Location & Date */}
        <div className="flex justify-center gap-8 font-mono text-xs text-zinc-500 tracking-widest uppercase">
          <span className="flex items-center gap-2">
            <SafeIcon name="map-pin" size={14} />
            Prague, CZ
          </span>
          <span className="flex items-center gap-2">
            <SafeIcon name="calendar" size={14} />
            {currentDate}
          </span>
        </div>

        {/* Email CTA */}
        <div className="mt-12 pt-8 border-t border-zinc-700/50">
          <a
            href="mailto:hello@sergiomusel.com"
            className="inline-block font-mono text-sm text-orange-500 hover:text-orange-400 transition-colors tracking-widest uppercase"
          >
            hello@sergiomusel.com
          </a>
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

  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  // Motion values for smooth dragging
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

  // Initialize canvas position to center
  useEffect(() => {
    const centerX = (window.innerWidth - CANVAS_WIDTH) / 2
    const centerY = (window.innerHeight - CANVAS_HEIGHT) / 2
    x.set(centerX)
    y.set(centerY)
    canvasStart.current = { x: centerX, y: centerY }
  }, [x, y])

  // Mouse/Touch event handlers
  const handleMouseDown = useCallback((e) => {
    if (activeModal) return
    if (e.target.closest('button') || e.target.closest('a')) return

    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    canvasStart.current = { x: springX.get(), y: springY.get() }
    lastPos.current = { x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }

    if (rafId.current) cancelAnimationFrame(rafId.current)
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
        velocity.current.x *= decay
        velocity.current.y *= decay

        x.set(springX.get() + velocity.current.x)
        y.set(springY.get() + velocity.current.y)

        rafId.current = requestAnimationFrame(animate)
      }
    }

    rafId.current = requestAnimationFrame(animate)
  }, [isDragging, springX, springY, x, y])

  // Touch events for mobile
  const handleTouchStart = useCallback((e) => {
    if (activeModal) return
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
          className="absolute bg-zinc-900"
          style={{
            x: springX,
            y: springY,
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT
          }}
        >
          {/* Grid lines for depth */}
          <div className="absolute inset-0 border-4 border-orange-500/10 pointer-events-none" />

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(249 115 22) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(249 115 22) 1px, transparent 1px)
              `,
              backgroundSize: `${CELL_WIDTH}px ${CELL_HEIGHT}px`
            }}
          />

          {/* Photos */}
          {PHOTO_POSITIONS.map((photo) => (
            <div
              key={photo.uniqueId}
              className="absolute cursor-pointer hover:z-10"
              style={{
                left: photo.x,
                top: photo.y,
                width: photo.width,
                height: photo.height,
                transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`,
              }}
              onClick={() => handlePhotoClick(photo)}
            >
              <div className="relative w-full h-full overflow-hidden bg-zinc-800 shadow-2xl transition-transform duration-300 hover:scale-105">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className={cn(
                    'w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500',
                    !photo.isVertical && 'object-contain bg-zinc-900'
                  )}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
              </div>
            </div>
          ))}

          {/* Canvas center marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-orange-500/30 rounded-full" />
        </motion.div>
      </div>

      {/* Instructions overlay */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <p className="font-mono text-zinc-600 text-xs tracking-widest uppercase">
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