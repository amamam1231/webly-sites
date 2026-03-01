import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for Tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// FAQ Data for Chat Widget
const FAQ_DATA = [
  {
    question: "What blockchain networks do you support?",
    answer: "We support Ethereum, Solana, Polygon, BSC, and Arbitrum. Our team can also integrate with custom EVM chains based on your project needs.",
    keywords: ["blockchain", "network", "ethereum", "solana", "polygon", "chain", "networks"]
  },
  {
    question: "How long does an NFT launch campaign take?",
    answer: "A typical NFT launch campaign takes 4-6 weeks including strategy, community building, influencer partnerships, and mint execution. Urgent launches can be expedited to 2 weeks.",
    keywords: ["nft", "launch", "campaign", "timeline", "how long", "mint", "duration"]
  },
  {
    question: "What is your pricing model?",
    answer: "We offer flexible pricing: monthly retainers for ongoing marketing, project-based fees for specific campaigns, or success-based models tied to token/NFT performance metrics.",
    keywords: ["price", "pricing", "cost", "fee", "retainer", "budget", "how much"]
  },
  {
    question: "Do you handle smart contract development?",
    answer: "We partner with audited smart contract developers for technical implementation while focusing on the marketing, community, and growth strategy aspects of your Web3 project.",
    keywords: ["smart contract", "development", "contract", "technical", "solidity", "code"]
  },
  {
    question: "Can you help with DAO governance setup?",
    answer: "Absolutely! We specialize in DAO formation including tokenomics design, governance framework, proposal systems, and community onboarding for decentralized organizations.",
    keywords: ["dao", "governance", "decentralized", "organization", "tokenomics", "proposal"]
  }
]

const SITE_CONTEXT = "NEXUS is a premium Web3 marketing agency specializing in NFT launches, tokenization strategies, DAO growth, and blockchain community building. We help crypto projects achieve viral growth through strategic marketing."

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime = null
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am NEXUS AI Assistant. Ask me about our Web3 marketing services, pricing, or blockchain support.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findFAQAnswer = (query) => {
    const lowerQuery = query.toLowerCase()
    for (const faq of FAQ_DATA) {
      if (faq.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return faq.answer
      }
    }
    return null
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setIsLoading(true)

    // Check FAQ first
    const faqAnswer = findFAQAnswer(userMessage)

    if (faqAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: faqAnswer }])
        setIsLoading(false)
      }, 500)
      return
    }

    // Fallback to API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: SITE_CONTEXT })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        throw new Error('API failed')
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I am having trouble connecting. Here are some topics I can help with: NFT marketing, token launches, DAO strategy, or community building. What would you like to know?'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <SafeIcon name="x" size={24} /> : <SafeIcon name="message-square" size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] glass rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-purple-500/20"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-cyan-600/20">
              <div className="flex items-center gap-2">
                <SafeIcon name="bot" size={20} className="text-purple-400" />
                <span className="font-semibold">NEXUS Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <SafeIcon name="x" size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[380px]">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-slate-800/80 text-gray-200 rounded-bl-none border border-white/10'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 p-3 rounded-xl rounded-bl-none border border-white/10">
                    <div className="flex gap-1">
                      <motion.div className="w-2 h-2 bg-purple-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                      <motion.div className="w-2 h-2 bg-purple-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} />
                      <motion.div className="w-2 h-2 bg-purple-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-slate-900/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about Web3 marketing..."
                  className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors"
                >
                  <SafeIcon name="send" size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Main App Component
function App() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState('idle') // idle, submitting, success, error

  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'

  const connectWallet = async () => {
    // Simulate wallet connection
    setWalletConnected(true)
    setWalletAddress('0x7a86...3f9a')
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress('')
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('submitting')

    const formData = new FormData()
    formData.append('access_key', ACCESS_KEY)
    formData.append('name', formState.name)
    formData.append('email', formState.email)
    formData.append('message', formState.message)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setFormStatus('success')
        setFormState({ name: '', email: '', message: '' })
        setTimeout(() => setFormStatus('idle'), 3000)
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      setFormStatus('error')
      setTimeout(() => setFormStatus('idle'), 3000)
    }
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  const services = [
    {
      icon: 'hexagon',
      title: 'NFT Launch Strategy',
      description: 'End-to-end NFT collection launches including art direction, smart contract coordination, and viral marketing campaigns.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'layers',
      title: 'Tokenization',
      description: 'Transform assets into digital tokens. We handle tokenomics design, whitepaper creation, and exchange listings.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: 'users',
      title: 'DAO Growth',
      description: 'Build decentralized communities with governance frameworks, proposal systems, and engagement strategies.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: 'trending-up',
      title: 'DeFi Marketing',
      description: 'Drive TVL and user acquisition for DeFi protocols through targeted campaigns and KOL partnerships.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: 'globe',
      title: 'Community Building',
      description: 'Grow organic communities on Discord, Telegram, and Twitter with engagement strategies and AMA coordination.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: 'sparkles',
      title: 'Web3 Branding',
      description: 'Create memorable blockchain brands with visual identity, messaging, and positioning for the crypto-native audience.',
      color: 'from-pink-500 to-rose-500'
    }
  ]

  const caseStudies = [
    {
      title: 'MetaVerse Pro',
      category: 'NFT Launch',
      stats: '$12M Volume',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80',
      description: '10,000 piece generative art collection sold out in 4 minutes'
    },
    {
      title: 'DeFi Protocol X',
      category: 'Token Launch',
      stats: '$50M TVL',
      image: 'https://images.unsplash.com/photo-1642104704074-907c0698b98d?w=600&q=80',
      description: 'Strategic launch achieving $50M locked value in first week'
    },
    {
      title: 'DAO Collective',
      category: 'DAO Formation',
      stats: '25K Members',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&q=80',
      description: 'Built governance structure attracting 25,000 active participants'
    }
  ]

  const team = [
    {
      name: 'Alex Chen',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      twitter: '#'
    },
    {
      name: 'Sarah Kim',
      role: 'Head of Strategy',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      twitter: '#'
    },
    {
      name: 'Marcus Johnson',
      role: 'Community Lead',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      twitter: '#'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
      twitter: '#'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10"
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <SafeIcon name="hexagon" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">NEXUS</span>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {['Services', 'Cases', 'Team', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {walletConnected ? (
                <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-purple-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">{walletAddress}</span>
                  <button onClick={disconnectWallet} className="text-gray-400 hover:text-white ml-2">
                    <SafeIcon name="x" size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 px-4 py-2 rounded-full text-sm font-medium transition-all"
                >
                  <SafeIcon name="wallet" size={16} />
                  Connect Wallet
                </button>
              )}

              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <SafeIcon name="x" size={24} /> : <SafeIcon name="menu" size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-white/10"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {['Services', 'Cases', 'Team', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block w-full text-left text-gray-400 hover:text-white py-2"
                  >
                    {item}
                  </button>
                ))}
                {!walletConnected && (
                  <button
                    onClick={connectWallet}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-3 rounded-xl w-full justify-center"
                  >
                    <SafeIcon name="wallet" size={18} />
                    Connect Wallet
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 border border-purple-500/20"
            >
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Now accepting Web3 projects</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight">
              <span className="gradient-text">Web3</span> Marketing{' '}
              <span className="block">Reimagined</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              We propel blockchain projects to viral success through strategic NFT launches,
              tokenization campaigns, and DAO community building.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-semibold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow flex items-center justify-center gap-2"
              >
                Start Your Project
                <SafeIcon name="arrow-right" size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('cases')}
                className="w-full sm:w-auto px-8 py-4 glass rounded-full font-semibold text-lg border border-white/10 hover:border-purple-500/30 transition-colors"
              >
                View Case Studies
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {[
              { value: 150, suffix: '+', label: 'Projects Launched' },
              { value: 500, suffix: 'M+', label: 'Total Volume' },
              { value: 50, suffix: '+', label: 'Team Members' },
              { value: 98, suffix: '%', label: 'Success Rate' }
            ].map((stat, idx) => (
              <div key={idx} className="glass rounded-2xl p-6 text-center border border-white/5">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Full-stack Web3 marketing solutions for every stage of your blockchain journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="group glass rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <SafeIcon name={service.icon} size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="cases" className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Success <span className="gradient-text">Stories</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real results from real Web3 projects we have helped scale
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((study, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative glass rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
                      {study.category}
                    </span>
                    <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full">
                      {study.stats}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{study.title}</h3>
                  <p className="text-sm text-gray-400">{study.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              The <span className="gradient-text">Team</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Crypto-native experts with proven track records in Web3 growth
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-4 mx-auto w-32 h-32 md:w-40 md:h-40">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-1">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover border-4 border-slate-950"
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{member.role}</p>
                <a href={member.twitter} className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm">
                  <SafeIcon name="twitter" size={14} />
                  Follow
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                Ready to <span className="gradient-text">Launch?</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Whether you are planning an NFT drop, token launch, or DAO formation,
                we are here to help you navigate the Web3 landscape and achieve viral growth.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <SafeIcon name="mail" size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">hello@nexusweb3.io</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <SafeIcon name="map-pin" size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-medium">Global • Remote First</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 md:p-8 border border-white/10"
            >
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Details</label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Tell us about your Web3 project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : formStatus === 'success' ? (
                    <>
                      <SafeIcon name="check" size={20} />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      Send Message
                      <SafeIcon name="send" size={18} />
                    </>
                  )}
                </button>

                {formStatus === 'error' && (
                  <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <SafeIcon name="hexagon" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold">NEXUS</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm">
                Premium Web3 marketing agency helping blockchain projects achieve viral growth through strategic campaigns and community building.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#services" className="hover:text-white transition-colors">NFT Marketing</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Tokenization</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">DAO Growth</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-purple-500/20 transition-colors">
                  <SafeIcon name="twitter" size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-purple-500/20 transition-colors">
                  <SafeIcon name="github" size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-purple-500/20 transition-colors">
                  <SafeIcon name="linkedin" size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2024 NEXUS Web3 Agency. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default App