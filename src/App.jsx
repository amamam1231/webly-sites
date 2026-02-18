import { SafeIcon } from './components/SafeIcon';
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Project data
const projects = [
  {
    id: 1,
    title: "Neon Dreams",
    category: "Web Design",
    year: "2024",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
    description: "An immersive digital experience for a cyberpunk fashion brand. Featuring WebGL animations, custom cursor effects, and seamless page transitions.",
    tags: ["React", "Three.js", "GSAP"],
    gallery: [
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80"
    ]
  },
  {
    id: 2,
    title: "Minimal Studio",
    category: "Brand Identity",
    year: "2024",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1200&q=80",
    description: "Complete brand identity system for an architecture studio. Clean lines, monochromatic palette, and sophisticated typography.",
    tags: ["Branding", "Typography", "Print"],
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6fe?w=800&q=80"
    ]
  },
  {
    id: 3,
    title: "Pulse App",
    category: "UI/UX Design",
    year: "2023",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80",
    description: "Mobile fitness application with real-time tracking, social features, and personalized workout plans. Over 100k downloads in first month.",
    tags: ["Figma", "Prototyping", "User Research"],
    gallery: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&q=80"
    ]
  },
  {
    id: 4,
    title: "Echo Platform",
    category: "Development",
    year: "2023",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
    description: "Audio streaming platform with AI-powered recommendations. Built with performance and accessibility as core principles.",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    gallery: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
      "https://images.unsplash.com/photo-1511376777868-611b54f68947?w=800&q=80"
    ]
  }
]

function App() {
  const containerRef = useRef(null)
  const [activeSection, setActiveSection] = useState('hero')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const x = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })

  // Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Wheel scroll to horizontal
  useEffect(() => {
    if (isMobile) return

    const container = containerRef.current
    if (!container) return

    let isScrolling = false

    const handleWheel = (e) => {
      if (isScrolling) return
      e.preventDefault()

      isScrolling = true
      const delta = e.deltaY || e.deltaX
      container.scrollLeft += delta

      setTimeout(() => {
        isScrolling = false
      }, 50)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [isMobile])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isMobile) return
      const container = containerRef.current
      if (!container) return

      const sectionWidth = window.innerWidth
      const currentScroll = container.scrollLeft

      if (e.key === 'ArrowRight') {
        container.scrollTo({ left: currentScroll + sectionWidth, behavior: 'smooth' })
      } else if (e.key === 'ArrowLeft') {
        container.scrollTo({ left: currentScroll - sectionWidth, behavior: 'smooth' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobile])

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const container = containerRef.current
    if (!container) return

    const sections = ['hero', 'project-0', 'project-1', 'project-2', 'project-3', 'about', 'contact']
    const index = sections.indexOf(sectionId)

    if (index !== -1) {
      container.scrollTo({
        left: index * window.innerWidth,
        behavior: 'smooth'
      })
      setActiveSection(sectionId)
    }
  }

  // Update active section on scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const viewportWidth = window.innerWidth
      const index = Math.round(scrollLeft / viewportWidth)
      const sections = ['hero', 'project-0', 'project-1', 'project-2', 'project-3', 'about', 'contact']
      if (sections[index]) {
        setActiveSection(sections[index])
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDragStart = () => setIsDragging(true)
  const handleDragEnd = (e, info) => {
    setIsDragging(false)
    const container = containerRef.current
    if (!container) return

    const velocity = info.velocity.x
    const offset = info.offset.x
    const currentScroll = container.scrollLeft

    if (Math.abs(velocity) > 500 || Math.abs(offset) > 100) {
      const direction = velocity > 0 || offset > 0 ? -1 : 1
      container.scrollTo({
        left: currentScroll + (direction * window.innerWidth),
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 md:py-6">
        <div className="flex items-center justify-between backdrop-blur-md bg-black/50 rounded-full px-6 py-3 border border-white/10">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-lg font-bold tracking-tight hover:text-cyan-400 transition-colors"
          >
            Alex Chen
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => scrollToSection('project-0')}
              className={cn(
                "hover:text-cyan-400 transition-colors relative",
                activeSection.startsWith('project') && "text-cyan-400"
              )}
            >
              Portfolio
              {activeSection.startsWith('project') && (
                <motion.span layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-px bg-cyan-400" />
              )}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={cn(
                "hover:text-cyan-400 transition-colors relative",
                activeSection === 'about' && "text-cyan-400"
              )}
            >
              About
              {activeSection === 'about' && (
                <motion.span layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-px bg-cyan-400" />
              )}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={cn(
                "hover:text-cyan-400 transition-colors relative",
                activeSection === 'contact' && "text-cyan-400"
              )}
            >
              Contact
              {activeSection === 'contact' && (
                <motion.span layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-px bg-cyan-400" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          <div className="flex md:hidden items-center gap-4 text-xs font-medium">
            <button onClick={() => scrollToSection('project-0')} className="hover:text-cyan-400">Work</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-cyan-400">About</button>
          </div>
        </div>
      </nav>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-2 text-sm text-white/50"
      >
        <span>Scroll or drag</span>
        <motion.span
          animate={{ x: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          →
        </motion.span>
      </motion.div>

      {/* Main Horizontal Container */}
      <motion.div
        ref={containerRef}
        className={cn(
          "h-full w-full",
          isMobile ? "flex flex-col overflow-y-auto overflow-x-hidden" : "flex flex-row overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing"
        )}
        style={isMobile ? {} : { x: springX }}
        drag={isMobile ? false : "x"}
        dragConstraints={isMobile ? {} : { left: -(window.innerWidth * 6), right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Hero Section */}
        <section
          id="hero"
          className={cn(
            "flex-shrink-0 flex flex-col items-center justify-center relative",
            isMobile ? "w-full min-h-screen py-20" : "w-screen h-screen snap-center"
          )}
        >
          <div className="text-center px-6 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6"
            >
              Alex Chen
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/60 font-light mb-8"
            >
              Designer & Developer
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => scrollToSection('project-0')}
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span className="text-sm font-medium tracking-wide">Scroll to explore</span>
              <span className="text-lg">→</span>
            </motion.button>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-400/20 blur-[120px]" />
          </div>
        </section>

        {/* Project Sections */}
        {projects.map((project, index) => (
          <section
            key={project.id}
            id={`project-${index}`}
            className={cn(
              "flex-shrink-0 flex items-center justify-center relative group",
              isMobile ? "w-full min-h-screen py-20 px-6" : "w-[85vw] h-screen snap-center pl-[10vw]"
            )}
          >
            <motion.div
              className="relative w-full max-w-5xl aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
              whileHover={isMobile ? {} : { scale: 1.02 }}
              transition={{ duration: 0.4 }}
              onClick={() => !isDragging && setSelectedProject(project)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <motion.div
                className="absolute bottom-0 left-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              >
                <p className="text-cyan-400 text-sm font-medium mb-2">{project.category}</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h2>
                <p className="text-white/60 text-sm">{project.year}</p>
              </motion.div>
            </motion.div>

            {/* Project number indicator */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block">
              <span className="text-8xl font-black text-white/5">{String(index + 1).padStart(2, '0')}</span>
            </div>
          </section>
        ))}

        {/* About Section */}
        <section
          id="about"
          className={cn(
            "flex-shrink-0 flex items-center justify-center relative",
            isMobile ? "w-full min-h-screen py-20 px-6" : "w-screen h-screen snap-center"
          )}
        >
          <div className={cn(
            "w-full max-w-6xl",
            isMobile ? "flex flex-col gap-12" : "flex flex-row items-center gap-16 px-12"
          )}>
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={isMobile ? "w-full max-w-sm mx-auto" : "w-[35%] flex-shrink-0"}
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white/5">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
                  alt="Alex Chen"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">About Me</h2>
              <div className="space-y-4 text-white/70 leading-relaxed mb-8">
                <p>
                  I'm a multidisciplinary designer and developer based in San Francisco, with over 8 years of experience creating digital experiences that blend aesthetics with functionality.
                </p>
                <p>
                  My approach combines strategic thinking with meticulous attention to detail, ensuring every project not only looks exceptional but also performs flawlessly across all platforms.
                </p>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {['React', 'TypeScript', 'Three.js', 'Figma', 'UI/UX', 'Brand Strategy', 'Motion Design', 'WebGL'].map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:border-cyan-400/50 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-6">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-cyan-400 transition-colors">
                  <SafeIcon name="github" size={24} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-cyan-400 transition-colors">
                  <SafeIcon name="linkedin" size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-cyan-400 transition-colors">
                  <SafeIcon name="instagram" size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-cyan-400 transition-colors">
                  <SafeIcon name="twitter" size={24} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className={cn(
            "flex-shrink-0 flex items-center justify-center relative",
            isMobile ? "w-full min-h-screen py-20 px-6 pb-32" : "w-screen h-screen snap-center"
          )}
        >
          <div className="w-full max-w-2xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8"
            >
              Let's work<br />together
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 mb-12"
            >
              <a href="mailto:hello@alexchen.design" className="block text-xl md:text-2xl text-cyan-400 hover:text-cyan-300 transition-colors">
                hello@alexchen.design
              </a>
              <p className="text-white/50">+1 (555) 123-4567</p>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6 text-left max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <textarea
                  placeholder="Tell me about your project"
                  rows={3}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-400 text-black font-semibold py-4 rounded-full hover:bg-cyan-300 transition-colors"
              >
                Send Message
              </button>
            </motion.form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30"
            >
              <p>© 2024 Alex Chen. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <div className="min-h-screen px-6 py-20 md:px-12 md:py-24">
              <button
                onClick={() => setSelectedProject(null)}
                className="fixed top-6 right-6 md:top-8 md:right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <SafeIcon name="x" size={24} />
              </button>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-8">
                  <p className="text-cyan-400 text-sm font-medium mb-2">{selectedProject.category}</p>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">{selectedProject.title}</h2>
                  <p className="text-white/50">{selectedProject.year}</p>
                </div>

                <div className="aspect-video rounded-lg overflow-hidden mb-8">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">About the Project</h3>
                    <p className="text-white/70 leading-relaxed mb-6">{selectedProject.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-cyan-400/10 text-cyan-400 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {selectedProject.gallery.map((img, idx) => (
                    <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-white/5">
                      <img src={img} alt={`${selectedProject.title} ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App