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

// Random grid positions for photos
const generatePositions = () => {
  const positions = []
  const usedRects = []
  const padding = 100
  const photoWidth = 320
  const photoHeight = 400

  for (let i = 0; i < PHOTOS.length; i++) {
    let attempts = 0
    let pos

    do {
      pos = {
        x: Math.random() * (CANVAS_SIZE - photoWidth - padding * 2) + padding,
        y: Math.random() * (CANVAS_SIZE - photoHeight - padding * 2) + padding,
      }
      attempts++
    } while (attempts < 50 && usedRects.some(rect =>
      pos.x < rect.x + rect.width + padding &&
      pos.x + photoWidth > rect.x - padding &&
      pos.y < rect.y + rect.height + padding &&
      pos.y + photoHeight > rect.y - padding
    ))

    usedRects.push({ x: pos.x, y: pos.y, width: photoWidth, height: photoHeight })
    positions.push(pos)
  }

  return positions
}

const PHOTO_POSITIONS = generatePositions()

// === COMPONENTS ===

// Navigation Component
function Navigation({ onNavigate, activeModal, isDarkTheme, toggleTheme }) {
  const navItems = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'about', label: 'About Me' },
    { id: 'connect', label: 'Connect' },
    { id: 'blog', label: 'Blog' },
  ]

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex justify-between items-start pointer-events-none",
      isDarkTheme ? "text-white" : "text-zinc-900"
    )}>
      {/* Logo */}
      <div className="pointer-events-auto">
        <h1
          className={cn(
            "text-2xl md:text-3xl font-bold leading-tight tracking-tight cursor-pointer select-none",
            isDarkTheme ? "text-white" : "text-zinc-900"
          )}
          style={{ fontFamily: 'Anton, sans-serif' }}
          onClick={() => onNavigate('portfolio')}
        >
          SERGIO<br/>MUSEL
        </h1>
      </div>

      {/* Nav Links */}
      <div className="flex gap-6 md:gap-8 pointer-events-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "text-xs md:text-sm uppercase tracking-widest transition-colors duration-0 hover:text-orange-500",
              activeModal === item.id ? "text-orange-500" : isDarkTheme ? "text-zinc-400" : "text-zinc-600"
            )}
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={toggleTheme}
          className={cn(
            "text-xs md:text-sm uppercase tracking-widest transition-colors duration-0 hover:text-orange-500",
            isDarkTheme ? "text-zinc-400" : "text-zinc-600"
          )}
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {isDarkTheme ? 'Light' : 'Dark'}
        </button>
      </div>
    </nav>
  )
}

// Photo Modal Component
function PhotoModal({ photo, onClose, isDarkTheme }) {
  if (!photo) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8",
        isDarkTheme ? "bg-black/95" : "bg-white/95"
      )}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative max-w-5xl w-full max-h-full overflow-auto",
          isDarkTheme ? "text-white" : "text-zinc-900"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full text-sm uppercase tracking-widest transition-colors duration-0",
            isDarkTheme
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
          )}
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          <SafeIcon name="x" size={20} />
        </button>

        <img
          src={photo.src}
          alt={photo.title}
          className="w-full h-auto max-h-[80vh] object-contain"
        />

        <div className={cn(
          "mt-4 pt-4 border-t",
          isDarkTheme ? "border-zinc-800" : "border-zinc-200"
        )}>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Anton, sans-serif' }}>{photo.title}</h2>
          <p className="text-sm opacity-60" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {photo.date} — {photo.camera}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// About Modal Component
function AboutModal({ onClose, isDarkTheme }) {
  const awards = [
    'Leica Oskar Barnack Award 2023 — Finalist',
    'World Press Photo 2023 — Honorable Mention',
    'Sony World Photography Awards 2022 — Shortlist',
    'LensCulture Street Photography Awards 2022 — Finalist',
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-[60] overflow-y-auto",
        isDarkTheme ? "bg-zinc-950/98" : "bg-white/98"
      )}
      onClick={onClose}
    >
      <div
        className="min-h-screen px-6 py-24 md:px-12 md:py-32"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={cn(
            "fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full text-sm uppercase tracking-widest transition-colors duration-0",
            isDarkTheme
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
          )}
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          <SafeIcon name="x" size={20} />
        </button>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Photo */}
          <div className="relative">
            <div className={cn(
              "aspect-[3/4] w-full",
              isDarkTheme ? "bg-zinc-900" : "bg-zinc-100"
            )}>
              <img
                src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg?"
                alt="Sergio Musel"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>

          {/* Content */}
          <div className={cn(
            "flex flex-col justify-center",
            isDarkTheme ? "text-white" : "text-zinc-900"
          )}>
            <h2
              className="text-5xl md:text-7xl font-bold mb-8 uppercase tracking-tight"
              style={{ fontFamily: 'Anton, sans-serif' }}
            >
              About Me
            </h2>

            <div className="grid grid-cols-1 gap-6 mb-12">
              <p className={cn(
                "text-sm md:text-base leading-relaxed",
                isDarkTheme ? "text-zinc-400" : "text-zinc-600"
              )} style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                Sergio Musel is a Prague-based photographer specializing in black and white street photography.
                With over a decade of experience capturing urban landscapes and human emotions,
                his work explores the intersection of light, shadow, and the human condition.
              </p>
              <p className={cn(
                "text-sm md:text-base leading-relaxed",
                isDarkTheme ? "text-zinc-400" : "text-zinc-600"
              )} style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                Working exclusively with Leica cameras, Sergio brings an analog sensibility to digital photography,
                creating images that feel timeless and deeply personal. His photographs have been exhibited
                across Europe and featured in numerous international publications.
              </p>
            </div>

            {/* Awards */}
            <div>
              <h3
                className="text-xs uppercase tracking-widest mb-4 text-orange-500"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                Recognition
              </h3>
              <ul className="space-y-2">
                {awards.map((award, index) => (
                  <li
                    key={index}
                    className={cn(
                      "text-sm",
                      isDarkTheme ? "text-zinc-500" : "text-zinc-600"
                    )}
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  >
                    {award}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Connect Modal Component - REDESIGNED
function ConnectModal({ onClose }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.')

  const links = [
    { label: '[ IG ]', value: '@sergiomusel', href: 'https://instagram.com/sergiomusel' },
    { label: '[ X  ]', value: '@sergiomusel', href: 'https://x.com/sergiomusel' },
    { label: '[ MAIL ]', value: 'hello@sergiomusel.com', href: 'mailto:hello@sergiomusel.com' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#101010]"
      onClick={onClose}
    >
      {/* Close button - top right */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-transparent text-white text-xs uppercase tracking-widest font-mono hover:bg-white hover:text-[#101010] transition-none duration-0 border border-white/20"
        style={{ fontFamily: 'IBM Plex Mono, monospace' }}
      >
        <SafeIcon name="x" size={20} />
      </button>

      {/* Main content container */}
      <div
        className="h-full w-full flex flex-col justify-center px-6 md:px-12 lg:px-24"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-6xl w-full">
          {/* Main Title - Anton font, brutalist styling */}
          <h1
            className="text-white uppercase text-6xl md:text-8xl mb-8 md:mb-12"
            style={{
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '-0.03em',
              lineHeight: '0.85'
            }}
          >
            LET'S CONNECT
          </h1>

          {/* Subtext - IBM Plex Mono */}
          <p
            className="text-zinc-500 text-sm md:text-base mb-12 md:mb-16 font-mono"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            AVAILABLE FOR PROJECTS AND COLLABORATIONS
          </p>

          {/* Contact Links - Terminal style */}
          <div className="space-y-0 border-t border-zinc-800">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-4 md:py-6 border-b border-zinc-800 bg-transparent hover:bg-white transition-none duration-0"
              >
                <span
                  className="text-zinc-500 text-sm md:text-base font-mono group-hover:text-[#101010]"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {link.label}
                </span>
                <span
                  className="text-white text-sm md:text-base font-mono group-hover:text-[#101010]"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {link.value}
                </span>
              </a>
            ))}
          </div>

          {/* Footer info - Terminal coordinates */}
          <div className="mt-12 md:mt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div
              className="text-zinc-600 text-xs font-mono"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              LOC: PRAGUE, CZ
            </div>
            <div
              className="text-zinc-600 text-xs font-mono"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              {currentDate}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Blog Modal Component
function BlogModal({ onClose, isDarkTheme }) {
  const posts = [
    { title: 'The Art of Seeing', date: '2024.01.15', excerpt: 'On developing a photographer\'s eye in the digital age.' },
    { title: 'Leica M6: A Love Letter', date: '2023.12.02', excerpt: 'Why I keep returning to film photography.' },
    { title: 'Prague Shadows', date: '2023.10.18', excerpt: 'Finding contrast in the city of a hundred spires.' },
    { title: 'Monochrome Philosophy', date: '2023.08.30', excerpt: 'The decision to shoot exclusively in black and white.' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-[60] overflow-y-auto",
        isDarkTheme ? "bg-zinc-950/98" : "bg-white/98"
      )}
      onClick={onClose}
    >
      <div
        className="min-h-screen px-6 py-24 md:px-12 md:py-32"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={cn(
            "fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full text-sm uppercase tracking-widest transition-colors duration-0",
            isDarkTheme
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
          )}
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          <SafeIcon name="x" size={20} />
        </button>

        <div className="max-w-4xl mx-auto">
          <h2
            className={cn(
              "text-5xl md:text-7xl font-bold mb-12 uppercase tracking-tight",
              isDarkTheme ? "text-white" : "text-zinc-900"
            )}
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            Blog
          </h2>

          <div className="space-y-8">
            {posts.map((post, index) => (
              <article
                key={index}
                className={cn(
                  "group cursor-pointer border-b pb-8 transition-colors duration-0",
                  isDarkTheme ? "border-zinc-800 hover:border-zinc-600" : "border-zinc-200 hover:border-zinc-400"
                )}
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
                  <h3
                    className={cn(
                      "text-xl md:text-2xl font-bold group-hover:text-orange-500 transition-colors duration-0",
                      isDarkTheme ? "text-white" : "text-zinc-900"
                    )}
                    style={{ fontFamily: 'Anton, sans-serif' }}
                  >
                    {post.title}
                  </h3>
                  <span
                    className={cn(
                      "text-xs",
                      isDarkTheme ? "text-zinc-500" : "text-zinc-500"
                    )}
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  >
                    {post.date}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm",
                    isDarkTheme ? "text-zinc-400" : "text-zinc-600"
                  )}
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// === MAIN APP COMPONENT ===
function App() {
  const [activeModal, setActiveModal] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const containerRef = useRef(null)

  // Motion values for canvas position
  const x = useMotionValue(-CANVAS_SIZE / 2 + window.innerWidth / 2)
  const y = useMotionValue(-CANVAS_SIZE / 2 + window.innerHeight / 2)

  // Spring config for inertia
  const springConfig = { damping: 30, stiffness: 200 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  // Drag state
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const canvasStart = useRef({ x: 0, y: 0 })

  // Initialize canvas position to center
  useEffect(() => {
    const centerX = -CANVAS_SIZE / 2 + window.innerWidth / 2
    const centerY = -CANVAS_SIZE / 2 + window.innerHeight / 2
    x.set(centerX)
    y.set(centerY)
  }, [])

  // Mouse event handlers for drag
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('img')) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    canvasStart.current = { x: x.get(), y: y.get() }
  }, [x])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    x.set(canvasStart.current.x + dx)
    y.set(canvasStart.current.y + dy)
  }, [isDragging, x, y])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('img')) return
    setIsDragging(true)
    const touch = e.touches[0]
    dragStart.current = { x: touch.clientX, y: touch.clientY }
    canvasStart.current = { x: x.get(), y: y.get() }
  }, [x])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const dx = touch.clientX - dragStart.current.x
    const dy = touch.clientY - dragStart.current.y
    x.set(canvasStart.current.x + dx)
    y.set(canvasStart.current.y + dy)
  }, [isDragging, x, y])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Navigation handler
  const handleNavigate = useCallback((section) => {
    if (section === 'portfolio') {
      setActiveModal(null)
      // Reset canvas to center
      const centerX = -CANVAS_SIZE / 2 + window.innerWidth / 2
      const centerY = -CANVAS_SIZE / 2 + window.innerHeight / 2
      x.set(centerX)
      y.set(centerY)
    } else {
      setActiveModal(section)
    }
  }, [x, y])

  // Close modal handler
  const closeModal = useCallback(() => {
    setActiveModal(null)
    setSelectedPhoto(null)
  }, [])

  // Photo click handler
  const handlePhotoClick = useCallback((photo) => {
    setSelectedPhoto(photo)
  }, [])

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setIsDarkTheme(prev => !prev)
  }, [])

  return (
    <div className={cn(
      "relative w-full h-full overflow-hidden",
      isDarkTheme ? "bg-zinc-950" : "bg-zinc-100"
    )}>
      {/* Noise overlay */}
      <div className={isDarkTheme ? "tv-noise-dark" : "tv-noise-light"} />

      {/* Navigation */}
      <Navigation
        onNavigate={handleNavigate}
        activeModal={activeModal}
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
      />

      {/* Infinite Canvas */}
      <motion.div
        ref={containerRef}
        className={cn(
          "absolute cursor-grab active:cursor-grabbing",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          x: xSpring,
          y: ySpring,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Photos */}
        {PHOTOS.map((photo, index) => {
          const pos = PHOTO_POSITIONS[index]
          return (
            <motion.div
              key={photo.id}
              className="absolute"
              style={{
                left: pos.x,
                top: pos.y,
                width: 320,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <div
                className={cn(
                  "group relative overflow-hidden transition-transform duration-0",
                  isDarkTheme ? "bg-zinc-900" : "bg-zinc-200"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePhotoClick(photo)
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
                  draggable={false}
                />
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  isDarkTheme ? "bg-gradient-to-t from-black/80 to-transparent" : "bg-gradient-to-t from-white/80 to-transparent"
                )}>
                  <p className={cn(
                    "text-xs uppercase tracking-widest",
                    isDarkTheme ? "text-white" : "text-zinc-900"
                  )} style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    {photo.title}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal
            photo={selectedPhoto}
            onClose={closeModal}
            isDarkTheme={isDarkTheme}
          />
        )}
        {activeModal === 'about' && (
          <AboutModal onClose={closeModal} isDarkTheme={isDarkTheme} />
        )}
        {activeModal === 'connect' && (
          <ConnectModal onClose={closeModal} />
        )}
        {activeModal === 'blog' && (
          <BlogModal onClose={closeModal} isDarkTheme={isDarkTheme} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App