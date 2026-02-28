import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus(null)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (err) {
      setSubmitStatus('error')
    }

    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-900/30">
        <nav className="container mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight">Brand</div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); document.getElementById('hero').scrollIntoView({behavior: 'smooth'}) }}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={(e) => { e.preventDefault(); document.getElementById('features').scrollIntoView({behavior: 'smooth'}) }}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({behavior: 'smooth'}) }}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </nav>
      </header>

      {/* Block 1: Hero */}
      {settings.show_hero !== false && (
        <section id="hero" className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                Build Digital Excellence
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                Minimalist design meets powerful functionality. Create stunning experiences without the complexity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={settings.cta_link || '#contact'}
                  onClick={(e) => {
                    if (settings.cta_link?.startsWith('#')) {
                      e.preventDefault()
                      document.querySelector(settings.cta_link)?.scrollIntoView({behavior: 'smooth'})
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-600/25"
                >
                  Get Started
                  <SafeIcon name="arrow-right" size={20} />
                </a>
                <a
                  href="#features"
                  onClick={(e) => { e.preventDefault(); document.getElementById('features').scrollIntoView({behavior: 'smooth'}) }}
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Block 2: Features */}
      {settings.show_features !== false && (
        <section id="features" className="py-20 md:py-32 px-4 md:px-6 bg-slate-900/30">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Why Choose Us</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Three pillars of excellence that define our approach to digital craftsmanship.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: 'zap',
                  title: 'Lightning Fast',
                  desc: 'Optimized performance ensures your users never wait. Speed is not just a feature, it is the foundation.',
                  color: 'yellow'
                },
                {
                  icon: 'shield-check',
                  title: 'Secure & Reliable',
                  desc: 'Enterprise-grade security built into every layer. Your data and users are protected 24/7.',
                  color: 'green'
                },
                {
                  icon: 'sparkles',
                  title: 'Stunning Design',
                  desc: 'Beautiful, intuitive interfaces that captivate and convert. Design that speaks your brand language.',
                  color: 'purple'
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="group p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-900/80"
                >
                  <div className={`w-14 h-14 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <SafeIcon name={feature.icon} size={28} className={`text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Block 3: Contact */}
      {settings.show_contact !== false && (
        <section id="contact" className="py-20 md:py-32 px-4 md:px-6 pb-32">
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 md:p-12 backdrop-blur-sm"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Get in Touch</h2>
                  <p className="text-gray-400 text-lg">Ready to start your next project? Send us a message and we will respond within 24 hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                      placeholder="Tell us about your project..."
                      required
                    />
                  </div>

                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg p-3"
                      >
                        <SafeIcon name="check-circle" size={16} />
                        Message sent successfully! We will be in touch soon.
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3"
                      >
                        <SafeIcon name="alert-circle" size={16} />
                        Failed to send message. Please try again.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-600/25 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <SafeIcon name="send" size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-900/30 bg-black/20">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© 2024 Brand. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-600/25 flex items-center justify-center transition-all hover:scale-110"
          >
            <SafeIcon name="chevron-up" size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App