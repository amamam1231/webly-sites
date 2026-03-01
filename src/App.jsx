import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// FAQ Data for Chat Widget
const FAQ_DATA = [
  {
    question: "What services do you offer?",
    answer: "We specialize in Web3 marketing including NFT launches, DeFi promotions, community building, influencer partnerships, and blockchain brand strategy.",
    keywords: ["services", "offer", "what do you do", "marketing"]
  },
  {
    question: "How much does it cost?",
    answer: "Our pricing varies based on project scope. We offer packages starting from $5,000 for community management to $50,000+ for full-scale NFT launches.",
    keywords: ["price", "cost", "how much", "pricing", "budget"]
  },
  {
    question: "Do you work with all blockchains?",
    answer: "Yes! We support Ethereum, Solana, Polygon, BNB Chain, Avalanche, and other major L1/L2 networks.",
    keywords: ["blockchain", "ethereum", "solana", "network", "chain"]
  },
  {
    question: "How long until we see results?",
    answer: "Most clients see initial traction within 2-4 weeks. Full campaign results typically manifest in 2-3 months depending on the strategy.",
    keywords: ["results", "timeline", "how long", "when", "time"]
  }
]

const SITE_CONTEXT = "Web3 Marketing Agency specializing in crypto projects, NFT launches, DeFi promotions, and blockchain community growth."

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ type: 'bot', text: 'Hello! How can I help you with your Web3 marketing needs?' }])
  const [chatInput, setChatInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState(null)

  const contactFormRef = useRef(null)
  const isContactInView = useInView(contactFormRef, { once: true, margin: "-100px" })

  const connectWallet = () => {
    setWalletConnected(true)
    setWalletAddress('0x7a2...9f4b')
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress('')
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = chatInput.trim()
    setChatMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setChatInput('')

    // Check FAQ
    const lowerMsg = userMessage.toLowerCase()
    const faqMatch = FAQ_DATA.find(faq =>
      faq.keywords.some(k => lowerMsg.includes(k))
    )

    if (faqMatch) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: 'bot', text: faqMatch.answer }])
      }, 500)
    } else {
      // AI Fallback
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          type: 'bot',
          text: "Thanks for your question! This requires a personalized consultation. Please fill out our contact form or email us at hello@web3agency.io"
        }])
      }, 800)
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setFormStatus('success')
        e.target.reset()
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      setFormStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const services = [
    { icon: 'zap', title: 'NFT Launch Strategy', desc: 'End-to-end NFT project launches with community building and marketing campaigns.' },
    { icon: 'trending-up', title: 'DeFi Growth', desc: 'Accelerate your DeFi protocol adoption with targeted user acquisition strategies.' },
    { icon: 'users', title: 'Community Building', desc: 'Build engaged crypto communities on Discord, Telegram, and Twitter.' },
    { icon: 'shield', title: 'Brand Protection', desc: 'Reputation management and security auditing partnerships for trust building.' },
    { icon: 'globe', title: 'Global Reach', desc: 'Multi-language campaigns targeting key crypto markets worldwide.' },
    { icon: 'bar-chart-3', title: 'Analytics & Insights', desc: 'On-chain analytics and market intelligence for data-driven decisions.' }
  ]

  const cases = [
    { name: 'MetaVerse Pro', category: 'NFT Collection', result: '$2.4M Volume', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80' },
    { name: 'DeFi Swap', category: 'DeFi Protocol', result: '50K Users', image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&q=80' },
    { name: 'Crypto Game', category: 'GameFi', result: '100K Players', image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=600&q=80' },
    { name: 'DAO Launch', category: 'Governance', result: '25K Members', image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=600&q=80' }
  ]

  const team = [
    { name: 'Alex Chen', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
    { name: 'Sarah Kim', role: 'Head of Strategy', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
    { name: 'Mike Ross', role: 'Web3 Lead', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
    { name: 'Emma Wilson', role: 'Community Manager', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="zap" size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Web3Agency
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {['Services', 'Cases', 'Team', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={walletConnected ? disconnectWallet : connectWallet}
                className={cn(
                  "hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  walletConnected
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/25"
                )}
              >
                <SafeIcon name={walletConnected ? "check" : "wallet"} size={16} />
                {walletConnected ? `${walletAddress}` : 'Connect Wallet'}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white"
              >
                <SafeIcon name={isMenuOpen ? "x" : "menu"} size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black/95 border-b border-gray-800"
          >
            <div className="px-4 py-4 space-y-3">
              {['Services', 'Cases', 'Team', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left py-2 text-gray-300 hover:text-white"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={walletConnected ? disconnectWallet : connectWallet}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium"
              >
                <SafeIcon name={walletConnected ? "check" : "wallet"} size={18} />
                {walletConnected ? 'Disconnect' : 'Connect Wallet'}
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              <SafeIcon name="rocket" size={16} />
              <span>Leading Web3 Marketing Agency</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
              <span className="text-white">Scale Your </span>
              <span className="gradient-text">Web3 Project</span>
              <span className="text-white"> to Millions</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Premium marketing strategies for NFT collections, DeFi protocols, and blockchain startups.
              We turn crypto ideas into mainstream success stories.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Your Campaign
                <SafeIcon name="arrow-right" size={20} />
              </button>
              <button
                onClick={() => scrollToSection('cases')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-gray-700 text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                View Case Studies
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-16 flex items-center justify-center gap-8 text-gray-500">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 border-2 border-slate-950" />
                ))}
              </div>
              <p className="text-sm">Trusted by <span className="text-white font-semibold">200+</span> Web3 projects</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-white mb-4">
              Full-Stack <span className="gradient-text">Web3 Marketing</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
              From NFT drops to DeFi protocols, we provide end-to-end marketing solutions for the decentralized future.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <SafeIcon name={service.icon} size={24} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="cases" className="py-20 md:py-32 bg-black/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-white mb-4">
              Success <span className="gradient-text">Stories</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
              Real results for real Web3 projects. See how we helped these brands achieve their goals.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {cases.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-400 text-sm font-medium mb-1">{item.category}</p>
                      <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                      <p className="text-gray-300">{item.result}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                      <SafeIcon name="external-link" size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-white mb-4">
              Meet the <span className="gradient-text">Team</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
              Crypto natives and marketing experts united by a passion for decentralization.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group text-center"
              >
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="text-cyan-400 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-black/50" ref={contactFormRef}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate={isContactInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-white mb-4">
                Start Your <span className="gradient-text">Campaign</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-400 text-lg">
                Ready to scale your Web3 project? Let's talk strategy.
              </motion.p>
            </div>

            <motion.form
              variants={fadeInUp}
              onSubmit={handleContactSubmit}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="john@project.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
                <select
                  name="project_type"
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                >
                  <option>NFT Collection Launch</option>
                  <option>DeFi Protocol Marketing</option>
                  <option>GameFi/Play-to-Earn</option>
                  <option>DAO/Community Building</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <SafeIcon name="send" size={20} />
                  </>
                )}
              </button>

              {formStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-center"
                >
                  Thanks! We'll get back to you within 24 hours.
                </motion.div>
              )}

              {formStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-center"
                >
                  Something went wrong. Please try again.
                </motion.div>
              )}
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-900">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="zap" size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">Web3Agency</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <SafeIcon name="twitter" size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <SafeIcon name="github" size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <SafeIcon name="linkedin" size={24} />
              </a>
            </div>

            <p className="text-gray-500 text-sm">
              © 2024 Web3Agency. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <SafeIcon name="message-circle" size={28} />
          </motion.button>
        )}

        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-80 md:w-96 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SafeIcon name="bot" size={20} className="text-cyan-400" />
                <span className="font-semibold text-white">Web3 Assistant</span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <SafeIcon name="x" size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      msg.type === 'user'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about our services..."
                className="flex-1 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center hover:bg-cyan-400 transition-colors"
              >
                <SafeIcon name="send" size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default App