import { SafeIcon } from './components/SafeIcon';
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, X, ArrowRight, Activity, Zap, Shield } from 'lucide-react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

gsap.registerPlugin(ScrollTrigger)

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// SafeIcon wrapper component

// Noise Overlay Component
function NoiseOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.05]">
      <svg className="w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>
    </div>
  )
}

// Magnetic Button Component
function MagneticButton({ children, className, variant = 'primary' }) {
  const buttonRef = useRef(null)

  const handleMouseMove = (e) => {
    const btn = buttonRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`
  }

  const handleMouseLeave = () => {
    const btn = buttonRef.current
    if (!btn) return
    btn.style.transform = 'translate(0, 0) scale(1)'
  }

  const baseStyles = "relative overflow-hidden px-8 py-4 rounded-full font-semibold transition-all duration-300 ease-out"
  const variants = {
    primary: "bg-moss text-cream hover:shadow-lg hover:shadow-moss/30",
    clay: "bg-clay text-white hover:shadow-lg hover:shadow-clay/30",
    outline: "border-2 border-moss text-moss hover:bg-moss hover:text-cream",
    white: "bg-white/60 backdrop-blur-md border border-white/40 text-moss"
  }

  return (
    <button
      ref={buttonRef}
      className={cn(baseStyles, variants[variant], className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  )
}

// Navbar Component
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Approach', href: '#philosophy' },
    { label: 'Protocol', href: '#protocol' },
    { label: 'Membership', href: '#membership' },
    { label: 'Contact', href: '#footer' },
  ]

  return (
    <nav className={cn(
      "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 px-2 py-2 rounded-full",
      scrolled
        ? "bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5 w-[90%] max-w-2xl"
        : "bg-transparent w-[90%] max-w-3xl"
    )}>
      <div className="flex items-center justify-between px-4">
        <a href="#" className={cn(
          "text-xl font-bold tracking-tight transition-colors duration-300",
          scrolled ? "text-moss" : "text-white"
        )}>
          Nura
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={cn(
                "text-sm font-medium transition-colors duration-300 hover:opacity-70",
                scrolled ? "text-moss" : "text-white/90"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <MagneticButton
            variant={scrolled ? "primary" : "white"}
            className="!py-2 !px-6 text-sm"
          >
            Start Audit
          </MagneticButton>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <SafeIcon
            name={mobileMenuOpen ? "X" : "Menu"}
            size={24}
            className={scrolled ? "text-moss" : "text-white"}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                  setMobileMenuOpen(false)
                }}
                className="text-moss font-medium text-lg py-2"
              >
                {link.label}
              </a>
            ))}
            <MagneticButton variant="primary" className="mt-4 w-full justify-center">
              Start Audit
            </MagneticButton>
          </div>
        </div>
      )}
    </nav>
  )
}

// Hero Section
function Hero() {
  const containerRef = useRef(null)
  const textRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRefs.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.3
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const addToRefs = (el) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el)
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative h-[100dvh] w-full overflow-hidden"
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1920&q=80"
          alt="Moody forest"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-moss via-moss/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-moss/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl">
          <div className="overflow-hidden mb-2">
            <p
              ref={addToRefs}
              className="text-white/70 font-mono text-sm tracking-widest uppercase"
            >
              Precision Longevity Medicine
            </p>
          </div>

          <div className="overflow-hidden">
            <h1
              ref={addToRefs}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[0.9]"
            >
              Nature is the
            </h1>
          </div>

          <div className="overflow-hidden mt-2">
            <h1
              ref={addToRefs}
              className="text-6xl md:text-8xl lg:text-9xl font-serif italic text-cream tracking-tighter"
            >
              Algorithm.
            </h1>
          </div>

          <div className="overflow-hidden mt-8">
            <p
              ref={addToRefs}
              className="text-white/80 text-lg md:text-xl max-w-xl leading-relaxed"
            >
              Biological optimization for the modern era. We decode your cellular intelligence
              to architect personalized protocols.
            </p>
          </div>

          <div ref={addToRefs} className="mt-10 flex flex-wrap gap-4">
            <MagneticButton variant="white">
              Begin Your Protocol
              <SafeIcon name="ArrowRight" size={18} />
            </MagneticButton>
            <MagneticButton variant="outline" className="border-white/40 text-white hover:bg-white hover:text-moss">
              View Case Studies
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}

// Diagnostic Shuffler Card
function DiagnosticShuffler() {
  const [cards, setCards] = useState([
    { id: 1, label: "Epigenetic Age", value: "34.2 yrs", sub: "Biological" },
    { id: 2, label: "Microbiome Score", value: "8.4/10", sub: "Diversity Index" },
    { id: 3, label: "Cortisol Optimization", value: "94%", sub: "Stress Response" }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newCards = [...prev]
        const last = newCards.pop()
        newCards.unshift(last)
        return newCards
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-80 bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-clay pulse-dot" />
        <span className="text-xs font-mono text-charcoal/60 uppercase tracking-wider">Live Diagnostics</span>
      </div>

      <div className="relative h-48">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="absolute w-full bg-cream rounded-2xl p-5 shadow-lg border border-gray-200 spring-transition"
            style={{
              transform: `translateY(${index * 20}px) scale(${1 - index * 0.05})`,
              zIndex: cards.length - index,
              opacity: 1 - index * 0.2,
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono text-charcoal/50 uppercase mb-1">{card.sub}</p>
                <h4 className="text-lg font-semibold text-charcoal">{card.label}</h4>
              </div>
              <span className="text-2xl font-bold text-moss">{card.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Telemetry Typewriter Card
function TelemetryTypewriter() {
  const messages = [
    "Optimizing Circadian Rhythm...",
    "Analyzing HRV Patterns...",
    "Calibrating Mitochondrial Output...",
    "Syncing Biorhythmic Data..."
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const message = messages[currentIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < message.length) {
          setDisplayText(message.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % messages.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentIndex])

  return (
    <div className="h-80 bg-charcoal rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-clay/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Neural Stream</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
            <span className="text-xs font-mono text-green-500">Live Feed</span>
          </div>
        </div>

        <div className="font-mono text-lg md:text-xl text-cream/90 leading-relaxed h-32">
          {displayText}
          <span className="inline-block w-2 h-5 bg-clay ml-1 cursor-blink" />
        </div>

        <div className="mt-8 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-clay/60 rounded-full transition-all duration-300"
                style={{
                  width: i === currentIndex % 5 ? '100%' : '20%',
                  opacity: i === currentIndex % 5 ? 1 : 0.3
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mock Cursor Protocol Scheduler
function ProtocolScheduler() {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const [activeDay, setActiveDay] = useState(null)
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const [isClicking, setIsClicking] = useState(false)
  const [showSave, setShowSave] = useState(false)

  useEffect(() => {
    const runAnimation = () => {
      // Move to Wednesday (index 3)
      setTimeout(() => {
        setCursorPos({ x: 3 * 48 + 16, y: 60 })
      }, 500)

      // Click
      setTimeout(() => {
        setIsClicking(true)
        setActiveDay(3)
      }, 1500)

      // Release
      setTimeout(() => {
        setIsClicking(false)
      }, 1700)

      // Move to Save
      setTimeout(() => {
        setCursorPos({ x: 200, y: 200 })
        setShowSave(true)
      }, 2200)

      // Click Save
      setTimeout(() => {
        setIsClicking(true)
      }, 2800)

      // Reset
      setTimeout(() => {
        setIsClicking(false)
        setActiveDay(null)
        setCursorPos({ x: -100, y: -100 })
        setShowSave(false)
      }, 3500)
    }

    runAnimation()
    const interval = setInterval(runAnimation, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-80 bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <SafeIcon name="Zap" size={16} className="text-clay" />
        <span className="text-xs font-mono text-charcoal/60 uppercase tracking-wider">Adaptive Regimen</span>
      </div>

      <div className="relative">
        {/* Days Grid */}
        <div className="flex gap-2 mb-6">
          {days.map((day, index) => (
            <div
              key={index}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center font-semibold transition-all duration-300",
                activeDay === index
                  ? "bg-moss text-white scale-95"
                  : "bg-gray-100 text-charcoal/60"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Mock Cursor */}
        <div
          className="absolute w-6 h-6 pointer-events-none z-20 transition-all duration-700 ease-out"
          style={{
            transform: `translate(${cursorPos.x}px, ${cursorPos.y}px) scale(${isClicking ? 0.8 : 1})`,
            opacity: cursorPos.x > 0 ? 1 : 0
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5.5 3.5L10.5 19.5L14.5 12.5L21.5 10.5L5.5 3.5Z" fill="#1A1A1A" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>

        {/* Save Button */}
        <button
          className={cn(
            "mt-4 w-full py-3 rounded-xl font-semibold transition-all duration-300",
            showSave
              ? "bg-moss text-white opacity-100"
              : "bg-gray-100 text-charcoal/40 opacity-50"
          )}
        >
          {showSave ? "Protocol Updated" : "Save Changes"}
        </button>

        {/* Schedule Preview */}
        <div className="mt-4 space-y-2">
          <div className="h-2 bg-gray-100 rounded-full w-3/4" />
          <div className="h-2 bg-gray-100 rounded-full w-1/2" />
        </div>
      </div>
    </div>
  )
}

// Features Section
function Features() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 lg:px-20 bg-cream relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-mono text-clay text-sm uppercase tracking-widest mb-4">The Dashboard</p>
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
            Precision Micro-UI
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="feature-card">
            <DiagnosticShuffler />
            <h3 className="mt-6 text-xl font-semibold text-charcoal">Audit Intelligence</h3>
            <p className="mt-2 text-charcoal/60">Real-time biological markers with predictive modeling.</p>
          </div>

          <div className="feature-card">
            <TelemetryTypewriter />
            <h3 className="mt-6 text-xl font-semibold text-charcoal">Neural Stream</h3>
            <p className="mt-2 text-charcoal/60">Continuous optimization telemetry from your wearables.</p>
          </div>

          <div className="feature-card">
            <ProtocolScheduler />
            <h3 className="mt-6 text-xl font-semibold text-charcoal">Adaptive Regimen</h3>
            <p className="mt-2 text-charcoal/60">Dynamic scheduling that evolves with your biometrics.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Philosophy Section
function Philosophy() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const splitLines = textRef.current.querySelectorAll('.split-line')

      gsap.from(splitLines, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        },
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative py-32 px-6 md:px-12 lg:px-20 bg-charcoal overflow-hidden"
    >
      {/* Parallax Background Texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="absolute inset-0 bg-charcoal/80" />

      <div ref={textRef} className="relative z-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="split-line">
            <p className="font-mono text-clay text-sm uppercase tracking-widest mb-6">The Manifesto</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/60 leading-tight">
              Modern medicine asks:<br />
              <span className="text-white">What is wrong?</span>
            </h2>
          </div>

          <div className="split-line">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-cream leading-tight">
              We ask:<br />
              <span className="text-clay">What is optimal?</span>
            </h2>
            <p className="mt-8 text-white/70 text-lg leading-relaxed">
              We reject the sickness model. Our protocols are designed for peak biological
              expression—preventing degradation before it begins. This is the difference
              between surviving and thriving.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Protocol Card Components
function RotatingHelix() {
  return (
    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-48 opacity-20">
      <svg viewBox="0 0 200 200" className="w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
        <defs>
          <linearGradient id="helixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CC5833" />
            <stop offset="100%" stopColor="#2E4036" />
          </linearGradient>
        </defs>
        {[...Array(12)].map((_, i) => (
          <ellipse
            key={i}
            cx="100"
            cy={30 + i * 12}
            rx={40 + Math.sin(i * 0.5) * 20}
            ry="6"
            fill="none"
            stroke="url(#helixGrad)"
            strokeWidth="2"
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}
      </svg>
    </div>
  )
}

function LaserGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(90deg, #CC5833 1px, transparent 1px), linear-gradient(#CC5833 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        animation: 'scan 3s linear infinite'
      }} />
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-40px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function EKGWaveform() {
  const pathRef = useRef(null)

  useEffect(() => {
    if (!pathRef.current) return

    const length = pathRef.current.getTotalLength()
    pathRef.current.style.strokeDasharray = length
    pathRef.current.style.strokeDashoffset = length

    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 2,
      repeat: -1,
      ease: 'none'
    })
  }, [])

  return (
    <div className="absolute bottom-10 left-10 right-10 h-24 opacity-40">
      <svg viewBox="0 0 800 100" className="w-full h-full" preserveAspectRatio="none">
        <path
          ref={pathRef}
          d="M0,50 L100,50 L120,20 L140,80 L160,10 L180,90 L200,50 L300,50 L320,30 L340,70 L360,50 L800,50"
          fill="none"
          stroke="#CC5833"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

// Protocol Section
function Protocol() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current

      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          ScrollTrigger.create({
            trigger: cards[index + 1],
            start: 'top center',
            end: 'top top',
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress
              gsap.set(card, {
                scale: 1 - progress * 0.1,
                filter: `blur(${progress * 20}px)`,
                opacity: 1 - progress * 0.5
              })
            }
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const protocols = [
    {
      title: "Cellular Audit",
      subtitle: "Phase 01",
      description: "Comprehensive epigenetic sequencing and microbiome analysis to establish your biological baseline.",
      artifact: <RotatingHelix />
    },
    {
      title: "Precision Calibration",
      subtitle: "Phase 02",
      description: "AI-driven protocol generation based on 10,000+ biomarkers. Personalized down to the molecular level.",
      artifact: <LaserGrid />
    },
    {
      title: "Continuous Evolution",
      subtitle: "Phase 03",
      description: "Real-time adjustments based on daily telemetry. Your protocol learns and adapts as you do.",
      artifact: <EKGWaveform />
    }
  ]

  return (
    <section ref={sectionRef} id="protocol" className="relative bg-cream">
      {protocols.map((protocol, index) => (
        <div
          key={index}
          ref={el => cardsRef.current[index] = el}
          className="sticky top-0 h-screen flex items-center justify-center p-6 md:p-12"
          style={{ zIndex: index + 1 }}
        >
          <div className="relative w-full max-w-6xl h-[80vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden p-12 md:p-20 flex flex-col justify-center">
            {protocol.artifact}

            <div className="relative z-10 max-w-2xl">
              <p className="font-mono text-clay text-sm uppercase tracking-widest mb-4">{protocol.subtitle}</p>
              <h2 className="text-4xl md:text-6xl font-bold text-charcoal tracking-tight mb-6">
                {protocol.title}
              </h2>
              <p className="text-xl text-charcoal/70 leading-relaxed max-w-xl">
                {protocol.description}
              </p>

              <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-moss/10 flex items-center justify-center text-moss font-bold">
                  0{index + 1}
                </div>
                <div className="h-px flex-1 bg-gray-200 max-w-xs" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

// Membership Section
function Membership() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pricing-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const plans = [
    {
      name: "Essential",
      price: "$299",
      period: "/month",
      description: "Foundational optimization for health-conscious individuals.",
      features: ["Quarterly biomarker panels", "Basic protocol adjustments", "Email support", "Mobile app access"],
      highlighted: false
    },
    {
      name: "Performance",
      price: "$599",
      period: "/month",
      description: "Comprehensive biological optimization for peak performers.",
      features: ["Monthly biomarker panels", "Weekly protocol adjustments", "Priority 24/7 support", "Executive health concierge", "Advanced genetic analysis"],
      highlighted: true
    },
    {
      name: "Ultra",
      price: "$1,299",
      period: "/month",
      description: "White-glove longevity medicine for the elite.",
      features: ["Unlimited biomarker testing", "Real-time protocol optimization", "Dedicated medical team", "Home visit protocols", "Family plan included"],
      highlighted: false
    }
  ]

  return (
    <section ref={sectionRef} id="membership" className="py-32 px-6 md:px-12 lg:px-20 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-clay text-sm uppercase tracking-widest mb-4">Membership</p>
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
            Invest in Your Biology
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "pricing-card rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden transition-all duration-500",
                plan.highlighted
                  ? "bg-moss text-white scale-105 shadow-2xl shadow-moss/20"
                  : "bg-white border border-gray-200 text-charcoal"
              )}
            >
              {plan.highlighted && (
                <div className="absolute top-6 right-6">
                  <span className="bg-clay text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Popular
                  </span>
                </div>
              )}

              <h3 className={cn(
                "text-2xl font-bold mb-2",
                plan.highlighted ? "text-white" : "text-charcoal"
              )}>
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={plan.highlighted ? "text-white/60" : "text-charcoal/60"}>
                  {plan.period}
                </span>
              </div>

              <p className={cn(
                "mb-8 leading-relaxed",
                plan.highlighted ? "text-white/80" : "text-charcoal/60"
              )}>
                {plan.description}
              </p>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      plan.highlighted ? "bg-clay" : "bg-moss/10"
                    )}>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        plan.highlighted ? "bg-white" : "bg-moss"
                      )} />
                    </div>
                    <span className={plan.highlighted ? "text-white/90" : "text-charcoal/70"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <MagneticButton
                variant={plan.highlighted ? "clay" : "primary"}
                className="w-full justify-center"
              >
                Get Started
                <SafeIcon name="ArrowRight" size={18} />
              </MagneticButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer Section
function Footer() {
  return (
    <footer id="footer" className="bg-charcoal rounded-t-[4rem] pt-20 pb-10 px-6 md:px-12 lg:px-20 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold text-white mb-4">Nura</h3>
            <p className="text-white/60 max-w-md leading-relaxed">
              Precision longevity medicine. We bridge the gap between biological
              research and human optimization.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 pulse-dot" />
              <span className="text-green-500 font-mono text-sm uppercase tracking-wider">
                System Operational
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Diagnostics</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Protocol</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Telemetry</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Research</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            2024 Nura Health. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Privacy</a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Terms</a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">HIPAA</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  return (
    <div className="relative bg-cream min-h-screen">
      <NoiseOverlay />
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />
      <Membership />
      <Footer />
    </div>
  )
}

export default App