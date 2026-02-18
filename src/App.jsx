import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Portfolio images data with positions
const portfolioImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', x: 0, y: 0, width: 500, height: 350, title: 'Mountain Series' },
  { id: 2, src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', x: 600, y: 100, width: 400, height: 500, title: 'Nature Study' },
  { id: 3, src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80', x: -500, y: 200, width: 450, height: 320, title: 'Forest Light' },
  { id: 4, src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', x: 200, y: 500, width: 550, height: 380, title: 'Mist Valley' },
  { id: 5, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', x: -300, y: -400, width: 420, height: 560, title: 'Deep Woods' },
  { id: 6, src: 'https://images.unsplash.com/photo-1518173946687-a4c036bc3c95?w=800&q=80', x: 800, y: -200, width: 380, height: 480, title: 'Urban Edge' },
  { id: 7, src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80', x: -700, y: 600, width: 460, height: 340, title: 'Water Fall' },
  { id: 8, src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', x: 1000, y: 400, width: 520, height: 360, title: 'Lake View' },
  { id: 9, src: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', x: -200, y: 800, width: 400, height: 500, title: 'Tree Study' },
  { id: 10, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', x: 400, y: -600, width: 480, height: 320, title: 'Desert Lines' },
  { id: 11, src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', x: -600, y: -300, width: 440, height: 580, title: 'Night Sky' },
  { id: 12, src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80', x: 1100, y: -400, width: 500, height: 350, title: 'Hill Side' },
  { id: 13, src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80', x: -900, y: 100, width: 360, height: 480, title: 'Ocean Dark' },
  { id: 14, src: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=800&q=80', x: 1400, y: 200, width: 420, height: 560, title: 'Beach Walk' },
  { id: 15, src: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80', x: -400, y: 1000, width: 540, height: 380, title: 'Field Gold' },
  { id: 16, src: 'https://images.unsplash.com/photo-1500534317759-586f8835a72a?w=800&q=80', x: 700, y: 800, width: 400, height: 520, title: 'Rock Form' },
  { id: 17, src: 'https://images.unsplash.com/photo-1499002238440-d264a5966983?w=800&q=80', x: 1600, y: -100, width: 460, height: 340, title: 'Cloud Form' },
  { id: 18, src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80', x: -1100, y: -500, width: 500, height: 380, title: 'Canyon Deep' },
]

function App() {
  const containerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showInfo, setShowInfo] = useState(true)

  // Motion values for smooth panning
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring config for inertia/momentum
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  // Drag start position
  const dragStart = useRef({ x: 0, y: 0 })
  const currentOffset = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    currentOffset.current = { x: springX.get(), y: springY.get() }
    setShowInfo(false)
  }, [springX, springY])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.current.x
    const deltaY = e.clientY - dragStart.current.y

    x.set(currentOffset.current.x + deltaX)
    y.set(currentOffset.current.y + deltaY)
  }, [isDragging, x, y])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch events for mobile
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0]
    setIsDragging(true)
    dragStart.current = { x: touch.clientX, y: touch.clientY }
    currentOffset.current = { x: springX.get(), y: springY.get() }
    setShowInfo(false)
  }, [springX, springY])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return
    e.preventDefault()
    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStart.current.x
    const deltaY = touch.clientY - dragStart.current.y

    x.set(currentOffset.current.x + deltaX)
    y.set(currentOffset.current.y + deltaY)
  }, [isDragging, x, y])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd])

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-950">
      {/* Grain overlay */}
      <div className="grain" />

      {/* Fixed UI Header */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none mix-blend-difference">
        <div className="flex justify-between items-start p-6 md:p-8">
          <div className="pointer-events-auto">
            <h1 className="text-white text-lg md:text-xl font-bold tracking-tighter uppercase">
              Portfolio
            </h1>
            <p className="text-white/60 text-xs md:text-sm mt-1 font-mono">
              Photographer
            </p>
          </div>
          <div className="pointer-events-auto text-right">
            <p className="text-white/60 text-xs font-mono hidden md:block">
              2024
            </p>
            <a
              href="mailto:contact@example.com"
              className="text-white text-xs md:text-sm mt-2 block hover:text-red-500 transition-colors uppercase tracking-wide"
              onClick={(e) => e.stopPropagation()}
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Instructions overlay */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <p className="text-white/40 text-sm md:text-base font-mono uppercase tracking-widest">
              Drag to explore
            </p>
          </div>
        </motion.div>
      )}

      {/* Draggable Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <motion.div
          style={{ x: springX, y: springY }}
          className="absolute"
        >
          {/* Center point for reference */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Images scattered around center */}
            {portfolioImages.map((img) => (
              <motion.div
                key={img.id}
                className="absolute portfolio-image"
                style={{
                  left: img.x,
                  top: img.y,
                  width: img.width,
                  height: img.height,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: img.id * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <div className="relative w-full h-full group">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    draggable={false}
                  />
                  {/* Brutalist border/frame */}
                  <div className="absolute inset-0 border border-white/10 pointer-events-none group-hover:border-white/30 transition-colors duration-300" />

                  {/* Title overlay - brutalist style */}
                  <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-mono uppercase tracking-wider">
                      {img.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fixed bottom info */}
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none mix-blend-difference p-6 md:p-8">
        <div className="flex justify-between items-end">
          <div className="pointer-events-auto">
            <p className="text-white/40 text-xs font-mono">
              Scroll to zoom • Drag to pan
            </p>
          </div>
          <div className="pointer-events-auto">
            <p className="text-white text-xs font-mono">
              18 works
            </p>
          </div>
        </div>
      </div>

      {/* Red accent line - brutalist element */}
      <div className="fixed top-0 left-8 w-px h-24 bg-red-600 z-50" />
      <div className="fixed bottom-8 right-8 w-24 h-px bg-red-600 z-50" />
    </div>
  )
}

export default App