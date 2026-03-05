import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import * as LucideIcons from 'lucide-react'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
}

// Mock data
const popularMockups = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    category: "Device",
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600&q=80"
  },
  {
    id: 2,
    title: "MacBook Air",
    category: "Device",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=600&q=80"
  },
  {
    id: 3,
    title: "Poster Frame",
    category: "Print",
    image: "https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=600&q=80"
  },
  {
    id: 4,
    title: "T-Shirt Mockup",
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"
  },
  {
    id: 5,
    title: "Billboard",
    category: "Outdoor",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80"
  },
  {
    id: 6,
    title: "Coffee Cup",
    category: "Product",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80"
  }
]

const features = [
  {
    icon: "layers",
    title: "Thousands of Mockups",
    description: "Access our extensive library of high-quality mockups for any project"
  },
  {
    icon: "sun",
    title: "Realistic Lighting",
    description: "Professional lighting and shadows for photorealistic results"
  },
  {
    icon: "zap",
    title: "Instant Rendering",
    description: "Generate mockups in seconds with our powerful cloud infrastructure"
  },
  {
    icon: "shield-check",
    title: "Commercial License",
    description: "Use all mockups for commercial projects without restrictions"
  },
  {
    icon: "download",
    title: "Easy Export",
    description: "Download in multiple formats: PNG, JPG, PSD, and more"
  },
  {
    icon: "sparkles",
    title: "AI Backgrounds",
    description: "Generate unique backgrounds with our AI-powered tool"
  }
]

const useCases = [
  {
    icon: "palette",
    title: "For Designers",
    description: "Present your designs in realistic environments. Perfect for portfolios and client presentations."
  },
  {
    icon: "rocket",
    title: "For Startups",
    description: "Create professional marketing materials without expensive photoshoots."
  },
  {
    icon: "megaphone",
    title: "For Marketing",
    description: "Generate stunning visuals for social media, ads, and campaigns."
  }
]

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out",
    features: ["5 mockups per month", "Basic templates", "PNG export", "Watermarked downloads"],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Best for professionals",
    features: ["Unlimited mockups", "All templates", "High-res exports", "No watermark", "PSD files", "Priority support"],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Team",
    price: "$49",
    period: "per month",
    description: "For teams and agencies",
    features: ["Everything in Pro", "5 team members", "Brand kit", "API access", "Custom mockups", "Dedicated support"],
    cta: "Contact Sales",
    popular: false
  }
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "UI/UX Designer",
    company: "Stripe",
    content: "MockupPro saved me countless hours. The quality is incredible and the process is so simple.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
  },
  {
    name: "Marcus Johnson",
    role: "Marketing Director",
    company: "Notion",
    content: "We use MockupPro for all our product shots now. It's fast, affordable, and the results look professional.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
  },
  {
    name: "Emily Rodriguez",
    role: "Founder",
    company: "TechStart",
    content: "As a startup, we couldn't afford professional photography. MockupPro gave us studio-quality visuals.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
  }
]

const faqItems = [
  {
    question: "What is MockupPro?",
    answer: "MockupPro is an online platform that allows you to create professional mockups in seconds. Simply upload your design and we'll place it in realistic scenes."
  },
  {
    question: "Can I use mockups for commercial projects?",
    answer: "Yes! All our mockups come with a commercial license. You can use them for client work, products for sale, marketing materials, and more."
  },
  {
    question: "What file formats do you support?",
    answer: "We support PNG, JPG, PSD, and Sketch files for upload. You can download your mockups in PNG, JPG, or PSD formats."
  },
  {
    question: "Is there a free plan?",
    answer: "Yes! Our free plan includes 5 mockups per month with basic templates. Upgrade anytime for unlimited access."
  },
  {
    question: "How does the AI background generation work?",
    answer: "Our AI can generate unique backgrounds based on your description. Just tell us what you want, and we'll create it for you."
  }
]

// Section wrapper with animation
function AnimatedSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [settings, setSettings] = useState({})
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [selectedMockup, setSelectedMockup] = useState(0)
  const [activeFaq, setActiveFaq] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState('idle')

  // Fetch settings from API
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))
  }, [])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('submitting')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      setFormStatus('error')
    }
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg gradient-bg flex items-center justify-center">
                <SafeIcon name="layers" size={20} className="text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-900">MockupPro</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="nav-link text-gray-600 hover:text-gray-900 font-medium">Features</button>
              <button onClick={() => scrollToSection('examples')} className="nav-link text-gray-600 hover:text-gray-900 font-medium">Examples</button>
              <button onClick={() => scrollToSection('pricing')} className="nav-link text-gray-600 hover:text-gray-900 font-medium">Pricing</button>
              <button onClick={() => scrollToSection('faq')} className="nav-link text-gray-600 hover:text-gray-900 font-medium">FAQ</button>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900 font-medium">Log in</button>
              <button className="gradient-bg text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Try for free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <SafeIcon name={mobileMenuOpen ? "x" : "menu"} size={24} className="text-gray-900" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                <button onClick={() => scrollToSection('features')} className="text-left text-gray-600 py-2">Features</button>
                <button onClick={() => scrollToSection('examples')} className="text-left text-gray-600 py-2">Examples</button>
                <button onClick={() => scrollToSection('pricing')} className="text-left text-gray-600 py-2">Pricing</button>
                <button onClick={() => scrollToSection('faq')} className="text-left text-gray-600 py-2">FAQ</button>
                <hr />
                <button className="text-left text-gray-600 py-2">Log in</button>
                <button className="gradient-bg text-white px-5 py-2.5 rounded-lg font-semibold text-center">
                  Try for free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      {settings.show_hero !== false && (
        <section className="pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <AnimatedSection>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
                  <SafeIcon name="sparkles" size={16} />
                  <span>AI-Powered Mockup Generator</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight mb-6">
                  Create beautiful{' '}
                  <span className="gradient-text">mockups</span>{' '}
                  in seconds
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                  Transform your designs into stunning realistic mockups. No Photoshop needed.
                  Just upload, choose a scene, and download.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="gradient-bg text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
                    Try for free
                  </button>
                  <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">
                    <SafeIcon name="play-circle" size={20} />
                    Watch demo
                  </button>
                </div>
                <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white" />
                    ))}
                  </div>
                  <span>Trusted by 10,000+ designers</span>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="relative">
                  <div className="absolute inset-0 gradient-bg rounded-3xl blur-3xl opacity-20" />
                  <div className="relative grid grid-cols-2 gap-4">
                    <div className="space-y-4 mt-8">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="rounded-2xl overflow-hidden shadow-2xl"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80"
                          alt="iPhone mockup"
                          className="w-full h-auto"
                        />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="rounded-2xl overflow-hidden shadow-2xl"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80"
                          alt="MacBook mockup"
                          className="w-full h-auto"
                        />
                      </motion.div>
                    </div>
                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="rounded-2xl overflow-hidden shadow-2xl"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80"
                          alt="iPad mockup"
                          className="w-full h-auto"
                        />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="rounded-2xl overflow-hidden shadow-2xl"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=400&q=80"
                          alt="Poster mockup"
                          className="w-full h-auto"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}

      {/* Live Demo Section */}
      {settings.show_demo !== false && (
        <section id="demo" className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Try it live
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your design and see the magic happen instantly
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Upload Zone */}
                  <div className="space-y-6">
                    <div
                      className="upload-zone rounded-2xl p-8 text-center cursor-pointer"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {uploadedImage ? (
                        <img src={uploadedImage} alt="Uploaded" className="max-h-48 mx-auto rounded-lg" />
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                            <SafeIcon name="upload-cloud" size={32} className="text-blue-600" />
                          </div>
                          <p className="font-semibold text-gray-900 mb-2">Drop your design here</p>
                          <p className="text-sm text-gray-500">or click to browse</p>
                        </>
                      )}
                    </div>

                    {/* Mockup Selector */}
                    <div>
                      <p className="font-semibold text-gray-900 mb-3">Choose mockup</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[0, 1, 2, 3].map((i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedMockup(i)}
                            className={cn(
                              "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                              selectedMockup === i ? "border-blue-600" : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <img
                              src={popularMockups[i]?.image || popularMockups[0].image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-100 rounded-2xl p-6 flex items-center justify-center min-h-[300px]">
                    {uploadedImage ? (
                      <div className="relative">
                        <img
                          src={popularMockups[selectedMockup]?.image || popularMockups[0].image}
                          alt="Mockup preview"
                          className="rounded-lg shadow-lg max-h-64"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg max-w-[60%]">
                            <img src={uploadedImage} alt="Design" className="max-h-32 rounded" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <SafeIcon name="image" size={48} className="mx-auto mb-3 opacity-50" />
                        <p>Preview will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Popular Mockups */}
      {settings.show_popular !== false && (
        <section className="py-20 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Popular mockups
                </h2>
                <p className="text-lg text-gray-600">
                  Most used templates by our community
                </p>
              </div>
              <button className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
                View all
                <SafeIcon name="arrow-right" size={20} />
              </button>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {popularMockups.map((mockup, index) => (
                <motion.div
                  key={mockup.id}
                  variants={scaleIn}
                  className="mockup-card bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={mockup.image}
                      alt={mockup.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{mockup.category}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{mockup.title}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* How It Works */}
      {settings.show_how_it_works !== false && (
        <section className="py-20 md:py-32 bg-gray-900 text-white">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                How it works
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Create professional mockups in three simple steps
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                { step: "1", icon: "upload", title: "Upload design", desc: "Upload your screenshot, logo, or artwork in any popular format" },
                { step: "2", icon: "layout", title: "Choose mockup", desc: "Select from thousands of realistic scenes and devices" },
                { step: "3", icon: "download", title: "Download image", desc: "Get your high-res mockup in seconds, ready to use" }
              ].map((item, index) => (
                <AnimatedSection key={item.step} delay={index * 0.1}>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl step-number flex items-center justify-center mx-auto mb-6">
                      <SafeIcon name={item.icon} size={32} className="text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Examples / Gallery */}
      {settings.show_examples !== false && (
        <section id="examples" className="py-20 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Real examples
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See what our users create with MockupPro
              </p>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[1,2,3,4,5,6,7,8].map((i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className={cn(
                    "rounded-2xl overflow-hidden shadow-lg",
                    i === 1 || i === 6 ? "col-span-2 row-span-2" : ""
                  )}
                >
                  <img
                    src={`https://images.unsplash.com/photo-${[
                      "1551650975-87deedd944c3",
                      "1460925895917-afdab827c52f",
                      "1561070791625-6f336037256b",
                      "1559028013-df605f7c7303",
                      "1542744094-24638eff58bb",
                      "1507238691740-187a5b1d37b8",
                      "1558655146-9f40138edfeb",
                      "1467232004584-a241de8bcf5d"
                    ][i-1]}?w=600&q=80`}
                    alt={`Example ${i}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Features */}
      {settings.show_features !== false && (
        <section id="features" className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Everything you need
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful features to create stunning mockups effortlessly
              </p>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="feature-card bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                    <SafeIcon name={feature.icon} size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Use Cases */}
      {settings.show_use_cases !== false && (
        <section className="py-20 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Perfect for
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Whatever you do, we've got you covered
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <AnimatedSection key={useCase.title} delay={index * 0.1}>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 h-full">
                    <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-6">
                      <SafeIcon name={useCase.icon} size={28} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{useCase.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{useCase.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      {settings.show_pricing !== false && (
        <section id="pricing" className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Simple pricing
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Start free, upgrade when you need more
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <AnimatedSection key={plan.name} delay={index * 0.1}>
                  <div className={cn(
                    "pricing-card bg-white rounded-3xl p-8 h-full flex flex-col",
                    plan.popular ? "pricing-card-popular shadow-xl shadow-blue-500/10" : "shadow-lg"
                  )}>
                    {plan.popular && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                        <SafeIcon name="star" size={12} />
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl md:text-5xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <SafeIcon name="check" size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className={cn(
                      "w-full py-3.5 rounded-xl font-bold transition-all",
                      plan.popular
                        ? "gradient-bg text-white hover:opacity-90 shadow-lg shadow-blue-500/25"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    )}>
                      {plan.cta}
                    </button>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {settings.show_testimonials !== false && (
        <section className="py-20 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Loved by creators
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See what our users say about MockupPro
              </p>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-6 md:gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  variants={fadeInUp}
                  className="testimonial-card bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map((star) => (
                      <SafeIcon key={star} name="star" size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {settings.show_faq !== false && (
        <section id="faq" className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto max-w-3xl px-4 md:px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Frequently asked
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to know
              </p>
            </AnimatedSection>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <AnimatedSection key={index} delay={index * 0.05}>
                  <div className="faq-item bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                      <SafeIcon
                        name={activeFaq === index ? "minus" : "plus"}
                        size={20}
                        className="text-gray-400 flex-shrink-0"
                      />
                    </button>
                    <AnimatePresence>
                      {activeFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <AnimatedSection>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 gradient-bg" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative px-6 py-16 md:py-24 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to create stunning mockups?
                </h2>
                <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Join thousands of designers and start creating professional mockups today.
                </p>
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
                  Get started for free
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 pb-24">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                  <SafeIcon name="layers" size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold">MockupPro</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                Create beautiful mockups in seconds. The easiest way to present your designs professionally.
              </p>
              <div className="flex gap-4">
                {['twitter', 'github', 'instagram', 'linkedin'].map((social) => (
                  <button key={social} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <SafeIcon name={social} size={20} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button className="hover:text-white transition-colors">Features</button></li>
                <li><button className="hover:text-white transition-colors">Pricing</button></li>
                <li><button className="hover:text-white transition-colors">Examples</button></li>
                <li><button className="hover:text-white transition-colors">Mockup Library</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button className="hover:text-white transition-colors">Blog</button></li>
                <li><button className="hover:text-white transition-colors">Help Center</button></li>
                <li><button className="hover:text-white transition-colors">API Docs</button></li>
                <li><button className="hover:text-white transition-colors">Status</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button className="hover:text-white transition-colors">About</button></li>
                <li><button className="hover:text-white transition-colors">Careers</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">Privacy</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 MockupPro. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App