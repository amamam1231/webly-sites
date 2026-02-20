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
const generatePositions = (photos, gridSize = 8) => {
  const positions = [];
  const doubledGridSize = gridSize * 2;
  const centerOffset = Math.floor(doubledGridSize / 2);

  // Начинаем с центра сетки
  let currentX = centerOffset;
  let currentY = centerOffset;

  positions.push({ x: currentX, y: currentY, photo: photos[0] });

  const usedPositions = new Set([`${currentX},${currentY}`]);
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let directionIndex = 0;
  let stepSize = 1;
  let stepsTaken = 0;

  for (let i = 1; i < photos.length; i++) {
    for (let j = 0; j < 2; j++) {
      const [dx, dy] = directions[directionIndex];
      currentX += dx * stepSize;
      currentY += dy * stepSize;

      if (currentX >= 0 && currentX < doubledGridSize &&
          currentY >= 0 && currentY < doubledGridSize &&
          !usedPositions.has(`${currentX},${currentY}`)) {
        positions.push({ x: currentX, y: currentY, photo: photos[i] });
        usedPositions.add(`${currentX},${currentY}`);
        i++;
        if (i >= photos.length) break;
      }
    }

    directionIndex = (directionIndex + 1) % 4;
    stepsTaken++;
    if (stepsTaken % 2 === 0) {
      stepSize++;
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
function App() {
  const [photos, setPhotos] = useState([]);
  const [positions, setPositions] = useState([]);
  const [draggedPhoto, setDraggedPhoto] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [gridSize] = useState(16); // Удвоенный размер сетки
  const [cellSize] = useState(60);
  const containerRef = useRef(null);

  useEffect(() => {
    const samplePhotos = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      url: `https://picsum.photos/400/300?random=${i + 1}`,
      title: `Photo ${i + 1}`,
      description: `This is photo number ${i + 1}`
    }));

    setPhotos(samplePhotos);
    setPositions(generatePositions(samplePhotos, 8));
  }, []);

  useEffect(() => {
    if (containerRef.current && positions.length > 0) {
      const container = containerRef.current;
      const gridWidth = gridSize * cellSize;
      const gridHeight = gridSize * cellSize;

      // Центрируем сетку на центральной фотографии
      const centerPhoto = positions[0];
      const centerX = (centerPhoto.x + 0.5) * cellSize;
      const centerY = (centerPhoto.y + 0.5) * cellSize;

      const offsetX = container.clientWidth / 2 - centerX;
      const offsetY = container.clientHeight / 2 - centerY;

      setPanOffset({ x: offsetX, y: offsetY });
    }
  }, [positions, gridSize, cellSize]);

  const handleMouseDown = (e, photo) => {
    if (e.button === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDraggedPhoto(photo);
      setDragOffset({
        x: e.clientX - rect.left - cellSize / 2,
        y: e.clientY - rect.top - cellSize / 2
      });
    }
  };

  const handleMouseMove = (e) => {
    if (draggedPhoto) {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left - panOffset.x - dragOffset.x) / cellSize;
        const y = (e.clientY - rect.top - panOffset.y - dragOffset.y) / cellSize;

        const newX = Math.max(0, Math.min(gridSize - 1, Math.round(x)));
        const newY = Math.max(0, Math.min(gridSize - 1, Math.round(y)));

        setPositions(prev => prev.map(pos => {
          if (pos.photo.id === draggedPhoto.id) {
            return { ...pos, x: newX, y: newY };
          }
          if (pos.x === newX && pos.y === newY) {
            const oldPos = prev.find(p => p.photo.id === draggedPhoto.id);
            return { ...pos, x: oldPos.x, y: oldPos.y };
          }
          return pos;
        }));
      }
    } else if (isPanning) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggedPhoto(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const handleMouseDownPan = (e) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Photo Grid</h1>
        <div className="controls">
          <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
          <button onClick={() => setZoomLevel(1)}>Reset Zoom</button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="grid-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onMouseDown={handleMouseDownPan}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div
          className="grid"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '0 0'
          }}
        >
          {positions.map((pos, index) => (
            <div
              key={pos.photo.id}
              className={`photo-cell ${draggedPhoto?.id === pos.photo.id ? 'dragging' : ''}`}
              style={{
                left: pos.x * cellSize,
                top: pos.y * cellSize,
                width: cellSize - 4,
                height: cellSize - 4,
                zIndex: draggedPhoto?.id === pos.photo.id ? 1000 : index
              }}
              onMouseDown={(e) => handleMouseDown(e, pos.photo)}
              onClick={(e) => {
                if (!draggedPhoto) {
                  handlePhotoClick(pos.photo);
                }
              }}
            >
              <img
                src={pos.photo.url}
                alt={pos.photo.title}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedPhoto && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <img src={selectedPhoto.url} alt={selectedPhoto.title} />
            <h3>{selectedPhoto.title}</h3>
            <p>{selectedPhoto.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
}

export default App