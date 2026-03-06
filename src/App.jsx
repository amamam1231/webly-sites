// === IMPORTS ===
import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] } }
}

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] } }
}

// Animated section wrapper
function AnimatedSection({ children, className, delay = 0 }) {
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

// Data
const popularMockups = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    category: "Devices",
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600&q=80",
    downloads: "12.5k"
  },
  {
    id: 2,
    title: "MacBook Air",
    category: "Devices",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    downloads: "8.2k"
  },
  {
    id: 3,
    title: "Poster Frame",
    category: "Print",
    image: "https://images.unsplash.com/photo-1561070791625-6f336037256b?w=600&q=80",
    downloads: "6.1k"
  },
  {
    id: 4,
    title: "Billboard",
    category: "Outdoor",
    image: "https://images.unsplash.com/photo-1563693997-667ba6ed9db6?w=600&q=80",
    downloads: "4.8k"
  },
  {
    id: 5,
    title: "iPad Pro",
    category: "Devices",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
    downloads: "7.3k"
  },
  {
    id: 6,
    title: "T-Shirt",
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    downloads: "5.9k"
  }
]

const features = [
  {
    icon: "zap",
    title: "Lightning Fast",
    description: "Generate professional mockups in seconds with our optimized rendering engine."
  },
  {
    icon: "image",
    title: "10,000+ Templates",
    description: "Access our vast library of high-quality mockup templates for every need."
  },
  {
    icon: "sparkles",
    title: "AI-Powered",
    description: "Smart suggestions and automatic adjustments for perfect results every time."
  },
  {
    icon: "shield-check",
    title: "Commercial License",
    description: "Use all mockups for commercial projects without any attribution required."
  },
  {
    icon: "download",
    title: "4K Export",
    description: "Download your mockups in ultra-high resolution for any use case."
  },
  {
    icon: "palette",
    title: "Smart Editing",
    description: "Intuitive tools for colors, shadows, and scene customization."
  }
]

const useCases = [
  {
    icon: "smartphone",
    title: "For Designers",
    description: "Present your UI designs in realistic environments that impress clients.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: "rocket",
    title: "For Startups",
    description: "Create stunning marketing materials and app store screenshots quickly.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: "megaphone",
    title: "For Marketing",
    description: "Generate consistent brand visuals across all channels and campaigns.",
    color: "from-orange-500 to-red-500"
  }
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    company: "Figma",
    content: "MockupPro transformed how I present designs to stakeholders. The quality is unmatched and it saves me hours every week.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
  },
  {
    name: "Marcus Johnson",
    role: "Founder",
    company: "TechStart",
    content: "We created all our App Store screenshots in one afternoon. The mockups look incredibly realistic and professional.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
  },
  {
    name: "Emily Rodriguez",
    role: "Creative Director",
    company: "Studio X",
    content: "The best mockup generator I've ever used. The AI features and smart suggestions are game-changers for our workflow.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
  }
]

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for trying out",
    features: ["10 mockups/month", "Standard quality", "Basic templates", "PNG export"],
    cta: "Get started",
    popular: false
  },
  {
    name: "Pro",
    price: "19",
    description: "For professional creators",
    features: ["Unlimited mockups", "4K quality", "All templates", "AI background removal", "Priority support", "Commercial license"],
    cta: "Start free trial",
    popular: true
  },
  {
    name: "Team",
    price: "49",
    description: "For agencies & teams",
    features: ["Everything in Pro", "5 team members", "Brand kits", "API access", "Dedicated support", "Custom templates"],
    cta: "Contact sales",
    popular: false
  }
]

const faqItems = [
  {
    question: "What file formats can I upload?",
    answer: "We support all major image formats including PNG, JPG, WebP, and SVG. For best results, we recommend using high-resolution PNG files with transparent backgrounds."
  },
  {
    question: "Can I use mockups for commercial projects?",
    answer: "Yes! All our mockups come with a commercial license. You can use them for client work, products for sale, marketing materials, and any other commercial purpose."
  },
  {
    question: "How does the AI background generation work?",
    answer: "Our AI analyzes your design and generates contextually appropriate backgrounds that match your brand and product style. Simply describe what you want, and the AI creates it instantly."
  },
  {
    question: "Is there a free trial for Pro features?",
    answer: "Yes, we offer a 7-day free trial of all Pro features. No credit card required to start. You can cancel anytime during the trial."
  },
  {
    question: "What resolution are the exported mockups?",
    answer: "Free users get up to 1080px exports. Pro and Team users can export in 4K resolution (3840px), perfect for print and high-DPI displays."
  }
]

// Main App Component
function App() {
  const [activeFaq, setActiveFaq] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [selectedMockup, setSelectedMockup] = useState(1)
  const [settings, setSettings] = useState({
    show_hero: true,
    show_demo: true,
    show_popular: true,
    show_how_it_works: true,
    show_examples: true,
    show_features: true,
    show_use_cases: true,
    show_pricing: true,
    show_testimonials: true,
    show_faq: true
  })

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="aurora" />
        <div className="noise" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <SafeIcon name="layers" size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                MockupPro
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button className="nav-link text-sm font-medium">Features</button>
              <button className="nav-link text-sm font-medium">Examples</button>
              <button className="nav-link text-sm font-medium">Pricing</button>
              <button className="nav-link text-sm font-medium">Blog</button>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Sign in
              </button>
              <button className="gradient-button px-5 py-2.5 rounded-xl text-sm font-semibold text-white">
                Get started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {settings.show_hero !== false && (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <AnimatedSection>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-slate-300">New: AI Background Generation</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                  Create beautiful{" "}
                  <span className="gradient-text">mockups</span>
                  <br />
                  in seconds
                </h1>
                <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-xl leading-relaxed">
                  The fastest way to present your designs. Upload your work, choose a scene, and download professional mockups instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="gradient-button px-8 py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-purple-500/25">
                    Try for free
                  </button>
                  <button className="glass-button px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2">
                    <SafeIcon name="play-circle" size={20} />
                    Watch demo
                  </button>
                </div>
                <div className="mt-10 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 overflow-hidden">
                        <img
                          src={`https://images.unsplash.com/photo-${['1494790108377-be9c29b29330', '1507003211169-0a1dd7228f2d', '1438761681033-6461ffad8d80', '1500648767791-00dcc994a43e'][i-1]}?w=100&q=80`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-slate-400">
                    <span className="text-slate-200 font-semibold">10,000+</span> designers trust us
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
                  <div className="relative grid grid-cols-2 gap-4">
                    <div className="space-y-4 mt-8">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="glass-card rounded-2xl overflow-hidden float"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80"
                          alt="iPhone mockup"
                          className="w-full h-auto"
                        />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="glass-card rounded-2xl overflow-hidden float-delayed"
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
                        className="glass-card rounded-2xl overflow-hidden float-delayed"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80"
                          alt="iPad mockup"
                          className="w-full h-auto"
                        />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="glass-card rounded-2xl overflow-hidden float"
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
        <section id="demo" className="py-20 md:py-32 relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Try it <span className="gradient-text">live</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Upload your design and see the magic happen instantly
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="max-w-5xl mx-auto glass-card rounded-3xl p-6 md:p-10 glow-purple">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Upload Zone */}
                  <div className="space-y-6">
                    <div
                      className="upload-zone rounded-2xl p-10 text-center cursor-pointer h-full flex flex-col items-center justify-center min-h-[300px]"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                        <SafeIcon name="upload" size={32} className="text-purple-400" />
                      </div>
                      <p className="text-lg font-semibold text-slate-200 mb-2">
                        Drop your design here
                      </p>
                      <p className="text-sm text-slate-500">
                        or click to browse files
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {['PNG', 'JPG', 'SVG', 'WEBP'].map((format) => (
                          <span key={format} className="px-3 py-1 rounded-full bg-white/5 text-xs text-slate-400 border border-white/10">
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="glass-card rounded-2xl p-6 flex items-center justify-center min-h-[300px] bg-gradient-to-br from-slate-900 to-slate-800">
                    {uploadedImage ? (
                      <div className="relative w-full max-w-[280px]">
                        <img
                          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80"
                          alt="Device frame"
                          className="w-full"
                        />
                        <div className="absolute inset-[12%] overflow-hidden rounded-[8%]">
                          <img src={uploadedImage} alt="Design" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500">
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
        <section className="py-20 md:py-32 relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Popular <span className="gradient-text">mockups</span>
                </h2>
                <p className="text-lg text-slate-400">
                  Most used templates by our community
                </p>
              </div>
              <button className="group flex items-center gap-2 text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                View all
                <SafeIcon name="arrow-right" size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {popularMockups.map((mockup, index) => (
                <motion.div
                  key={mockup.id}
                  variants={scaleIn}
                  className="mockup-card glass-card rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-900 relative">
                    <img
                      src={mockup.image}
                      alt={mockup.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="w-full py-2.5 rounded-lg gradient-button text-white text-sm font-semibold">
                        Use template
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-200">{mockup.title}</h3>
                      <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-slate-400 border border-white/10">
                        {mockup.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <SafeIcon name="download" size={14} />
                      <span>{mockup.downloads}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* How It Works */}
      {settings.show_how_it_works !== false && (
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                How it <span className="gradient-text">works</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Create stunning mockups in three simple steps
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Upload design", desc: "Drag and drop your design file or select from your device", icon: "upload" },
                { step: "02", title: "Choose mockup", desc: "Pick from thousands of realistic scenes and templates", icon: "layout" },
                { step: "03", title: "Download image", desc: "Get your high-quality mockup in seconds, ready to use", icon: "download" }
              ].map((item, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <div className="relative text-center group">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass-card flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                      <SafeIcon name={item.icon} size={32} className="text-purple-400" />
                    </div>
                    <div className="step-number w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold text-white shadow-lg shadow-purple-500/30">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-slate-200 mb-2">{item.title}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-purple-500/50 to-transparent" />
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Examples / Gallery */}
      {settings.show_examples !== false && (
        <section id="examples" className="py-20 md:py-32 relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Real <span className="gradient-text">examples</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
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
                    "rounded-2xl overflow-hidden glass-card group cursor-pointer",
                    i === 1 || i === 6 ? "col-span-2 row-span-2" : ""
                  )}
                >
                  <div className="relative h-full overflow-hidden">
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
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Features */}
      {settings.show_features !== false && (
        <section id="features" className="py-20 md:py-32 relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Everything you <span className="gradient-text">need</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Powerful features to create stunning mockups effortlessly
              </p>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="feature-card rounded-2xl p-6 md:p-8"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                    <SafeIcon name={feature.icon} size={24} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Use Cases */}
      {settings.show_use_cases !== false && (
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-purple-500/5" />
          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Built for <span className="gradient-text">creators</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Whatever your role, MockupPro helps you shine
              </p>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-6"
            >
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  variants={scaleIn}
                  className="glass-card rounded-2xl p-8 text-center group hover:border-purple-500/30 transition-colors"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${useCase.color} flex items-center justify-center shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <SafeIcon name={useCase.icon} size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 mb-3">{useCase.title}</h3>
                  <p className="text-slate-400">{useCase.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Pricing */}
      {settings.show_pricing !== false && (
        <section id="pricing" className="py-20 md:py-32 relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Simple <span className="gradient-text">pricing</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Choose the plan that fits your needs
              </p>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  variants={fadeInUp}
                  className={cn(
                    "pricing-card rounded-2xl p-6 md:p-8 relative",
                    plan.popular && "pricing-card-popular"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-button text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-slate-500">/month</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                        <SafeIcon name="check" size={16} className="text-purple-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={cn(
                    "w-full py-3 rounded-xl font-semibold transition-all",
                    plan.popular
                      ? "gradient-button text-white"
                      : "glass-button text-slate-200 hover:text-white"
                  )}>
                    {plan.cta}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {settings.show_testimonials !== false && (
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Loved by <span className="gradient-text">thousands</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                See what our users say about MockupPro
              </p>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-6"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  variants={fadeInUp}
                  className="testimonial-card rounded-2xl p-6 md:p-8"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map((star) => (
                      <SafeIcon key={star} name="star" size={16} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                    />
                    <div>
                      <p className="font-bold text-slate-200">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role} at {testimonial.company}</p>
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
        <section id="faq" className="py-20 md:py-32 relative">
          <div className="container mx-auto max-w-3xl px-4 md:px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Frequently <span className="gradient-text">asked</span>
              </h2>
              <p className="text-lg text-slate-400">
                Everything you need to know
              </p>
            </AnimatedSection>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <AnimatedSection key={index} delay={index * 0.05}>
                  <div className="faq-item rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="font-semibold text-slate-200 pr-4">{item.question}</span>
                      <SafeIcon
                        name={activeFaq === index ? "minus" : "plus"}
                        size={20}
                        className="text-purple-400 flex-shrink-0"
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
                          <div className="px-6 pb-6 text-slate-400 leading-relaxed">
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
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <AnimatedSection>
            <div className="relative rounded-3xl overflow-hidden glass-card glow-purple">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20" />
              <div className="relative px-6 py-16 md:py-24 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to create stunning mockups?
                </h2>
                <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of designers and start creating professional mockups today.
                </p>
                <button className="gradient-button px-8 py-4 rounded-xl font-bold text-lg text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
                  Get started for free
                </button>
                <p className="mt-4 text-sm text-slate-400">No credit card required</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-16 pb-24 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <SafeIcon name="layers" size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  MockupPro
                </span>
              </div>
              <p className="text-slate-400 mb-6 max-w-sm">
                Create beautiful mockups in seconds. The easiest way to present your designs professionally.
              </p>
              <div className="flex gap-3">
                {['twitter', 'github', 'instagram', 'linkedin'].map((social) => (
                  <button key={social} className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:bg-white/10 transition-colors">
                    <SafeIcon name={social} size={20} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-4">Product</h4>
              <ul className="space-y-3 text-slate-400">
                <li><button className="hover:text-white transition-colors">Features</button></li>
                <li><button className="hover:text-white transition-colors">Pricing</button></li>
                <li><button className="hover:text-white transition-colors">Examples</button></li>
                <li><button className="hover:text-white transition-colors">Mockup Library</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-4">Resources</h4>
              <ul className="space-y-3 text-slate-400">
                <li><button className="hover:text-white transition-colors">Blog</button></li>
                <li><button className="hover:text-white transition-colors">Help Center</button></li>
                <li><button className="hover:text-white transition-colors">API Docs</button></li>
                <li><button className="hover:text-white transition-colors">Status</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 mb-4">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><button className="hover:text-white transition-colors">About</button></li>
                <li><button className="hover:text-white transition-colors">Careers</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">Privacy</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 MockupPro. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
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