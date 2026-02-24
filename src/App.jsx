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

// Generate random positions for photos - avoiding center area for initial view
const generatePhotoPositions = () => {
  const positions = []
  const centerStart = CANVAS_SIZE / 2 - 1000
  const centerEnd = CANVAS_SIZE / 2 + 1000

  PHOTOS.forEach((photo, index) => {
    let x, y, width, height, rotation
    let attempts = 0
    let isOverlap = true

    // Try to find non-overlapping position
    while (isOverlap && attempts < 50) {
      // Random position with padding from edges
      x = Math.random() * (CANVAS_SIZE - 800) + 400
      y = Math.random() * (CANVAS_SIZE - 800) + 400

      // Random size between 280px and 480px
      width = Math.random() * 200 + 280
      height = width * (Math.random() * 0.4 + 0.8) // aspect ratio 0.8 to 1.2

      // Random rotation between -15 and 15 degrees
      rotation = (Math.random() - 0.5) * 30

      // Check if in center "safe zone" (initial viewport)
      const inCenterZone = x > centerStart && x < centerEnd && y > centerStart && y < centerEnd

      // Simple overlap check with previous photos
      isOverlap = false
      for (const pos of positions) {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
        if (distance < 400) {
          isOverlap = true
          break
        }
      }

      // If in center zone, try again unless it's the first few photos
      if (inCenterZone && index > 3) {
        isOverlap = true
      }

      attempts++
    }

    positions.push({
      ...photo,
      x,
      y,
      width,
      height,
      rotation
    })
  })

  return positions
}

const PHOTO_POSITIONS = generatePhotoPositions()

// Navigation Component
const Navigation = ({ isDarkTheme, setIsDarkTheme, setActiveModal, activeModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 transition-colors duration-500",
      isDarkTheme ? "bg-transparent" : "bg-zinc-100/80 backdrop-blur-sm"
    )}>
      {/* Logo */}
      <button
        onClick={scrollToTop}
        className={cn(
          "text-left font-bold tracking-tight leading-none transition-colors duration-300",
          isDarkTheme ? "text-white" : "text-zinc-900"
        )}
      >
        <div className="text-xl md:text-2xl">SERGIO</div>
        <div className="text-xl md:text-2xl">MUSEL</div>
      </button>

      {/* Nav Links */}
      <div className="flex items-center gap-6 md:gap-10">
        <button
          onClick={() => setActiveModal('about')}
          className={cn(
            "hidden md:block text-sm font-medium tracking-wide transition-colors duration-300 hover:text-orange-500",
            isDarkTheme ? "text-white/80" : "text-zinc-700"
          )}
        >
          About Me
        </button>
        <button
          onClick={() => setActiveModal('connect')}
          className={cn(
            "hidden md:block text-sm font-medium tracking-wide transition-colors duration-300 hover:text-orange-500",
            isDarkTheme ? "text-white/80" : "text-zinc-700"
          )}
        >
          Connect
        </button>
        <button
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className={cn(
            "p-2 rounded-none transition-colors duration-300",
            isDarkTheme ? "text-white hover:text-orange-500" : "text-zinc-900 hover:text-orange-600"
          )}
        >
          <SafeIcon name={isDarkTheme ? "sun" : "moon"} size={20} />
        </button>
      </div>
    </nav>
  )
}

// Photo Detail Modal - Opens only when clicking directly on photo
const PhotoDetailModal = ({ photo, onClose, isDarkTheme }) => {
  if (!photo) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8",
        isDarkTheme ? "bg-black/95" : "bg-white/95"
      )}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={cn(
          "relative max-w-6xl w-full max-h-full overflow-auto rounded-none",
          isDarkTheme ? "bg-zinc-900" : "bg-zinc-100"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 z-10 p-2 transition-colors",
            isDarkTheme ? "text-white hover:text-orange-500" : "text-zinc-900 hover:text-orange-600"
          )}
        >
          <SafeIcon name="x" size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-4 md:p-8">
            <img
              src={photo.src}
              alt={photo.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>

          <div className={cn(
            "p-6 md:p-8 md:w-80 flex flex-col justify-center border-t md:border-t-0 md:border-l",
            isDarkTheme ? "border-white/10" : "border-black/10"
          )}>
            <h2 className={cn(
              "text-2xl font-bold mb-2 uppercase tracking-tight",
              isDarkTheme ? "text-white" : "text-zinc-900"
            )}>
              {photo.title}
            </h2>
            <div className={cn(
              "font-mono text-sm space-y-1",
              isDarkTheme ? "text-white/60" : "text-zinc-600"
            )}>
              <p>{photo.date}</p>
              <p>{photo.camera}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// About Me Modal
const AboutMeModal = ({ onClose, isDarkTheme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        "fixed inset-0 z-40 overflow-y-auto",
        isDarkTheme ? "bg-zinc-900" : "bg-zinc-50"
      )}
      onClick={onClose}
    >
      <div
        className="min-h-screen px-6 md:px-12 py-24 md:py-32"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24">
            {/* Photo */}
            <div className="relative">
              <img
                src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg?"
                alt="Sergio Musel"
                className="w-full h-auto grayscale"
              />
            </div>

            {/* Bio */}
            <div className="space-y-8">
              <h2 className={cn(
                "text-4xl md:text-5xl font-bold tracking-tight",
                isDarkTheme ? "text-white" : "text-zinc-900"
              )}>
                About Me
              </h2>

              <div className={cn(
                "space-y-4 text-lg leading-relaxed",
                isDarkTheme ? "text-white/80" : "text-zinc-700"
              )}>
                <p>
                  Sergio Musel is a Prague-based photographer specializing in analog and digital black & white photography. With over 15 years of experience capturing urban landscapes and intimate portraits, his work explores the interplay between light and shadow in modern cities.
                </p>
                <p>
                  His approach combines classical Leica cameras with contemporary techniques, creating timeless images that challenge the viewer's perception of everyday scenes.
                </p>
              </div>

              {/* Awards */}
              <div className="pt-8 border-t border-current border-opacity-20">
                <h3 className={cn(
                  "text-sm font-mono uppercase tracking-widest mb-4",
                  isDarkTheme ? "text-white/60" : "text-zinc-600"
                )}>
                  Recognition
                </h3>
                <ul className={cn(
                  "space-y-2 font-mono text-sm",
                  isDarkTheme ? "text-white/80" : "text-zinc-700"
                )}>
                  <li>Leica Oskar Barnack Award 2023 — Finalist</li>
                  <li>World Press Photo 2022 — Honorable Mention</li>
                  <li>Prague Photo Festival 2021 — Best Series</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Connect Modal - Analog Brutalist Terminal
const ConnectModal = ({ onClose, isDarkTheme }) => {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const date = new Date()
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.')
    setCurrentDate(formatted)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-40 bg-[#101010] overflow-hidden"
      onClick={onClose}
    >
      {/* CRT Noise Overlay with steps animation */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] crt-noise-connect" />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30" />

      {/* Content Container */}
      <div
        className="relative h-full w-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spacer for fixed navigation */}
        <div className="h-24 md:h-32" />

        {/* Main Content Grid */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">

          {/* Hero Typography - Massive Anton Heading */}
          <div className="mb-16 md:mb-24">
            <h1 className="font-['Anton'] text-[18vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] text-white uppercase tracking-[-0.03em]">
              DIRECT<br className="hidden md:block" /> LINE
            </h1>
          </div>

          {/* Terminal Commands Grid */}
          <div className="w-full max-w-4xl">

            {/* Email Block */}
            <a
              href="mailto:hello@sergiomusel.com"
              className="group block border-t border-b border-white/20 py-6 md:py-8 transition-none hover:bg-white rounded-none"
            >
              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-8 items-baseline">
                <span className="font-['IBM_Plex_Mono'] text-xs md:text-sm text-[#FF4400] uppercase tracking-[0.02em]">
                  [ MAILTO ]
                </span>
                <span className="font-['IBM_Plex_Mono'] text-xl md:text-3xl text-white group-hover:text-[#101010] transition-none break-all">
                  hello@sergiomusel.com
                </span>
              </div>
            </a>

            {/* Instagram Block */}
            <a
              href="https://instagram.com/sergiomusel"
              target="_blank"
              rel="noopener noreferrer"
              className="group block border-b border-white/20 py-6 md:py-8 transition-none hover:bg-white rounded-none"
            >
              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-8 items-baseline">
                <span className="font-['IBM_Plex_Mono'] text-xs md:text-sm text-[#FF4400] uppercase tracking-[0.02em]">
                  [ INSTAGRAM_DIR ]
                </span>
                <span className="font-['IBM_Plex_Mono'] text-xl md:text-3xl text-white group-hover:text-[#101010] transition-none">
                  @sergiomusel
                </span>
              </div>
            </a>

            {/* Location Block */}
            <div className="block border-b border-white/20 py-6 md:py-8 rounded-none">
              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-8 items-baseline">
                <span className="font-['IBM_Plex_Mono'] text-xs md:text-sm text-[#FF4400] uppercase tracking-[0.02em]">
                  [ LOC ]
                </span>
                <span className="font-['IBM_Plex_Mono'] text-xl md:text-3xl text-white/40">
                  Prague, CZ
                </span>
              </div>
            </div>

            {/* Status Block */}
            <div className="block border-b border-white/20 py-6 md:py-8 rounded-none">
              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-8 items-baseline">
                <span className="font-['IBM_Plex_Mono'] text-xs md:text-sm text-[#FF4400] uppercase tracking-[0.02em]">
                  [ STATUS ]
                </span>
                <span className="font-['IBM_Plex_Mono'] text-xl md:text-3xl text-white/40 uppercase">
                  Available for Projects
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Metadata Footer - Bottom Center */}
        <div className="flex justify-center px-6 py-8 md:py-12">
          <div className="text-center">
            <p className="font-['IBM_Plex_Mono'] text-[11px] md:text-xs text-white/40 uppercase tracking-[0.02em]">
              {currentDate} // UTC+1 // Prague, CZ // 50.0755° N, 14.4378° E
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Main App Component
const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [activeModal, setActiveModal] = useState(null) // 'about', 'connect', or null
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  // Canvas drag state
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const scrollLeft = useRef(0)
  const scrollTop = useRef(0)
  const velocityX = useRef(0)
  const velocityY = useRef(0)
  const lastX = useRef(0)
  const lastY = useRef(0)
  const lastTime = useRef(0)
  const animationFrame = useRef(null)

  // Motion values for smooth inertia
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 300, damping: 30 })
  const smoothY = useSpring(y, { stiffness: 300, damping: 30 })

  // Initialize scroll to center
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      container.scrollLeft = (CANVAS_SIZE - window.innerWidth) / 2
      container.scrollTop = (CANVAS_SIZE - window.innerHeight) / 2
    }
  }, [])

  // Handle mouse down
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.photo-item')) return // Don't drag when clicking photos
    isDragging.current = true
    startX.current = e.pageX - containerRef.current.offsetLeft
    startY.current = e.pageY - containerRef.current.offsetTop
    scrollLeft.current = containerRef.current.scrollLeft
    scrollTop.current = containerRef.current.scrollTop
    lastX.current = e.pageX
    lastY.current = e.pageY
    lastTime.current = Date.now()
    velocityX.current = 0
    velocityY.current = 0
    containerRef.current.style.cursor = 'grabbing'
  }, [])

  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return
    e.preventDefault()

    const x = e.pageX - containerRef.current.offsetLeft
    const y = e.pageY - containerRef.current.offsetTop
    const walkX = (x - startX.current) * 1.5
    const walkY = (y - startY.current) * 1.5

    containerRef.current.scrollLeft = scrollLeft.current - walkX
    containerRef.current.scrollTop = scrollTop.current - walkY

    // Calculate velocity for inertia
    const now = Date.now()
    const dt = now - lastTime.current
    if (dt > 0) {
      velocityX.current = (e.pageX - lastX.current) / dt * 15
      velocityY.current = (e.pageY - lastY.current) / dt * 15
    }
    lastX.current = e.pageX
    lastY.current = e.pageY
    lastTime.current = now
  }, [])

  // Handle mouse up with inertia
  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    containerRef.current.style.cursor = 'grab'

    // Apply inertia
    const decelerate = () => {
      if (Math.abs(velocityX.current) > 0.5 || Math.abs(velocityY.current) > 0.5) {
        containerRef.current.scrollLeft -= velocityX.current
        containerRef.current.scrollTop -= velocityY.current
        velocityX.current *= 0.95 // friction
        velocityY.current *= 0.95
        animationFrame.current = requestAnimationFrame(decelerate)
      }
    }
    decelerate()
  }, [])

  // Touch events for mobile
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0]
    startX.current = touch.pageX - containerRef.current.offsetLeft
    startY.current = touch.pageY - containerRef.current.offsetTop
    scrollLeft.current = containerRef.current.scrollLeft
    scrollTop.current = containerRef.current.scrollTop
    lastX.current = touch.pageX
    lastY.current = touch.pageY
    lastTime.current = Date.now()
    velocityX.current = 0
    velocityY.current = 0
  }, [])

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0]
    const x = touch.pageX - containerRef.current.offsetLeft
    const y = touch.pageY - containerRef.current.offsetTop
    const walkX = (x - startX.current) * 1.5
    const walkY = (y - startY.current) * 1.5

    containerRef.current.scrollLeft = scrollLeft.current - walkX
    containerRef.current.scrollTop = scrollTop.current - walkY

    const now = Date.now()
    const dt = now - lastTime.current
    if (dt > 0) {
      velocityX.current = (touch.pageX - lastX.current) / dt * 15
      velocityY.current = (touch.pageY - lastY.current) / dt * 15
    }
    lastX.current = touch.pageX
    lastY.current = touch.pageY
    lastTime.current = now
  }, [])

  const handleTouchEnd = useCallback(() => {
    const decelerate = () => {
      if (Math.abs(velocityX.current) > 0.5 || Math.abs(velocityY.current) > 0.5) {
        containerRef.current.scrollLeft -= velocityX.current
        containerRef.current.scrollTop -= velocityY.current
        velocityX.current *= 0.95
        velocityY.current *= 0.95
        animationFrame.current = requestAnimationFrame(decelerate)
      }
    }
    decelerate()
  }, [])

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [])

  const closeModal = () => {
    setActiveModal(null)
    setSelectedPhoto(null)
  }

  return (
    <div className={cn(
      "relative w-screen h-screen overflow-hidden",
      isDarkTheme ? "bg-zinc-900" : "bg-zinc-100"
    )}>
      {/* TV Noise Effect */}
      <div className={isDarkTheme ? "tv-noise-dark" : "tv-noise-light"} />

      {/* Navigation - Always on top */}
      <Navigation
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        setActiveModal={setActiveModal}
        activeModal={activeModal}
      />

      {/* Infinite Canvas */}
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 overflow-auto no-scrollbar cursor-grab active:cursor-grabbing",
          activeModal ? "pointer-events-none" : ""
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative"
          style={{
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            minWidth: CANVAS_SIZE,
            minHeight: CANVAS_SIZE
          }}
        >
          {/* Photos scattered on canvas */}
          {PHOTO_POSITIONS.map((photo) => (
            <div
              key={photo.id}
              className="absolute photo-item"
              style={{
                left: photo.x,
                top: photo.y,
                width: photo.width,
                transform: `rotate(${photo.rotation}deg)`,
                zIndex: 10
              }}
            >
              <div className="relative group">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className={cn(
                    "w-full h-auto object-cover shadow-2xl transition-all duration-500 grayscale hover:grayscale-0",
                    isDarkTheme ? "brightness-90 hover:brightness-110" : "brightness-100 hover:brightness-110",
                    "cursor-pointer"
                  )}
                  style={{ height: 'auto' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedPhoto(photo)
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  draggable={false}
                />
                {/* Hover info */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                  isDarkTheme ? "bg-black/70" : "bg-white/70"
                )}>
                  <p className={cn(
                    "text-xs font-mono uppercase tracking-wider",
                    isDarkTheme ? "text-white" : "text-zinc-900"
                  )}>
                    {photo.title}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Center marker (subtle) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className={cn(
              "w-2 h-2 rounded-full opacity-20",
              isDarkTheme ? "bg-white" : "bg-zinc-900"
            )} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoDetailModal
            photo={selectedPhoto}
            onClose={closeModal}
            isDarkTheme={isDarkTheme}
          />
        )}
        {activeModal === 'about' && (
          <AboutMeModal onClose={closeModal} isDarkTheme={isDarkTheme} />
        )}
        {activeModal === 'connect' && (
          <ConnectModal onClose={closeModal} isDarkTheme={isDarkTheme} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App