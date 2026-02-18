import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade, Autoplay, Parallax } from 'swiper/modules'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ArrowRight, Mail, MapPin, ExternalLink, Github, Twitter, Linkedin } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/parallax'

// Custom Cursor Component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e) => {
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('[data-cursor="pointer"]')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorX = useSpring(position.x, springConfig)
  const cursorY = useSpring(position.y, springConfig)

  useEffect(() => {
    cursorX.set(position.x)
    cursorY.set(position.y)
  }, [position, cursorX, cursorY])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="rounded-full bg-[#ff4400]"
          animate={{
            width: isHovering ? 60 : isClicking ? 30 : 12,
            height: isHovering ? 60 : isClicking ? 30 : 12,
            x: isHovering ? -30 : isClicking ? -15 : -6,
            y: isHovering ? -30 : isClicking ? -15 : -6,
            opacity: 1,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] border border-[#ff4400]/50 rounded-full hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="rounded-full bg-transparent"
          animate={{
            width: isHovering ? 80 : 40,
            height: isHovering ? 80 : 40,
            x: isHovering ? -40 : -20,
            y: isHovering ? -40 : -20,
            opacity: isHovering ? 0.3 : 0.5,
          }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        />
      </motion.div>
    </>
  )
}

// 3D Globe Component
const Globe = () => {
  const mountRef = useRef(null)
  const globeRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(400, 400)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    // Create globe
    const geometry = new THREE.IcosahedronGeometry(2, 2)
    const material = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    })
    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)
    globeRef.current = globe

    // Add inner sphere
    const innerGeometry = new THREE.IcosahedronGeometry(1.9, 1)
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x171717,
      transparent: true,
      opacity: 0.9,
    })
    const innerGlobe = new THREE.Mesh(innerGeometry, innerMaterial)
    scene.add(innerGlobe)

    camera.position.z = 5

    // Animation
    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (globeRef.current) {
        globeRef.current.rotation.x += 0.001
        globeRef.current.rotation.y += 0.002
      }

      renderer.render(scene, camera)
    }
    animate()

    // Mouse interaction
    const handleMouseMove = (e) => {
      if (globeRef.current) {
        const x = (e.clientX / window.innerWidth) * 2 - 1
        const y = -(e.clientY / window.innerHeight) * 2 + 1
        gsap.to(globeRef.current.rotation, {
          x: y * 0.5,
          y: x * 0.5,
          duration: 1,
          ease: 'power2.out',
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="w-[400px] h-[400px]" data-cursor="pointer" />
}

// Project Card Component
const ProjectCard = ({ title, category, year, image, x, y }) => {
  return (
    <motion.div
      className="absolute group"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
    >
      <div className="relative w-[400px] h-[300px] overflow-hidden bg-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-neutral-600 text-sm">{category}</span>
        </div>
        <motion.div
          className="absolute inset-0 bg-[#ff4400]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#171717] to-transparent">
          <h3 className="font-sans font-black text-2xl text-white mb-1">{title}</h3>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-neutral-400">{category}</span>
            <span className="font-mono text-xs text-[#ff4400]">{year}</span>
          </div>
        </div>
        <motion.div
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#ff4400] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <SafeIcon name="external-link" size={18} className="text-white" />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main App Component
const App = () => {
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#171717]">
      <CustomCursor />

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-sans font-black text-2xl text-white tracking-tighter">
            PORTFOLIO<span className="text-[#ff4400]">.</span>
          </h1>
        </motion.div>
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:flex items-center gap-8"
        >
          <a href="#work" className="font-mono text-xs text-white/60 hover:text-[#ff4400] transition-colors uppercase tracking-widest">
            Work
          </a>
          <a href="#about" className="font-mono text-xs text-white/60 hover:text-[#ff4400] transition-colors uppercase tracking-widest">
            About
          </a>
          <a href="#contact" className="font-mono text-xs text-white/60 hover:text-[#ff4400] transition-colors uppercase tracking-widest">
            Contact
          </a>
        </motion.nav>
      </header>

      {/* Draggable Canvas */}
      <motion.div
        drag
        dragConstraints={{ left: -2000, right: 0, top: -1500, bottom: 0 }}
        dragElastic={0.05}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        onDrag={(e, info) => setDragPosition({ x: info.point.x, y: info.point.y })}
        className="absolute inset-0 w-[300vw] h-[300vh]"
        initial={{ x: 0, y: 0 }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(to right, #ff4400 1px, transparent 1px), linear-gradient(to bottom, #ff4400 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }} />
        </div>

        {/* Section 1: Hero / Slideshow */}
        <section className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Swiper
              modules={[EffectFade, Autoplay, Parallax]}
              effect="fade"
              speed={1000}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              className="w-full h-full"
            >
              <SwiperSlide>
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="font-mono text-[#ff4400] text-sm mb-4 tracking-widest uppercase"
                    >
                      Creative Developer
                    </motion.p>
                    <motion.h2
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className="font-sans font-black text-6xl md:text-8xl lg:text-9xl text-white tracking-tighter leading-none"
                    >
                      DIGITAL
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4400] to-orange-600">
                        CRAFTSMAN
                      </span>
                    </motion.h2>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6">
                    <p className="font-mono text-[#ff4400] text-sm mb-4 tracking-widest uppercase">
                      Portfolio 2024
                    </p>
                    <h2 className="font-sans font-black text-6xl md:text-8xl lg:text-9xl text-white tracking-tighter leading-none">
                      BRUTAL
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4400] to-orange-600">
                        MINIMALISM
                      </span>
                    </h2>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Drag to explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-[#ff4400] to-transparent" />
          </motion.div>
        </section>

        {/* Section 2: Projects Grid */}
        <section id="work" className="absolute top-0 left-[100vw] w-screen h-screen">
          <div className="absolute top-20 left-10">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="font-sans font-black text-7xl text-white tracking-tighter mb-2"
            >
              SELECTED
              <br />
              <span className="text-[#ff4400]">WORKS</span>
            </motion.h2>
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest">2020 — 2024</p>
          </div>

          <ProjectCard
            title="NEON DREAMS"
            category="Web Design"
            year="2024"
            x="10%"
            y="40%"
          />
          <ProjectCard
            title="VOID SPACE"
            category="3D Experience"
            year="2023"
            x="45%"
            y="25%"
          />
          <ProjectCard
            title="KINETIC"
            category="Brand Identity"
            year="2023"
            x="25%"
            y="70%"
          />
          <ProjectCard
            title="ECHOES"
            category="Interactive"
            year="2022"
            x="60%"
            y="55%"
          />
        </section>

        {/* Section 3: About */}
        <section id="about" className="absolute top-[100vh] left-0 w-screen h-screen flex items-center justify-center">
          <div className="max-w-4xl px-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-mono text-[#ff4400] text-sm mb-6 tracking-widest uppercase">About Me</p>
              <h2 className="font-sans font-black text-5xl md:text-7xl text-white tracking-tighter mb-8 leading-tight">
                CRAFTING DIGITAL
                <br />
                EXPERIENCES WITH
                <br />
                <span className="text-neutral-600">PRECISION & SOUL</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <p className="font-mono text-sm text-white/60 leading-relaxed">
                  I am a creative developer based in the digital realm, specializing in building
                  immersive web experiences that blur the line between design and technology.
                </p>
                <p className="font-mono text-sm text-white/60 leading-relaxed">
                  With over 5 years of experience, I combine brutalist aesthetics with
                  cutting-edge web technologies to create memorable digital products.
                </p>
              </div>
              <div className="flex gap-8 mt-12">
                <div>
                  <span className="font-sans font-black text-4xl text-[#ff4400]">50+</span>
                  <p className="font-mono text-xs text-white/40 uppercase mt-1">Projects</p>
                </div>
                <div>
                  <span className="font-sans font-black text-4xl text-[#ff4400]">5+</span>
                  <p className="font-mono text-xs text-white/40 uppercase mt-1">Years</p>
                </div>
                <div>
                  <span className="font-sans font-black text-4xl text-[#ff4400]">12</span>
                  <p className="font-mono text-xs text-white/40 uppercase mt-1">Awards</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 4: Contact with Globe */}
        <section id="contact" className="absolute top-[100vh] left-[100vw] w-screen h-screen flex items-center justify-center">
          <div className="flex flex-col lg:flex-row items-center gap-16 px-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <Globe />
            </motion.div>

            <div className="max-w-md">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="font-mono text-[#ff4400] text-sm mb-6 tracking-widest uppercase">Get in Touch</p>
                <h2 className="font-sans font-black text-5xl text-white tracking-tighter mb-6">
                  LET'S WORK
                  <br />
                  <span className="text-neutral-600">TOGETHER</span>
                </h2>
                <p className="font-mono text-sm text-white/60 leading-relaxed mb-8">
                  Have a project in mind? Let's create something extraordinary together.
                  I'm always open to discussing new opportunities.
                </p>

                <a
                  href="mailto:hello@portfolio.com"
                  className="inline-flex items-center gap-3 font-mono text-sm text-white hover:text-[#ff4400] transition-colors group"
                >
                  <span className="w-12 h-px bg-current transition-all group-hover:w-20" />
                  hello@portfolio.com
                </a>

                <div className="flex gap-4 mt-12">
                  <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#ff4400] hover:bg-[#ff4400]/10 transition-all group">
                    <SafeIcon name="twitter" size={18} className="text-white/60 group-hover:text-[#ff4400]" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#ff4400] hover:bg-[#ff4400]/10 transition-all group">
                    <SafeIcon name="github" size={18} className="text-white/60 group-hover:text-[#ff4400]" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#ff4400] hover:bg-[#ff4400]/10 transition-all group">
                    <SafeIcon name="linkedin" size={18} className="text-white/60 group-hover:text-[#ff4400]" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Coordinates Display */}
        <div className="fixed bottom-6 left-6 font-mono text-xs text-white/30 z-40 hidden md:block">
          <span className="text-[#ff4400]">X:</span> {Math.round(Math.abs(dragPosition.x))}
          <span className="ml-4 text-[#ff4400]">Y:</span> {Math.round(Math.abs(dragPosition.y))}
        </div>
      </motion.div>
    </div>
  )
}

export default App