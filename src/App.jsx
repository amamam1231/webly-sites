import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

// Hexagon background component
const HexagonGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
          <polygon fill="none" stroke="currentColor" strokeWidth="0.5" points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)"/>
    </svg>
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]"/>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]"/>
  </div>
)

// Animated section wrapper
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
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

// Yield Calculator Component
const YieldCalculator = () => {
  const [amount, setAmount] = useState(1000)
  const [duration, setDuration] = useState(12)
  const [apy, setApy] = useState(12.5)

  const calculateYield = () => {
    const dailyRate = apy / 365 / 100
    const days = duration * 30
    const finalAmount = amount * Math.pow(1 + dailyRate, days)
    return {
      final: finalAmount.toFixed(2),
      profit: (finalAmount - amount).toFixed(2)
    }
  }

  const result = calculateYield()

  return (
    <div className="glass rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
          <SafeIcon name="calculator" size={20} className="text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Yield Calculator</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Investment Amount (ETH)</label>
          <input
            type="range"
            min="0.1"
            max="100"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-500">0.1 ETH</span>
            <span className="text-cyan-400 font-mono font-semibold">{amount} ETH</span>
            <span className="text-gray-500">100 ETH</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-2 block">Duration (Months)</label>
          <input
            type="range"
            min="1"
            max="24"
            step="1"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-500">1 month</span>
            <span className="text-purple-400 font-mono font-semibold">{duration} months</span>
            <span className="text-gray-500">24 months</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          <div className="text-center p-4 rounded-xl bg-gray-900/50">
            <p className="text-sm text-gray-400 mb-1">Final Amount</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono">{result.final} ETH</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-900/50">
            <p className="text-sm text-gray-400 mb-1">Profit</p>
            <p className="text-2xl font-bold text-cyan-400 font-mono">+{result.profit} ETH</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Blockchain Map Visualization
const BlockchainMap = () => {
  const nodes = [
    { id: 1, x: 20, y: 30, size: 8, pulse: true },
    { id: 2, x: 40, y: 20, size: 6, pulse: false },
    { id: 3, x: 60, y: 40, size: 10, pulse: true },
    { id: 4, x: 80, y: 25, size: 7, pulse: false },
    { id: 5, x: 30, y: 60, size: 5, pulse: false },
    { id: 6, x: 70, y: 70, size: 9, pulse: true },
    { id: 7, x: 50, y: 50, size: 12, pulse: true },
  ]

  const connections = [
    { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
    { from: 1, to: 5 }, { from: 5, to: 7 }, { from: 7, to: 6 },
    { from: 3, to: 7 }, { from: 2, to: 7 }, { from: 4, to: 6 }
  ]

  return (
    <div className="relative w-full h-80 md:h-96 glass rounded-2xl overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50"/>

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Connection lines */}
        {connections.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === conn.from)
          const toNode = nodes.find(n => n.id === conn.to)
          return (
            <motion.line
              key={i}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="rgba(6, 182, 212, 0.3)"
              strokeWidth="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatDelay: 3 }}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.g key={node.id}>
            {node.pulse && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size * 0.8}
                fill="none"
                stroke="rgba(6, 182, 212, 0.5)"
                strokeWidth="0.5"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size * 0.4}
              fill={node.pulse ? "#06b6d4" : "#a855f7"}
              className="drop-shadow-lg"
            />
          </motion.g>
        ))}
      </svg>

      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-gray-400">
        <SafeIcon name="activity" size={14} className="text-cyan-400" />
        <span className="font-mono">Live Network Activity</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
      </div>

      <div className="absolute top-4 right-4 text-right">
        <p className="text-2xl font-bold text-white font-mono">2.4M</p>
        <p className="text-xs text-gray-400">Active Nodes</p>
      </div>
    </div>
  )
}

// Feature Card
const FeatureCard = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    variants={fadeInUp}
    className="glass glass-hover rounded-2xl p-6 group"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
      <SafeIcon name={icon} size={24} className="text-cyan-400" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
)

// Step Card for Onboarding
const StepCard = ({ number, title, description }) => (
  <div className="relative flex gap-6">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold font-mono">
        {number}
      </div>
      {number < 4 && <div className="w-px h-full bg-gradient-to-b from-cyan-500/50 to-transparent mt-2"/>}
    </div>
    <div className="pb-8">
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
)

// Testimonial Card
const TestimonialCard = ({ quote, author, role, delay = 0 }) => (
  <motion.div
    variants={fadeInUp}
    className="glass rounded-2xl p-6 relative"
  >
    <SafeIcon name="quote" size={32} className="text-cyan-500/20 absolute top-4 right-4" />
    <p className="text-gray-300 text-sm leading-relaxed mb-4 relative z-10">{quote}</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
        {author[0]}
      </div>
      <div>
        <p className="text-white font-medium text-sm">{author}</p>
        <p className="text-gray-500 text-xs">{role}</p>
      </div>
    </div>
  </motion.div>
)

// Tokenomics Item
const TokenomicsItem = ({ label, percentage, color, delay = 0 }) => (
  <motion.div variants={fadeInUp} className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-300">{label}</span>
      <span className="text-white font-mono">{percentage}%</span>
    </div>
    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        transition={{ duration: 1, delay: delay * 0.1, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  </motion.div>
)

function App() {
  const [settings, setSettings] = useState({})
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Fetch settings from API
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
      <HexagonGrid />

      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-gray-950/80 backdrop-blur-xl border-gray-800/50 py-3" : "bg-transparent border-transparent py-5"
      )}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 hexagon bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <SafeIcon name="hexagon" size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">NEXUS</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Connect', 'Calculator', 'Tokenomics'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          <button className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all flex items-center gap-2">
            <SafeIcon name="wallet" size={16} />
            <span className="hidden sm:inline">Connect Wallet</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"/>
              Live on Ethereum Mainnet
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
              The Future of
              <span className="block neon-text">DeFi Yield</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {settings.protocol_description || "Nexus Protocol delivers institutional-grade yield optimization through algorithmic strategies and cross-chain liquidity aggregation."}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group">
                Launch App
                <SafeIcon name="arrow-right" size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl glass glass-hover text-white font-semibold flex items-center justify-center gap-2">
                <SafeIcon name="book-open" size={18} />
                Documentation
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {[
                { value: settings.apy_rate || "12.5%", label: "Current APY" },
                { value: settings.tvl_amount || "$48M", label: "Total Value Locked" },
                { value: "2.4M", label: "Active Users" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white font-mono">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Protocol <span className="neon-text">Advantages</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Advanced algorithms and cross-chain infrastructure delivering superior risk-adjusted returns.</p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <FeatureCard
              icon="shield-check"
              title="Non-Custodial Security"
              description="Your assets remain in your control. Smart contracts audited by Trail of Bits and OpenZeppelin."
            />
            <FeatureCard
              icon="zap"
              title="Auto-Compounding"
              description="Yield is automatically reinvested every 4 hours, maximizing your returns through compound interest."
            />
            <FeatureCard
              icon="globe"
              title="Cross-Chain Liquidity"
              description="Access liquidity across 12+ chains through our unified interface and bridge infrastructure."
            />
            <FeatureCard
              icon="trending-up"
              title="Dynamic Strategies"
              description="AI-powered strategy selection allocates capital to the highest-yielding opportunities in real-time."
            />
            <FeatureCard
              icon="lock"
              title="Insurance Coverage"
              description="Optional Nexus Mutual integration provides coverage against smart contract risks."
            />
            <FeatureCard
              icon="cpu"
              title="Gas Optimization"
              description="Batch transactions and meta-transactions reduce gas costs by up to 70%."
            />
          </motion.div>
        </div>
      </section>

      {/* Onboarding Section */}
      <section id="connect" className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
                Get Started in
                <span className="block neon-text">Minutes</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Connect your wallet and start earning optimized yield immediately. No KYC required.
              </p>

              <div className="space-y-0">
                <StepCard
                  number={1}
                  title="Connect Your Wallet"
                  description="Support for MetaMask, WalletConnect, Coinbase Wallet, and 20+ providers."
                />
                <StepCard
                  number={2}
                  title="Select Strategy"
                  description="Choose from conservative, balanced, or aggressive yield strategies based on your risk profile."
                />
                <StepCard
                  number={3}
                  title="Deposit Assets"
                  description="Deposit ETH, USDC, USDT, or DAI. Minimum deposit: 0.01 ETH or equivalent."
                />
                <StepCard
                  number={4}
                  title="Start Earning"
                  description="Yield begins accruing immediately. Track your earnings in real-time on the dashboard."
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <BlockchainMap />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Yield <span className="neon-text">Calculator</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Project your returns based on current protocol performance.</p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <YieldCalculator />
          </AnimatedSection>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Token <span className="neon-text">Distribution</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Fair launch with long-term alignment between protocol and community.</p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-6"
              >
                <TokenomicsItem label="Community & Liquidity Mining" percentage={40} color="bg-cyan-500" delay={0} />
                <TokenomicsItem label="Team & Advisors" percentage={20} color="bg-purple-500" delay={1} />
                <TokenomicsItem label="Treasury & Ecosystem" percentage={25} color="bg-emerald-500" delay={2} />
                <TokenomicsItem label="Private Sale" percentage={10} color="bg-amber-500" delay={3} />
                <TokenomicsItem label="Public Sale" percentage={5} color="bg-rose-500" delay={4} />
              </motion.div>

              <div className="mt-8 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Supply</span>
                  <span className="text-white font-mono font-semibold">100,000,000 NEX</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">Circulating Supply</span>
                  <span className="text-white font-mono font-semibold">45,000,000 NEX</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="relative">
              <div className="aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-3xl"/>
                <div className="relative glass rounded-3xl p-8 h-full flex flex-col items-center justify-center">
                  <SafeIcon name="coins" size={64} className="text-cyan-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">NEX Token</h3>
                  <p className="text-center text-gray-400 text-sm mb-6">Governance and utility token for the Nexus Protocol ecosystem.</p>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="text-center p-3 rounded-lg bg-gray-900/50">
                      <p className="text-lg font-bold text-white font-mono">$2.45</p>
                      <p className="text-xs text-gray-500">Token Price</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-900/50">
                      <p className="text-lg font-bold text-emerald-400 font-mono">+12.5%</p>
                      <p className="text-xs text-gray-500">24h Change</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              User <span className="neon-text">Reviews</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Trusted by thousands of DeFi users worldwide.</p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <TestimonialCard
              quote="Nexus has completely changed how I approach yield farming. The auto-compounding feature alone saved me hundreds in gas fees."
              author="Alex Chen"
              role="DeFi Analyst"
            />
            <TestimonialCard
              quote="The cross-chain functionality is seamless. I can move liquidity between chains without worrying about bridges or wrapped tokens."
              author="Sarah Williams"
              role="Crypto Investor"
            />
            <TestimonialCard
              quote="Finally, a protocol that takes security seriously. The audit reports are comprehensive and the insurance integration gives peace of mind."
              author="Michael Park"
              role="Institutional Trader"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <AnimatedSection>
            <div className="glass rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-emerald-500/10"/>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
                  Ready to Optimize Your Yield?
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
                  Join thousands of users earning superior risk-adjusted returns on their crypto assets.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2">
                    <SafeIcon name="rocket" size={18} />
                    Launch App
                  </button>
                  <button className="w-full sm:w-auto px-8 py-4 rounded-xl glass glass-hover text-white font-semibold flex items-center justify-center gap-2">
                    <SafeIcon name="message-circle" size={18} />
                    Join Discord
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-900 relative">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 hexagon bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <SafeIcon name="hexagon" size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">NEXUS</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                Institutional-grade DeFi yield optimization. Secure, non-custodial, and cross-chain by design.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Protocol</h4>
              <ul className="space-y-2">
                {['Documentation', 'GitHub', 'Audit Reports', 'Bug Bounty'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 text-sm hover:text-cyan-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                {['Discord', 'Twitter', 'Telegram', 'Governance'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 text-sm hover:text-cyan-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Nexus Protocol. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom padding for mobile Telegram browser */}
      <div className="h-8 md:h-0"/>
    </div>
  )
}

export default App