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
  { id: 16, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453880-2918.jpg?', title: 'Urban Echo', date: '2023.12.15', camera: 'Leica M10-R' },
  { id: 17, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-2291.jpg?', title: 'Shadow Dance', date: '2024.03.01', camera: 'Leica Q2' },
  { id: 18, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-7476.jpg?', title: 'Golden Hour', date: '2023.11.20', camera: 'Leica M6' },
  { id: 19, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453881-3765.jpg?', title: 'Night Walk', date: '2024.02.28', camera: 'Leica M10-R' },
  { id: 20, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8936.jpg?', title: 'Monochrome', date: '2023.10.10', camera: 'Leica Q2 Monochrom' },
  { id: 21, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-7385.jpg?', title: 'Film Memories', date: '2024.01.25', camera: 'Leica M6' },
  { id: 22, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8284.jpg?', title: 'Mirror World', date: '2023.09.05', camera: 'Leica M10-R' },
  { id: 23, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453882-8710.jpg?', title: 'Eternal', date: '2024.03.10', camera: 'Leica Q2' },
  { id: 24, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453883-2278.jpg?', title: 'Pure Feeling', date: '2023.12.20', camera: 'Leica M6' },
  { id: 25, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453883-1442.jpg?', title: 'Captured Time', date: '2024.02.05', camera: 'Leica M10-R' },
  { id: 26, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-8417.jpg?', title: 'Deep Focus', date: '2023.11.05', camera: 'Leica Q2 Monochrom' },
  { id: 27, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-9947.jpg?', title: 'Quiet Objects', date: '2024.01.18', camera: 'Leica M6' },
  { id: 28, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-9719.jpg?', title: 'Lines & Curves', date: '2023.10.15', camera: 'Leica M10-R' },
  { id: 29, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453924-1425.jpg?', title: 'Luminous Study', date: '2024.03.15', camera: 'Leica Q2' },
  { id: 30, src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1771453925-5244.jpg?', title: 'Broken Pieces', date: '2023.12.28', camera: 'Leica M6' },
]

// Generate random positions for photos
  const generatePositions = () => {
    const positions = [];
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile: 4 rows x 30 columns (doubled from 2x15)
      const rows = 4;
      const cols = 30;
      const spacing = 120;
      const startX = -(cols * spacing) / 2;
      const startY = -(rows * spacing) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          positions.push({
            x: startX + col * spacing,
            y: startY + row * spacing,
            scale: 0.8,
            delay: (row + col) * 0.02
          });
        }
      }
    } else {
      // Desktop: 16 columns x dynamic rows (doubled from 8xN)
      const cols = 16;
      const rows = Math.ceil(totalPhotos / cols);
      const spacing = 200;
      const startX = -(cols * spacing) / 2;
      const startY = -(rows * spacing) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          if (index < totalPhotos) {
            positions.push({
              x: startX + col * spacing,
              y: startY + row * spacing,
              scale: 1,
              delay: (row + col) * 0.01
            });
          }
        }
      }
    }

    return positions;
  };

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
    <div
      className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain grayscale"
        />
      </div>
    </div>
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
  // Initialize positions and center view
  useEffect(() => {
    const positions = generatePositions();
    setPositions(positions);

    // Calculate center coordinates for the new larger grid
    const isMobile = window.innerWidth < 768;
    let centerX, centerY;

    if (isMobile) {
      // Mobile center: 4x30 grid
      centerX = 0;
      centerY = 0;
    } else {
      // Desktop center: 16xN grid
      const cols = 16;
      const rows = Math.ceil(totalPhotos / cols);
      const spacing = 200;
      centerX = 0;
      centerY = 0;
    }

    // Set initial position to center of grid
    x.set(centerX);
    y.set(centerY);

    // Update spring targets to maintain center position
    springX.set(centerX);
    springY.set(centerY);

    // Center the actual view
    const container = containerRef.current;
    if (container) {
      const scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      const scrollTop = (container.scrollHeight - container.clientHeight) / 2;
      container.scrollLeft = scrollLeft;
      container.scrollTop = scrollTop;
    }
  }, [totalPhotos]);

  // Mouse/touch handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - x.get(), y: e.clientY - y.get() };
    containerRef.current?.classList.add('cursor-grabbing');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;

    x.set(newX);
    y.set(newY);
    springX.set(newX);
    springY.set(newY);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    containerRef.current?.classList.remove('cursor-grabbing');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    isDragging.current = true;
    dragStart.current = { x: touch.clientX - x.get(), y: touch.clientY - y.get() };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;

    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.current.x;
    const newY = touch.clientY - dragStart.current.y;

    x.set(newX);
    y.set(newY);
    springX.set(newX);
    springY.set(newY);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, scale.get() * scaleAmount));
    scale.set(newScale);
    springScale.set(newScale);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const positions = generatePositions();
      setPositions(positions);

      // Recalculate center on resize
      const isMobile = window.innerWidth < 768;
      let centerX, centerY;

      if (isMobile) {
        centerX = 0;
        centerY = 0;
      } else {
        centerX = 0;
        centerY = 0;
      }

      x.set(centerX);
      y.set(centerY);
      springX.set(centerX);
      springY.set(centerY);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [totalPhotos]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full relative cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <motion.div
          className="absolute w-full h-full"
          style={{
            x: springX,
            y: springY,
            scale: springScale,
          }}
        >
          {positions.map((pos, index) => {
            const photoIndex = index % photos.length;
            const photo = photos[photoIndex];

            return (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  x: pos.x,
                  y: pos.y,
                  scale: pos.scale,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: pos.scale }}
                transition={{ delay: pos.delay, duration: 0.5 }}
              >
                <div className="relative group">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-lg shadow-lg transition-transform group-hover:scale-110"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg" />
                </div>
              </motion.div>
            );
          })}

          {/* Center marker */}
          <div className="absolute w-4 h-4 bg-red-500 rounded-full"
               style={{
                 left: '50%',
                 top: '50%',
                 transform: 'translate(-50%, -50%)',
                 opacity: 0.5
               }} />
        </motion.div>
      </div>

      {/* Selected photo modal */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="max-w-4xl max-h-screen p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="w-full h-auto max-h-screen object-contain"
            />
            <div className="text-white text-center mt-4">
              <h3 className="text-2xl font-bold">{selectedPhoto.title}</h3>
              <p className="text-gray-300 mt-2">{selectedPhoto.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );

export default App