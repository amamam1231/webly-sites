import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Wallet,
  Sparkles,
  Flame,
  Zap,
  TrendingUp,
  Users,
  Shield,
  Coins,
  Rocket,
  Gem,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Menu,
  X,
  MessageSquare,
  Send,
  Bot
} from 'lucide-react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// FAQ Data for AI Chat
const FAQ_DATA = [
  {
    question: "What is $aDICKkted?",
    answer: "$aDICKkted is a meme token and NFT collection combining provocative humor with real utility. Holders get exclusive access to NFT mints, staking rewards, and community governance.",
    keywords: ["what", "adickted", "token", "about", "project"]
  },
  {
    question: "How do I buy $aDICK?",
    answer: "You can buy $aDICK on Uniswap (Ethereum) or QuickSwap (Polygon). Connect your wallet, swap ETH/MATIC for $aDICK. Contract address: 0x... (always verify on official channels)",
    keywords: ["buy", "how", "purchase", "swap", "get", "contract"]
  },
  {
    question: "How to mint NFT?",
    answer: "Connect your MetaMask or WalletConnect, ensure you have enough ETH for gas + mint price (0.069 ETH), click 'Mint NFT' button, and confirm the transaction. Max 5 per wallet.",
    keywords: ["mint", "nft", "how", "buy nft", "minting"]
  },
  {
    question: "What are the benefits of holding NFT?",
    answer: "NFT holders receive: 1) Daily $aDICK token airdrops 2) Exclusive Discord access 3) Governance voting rights 4) Whitelist for future drops 5) Staking multipliers",
    keywords: ["benefits", "holder", "utility", "what do i get", "perks"]
  },
  {
    question: "Is it safe?",
    answer: "Yes! Contract is audited by Certik, team is KYC'd with Assure DeFi, and liquidity is locked for 2 years. Always connect via official website only.",
    keywords: ["safe", "security", "audit", "scam", "rug", "legit"]
  }
]

const SITE_CONTEXT = "$aDICKkted is a meme token and NFT project on Ethereum/Polygon. Features include: 4200 unique NFTs, $aDICK ERC-20 token with staking, daily airdrops for holders, and community governance. Mint price 0.069 ETH. Contract audited by Certik."

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Yo! Welcome to $aDICKkted! Ask me about the project, minting, or token. 🚀' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findFAQAnswer = (input) => {
    const lowerInput = input.toLowerCase()
    for (const faq of FAQ_DATA) {
      if (faq.keywords.some(keyword => lowerInput.includes(keyword))) {
        return faq.answer
      }
    }
    return null
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setIsLoading(true)

    // Check FAQ first
    const faqAnswer = findFAQAnswer(userMessage)

    if (faqAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: faqAnswer }])
        setIsLoading(false)
      }, 500)
      return
    }

    // Fallback to API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: SITE_CONTEXT
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { type: 'bot', text: data.response || data.message }])
      } else {
        throw new Error('API failed')
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: "I'm not sure about that. Try asking: What is $aDICKkted? How to mint? Is it safe? Or check our docs!"
      }])
    }

    setIsLoading(false)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <SafeIcon
          name={isOpen ? "x" : "messageSquare"}
          size={24}
          className="text-white"
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <SafeIcon name="bot" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">$aDICK Assistant</h3>
                <p className="text-xs text-white/80">Usually replies instantly</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-purple-600 text-white rounded-br-md'
                      : 'bg-slate-800 text-slate-200 rounded-bl-md border border-slate-700'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-md border border-slate-700">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about $aDICK..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-xl transition-colors"
                >
                  <SafeIcon name="send" size={18} className="text-white" />
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
  const [mintCount, setMintCount] = useState(1)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Contract address (placeholder)
  const CONTRACT_ADDRESS = '0x1234...5678'

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Mock wallet connect
  const connectWallet = () => {
    setWalletConnected(true)
    setWalletAddress('0x71C...9A2B')
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress('')
  }

  // Scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
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

  // NFT Gallery Data
  const nfts = [
    { id: 1, name: "Degen DICK #001", price: "0.069 ETH", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop", rarity: "Legendary" },
    { id: 2, name: "Diamond Hands #042", price: "0.069 ETH", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop", rarity: "Epic" },
    { id: 3, name: "Moon Boy #069", price: "0.069 ETH", image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop", rarity: "Rare" },
    { id: 4, name: "WAGMI Warrior #420", price: "0.069 ETH", image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400&h=400&fit=crop", rarity: "Common" },
    { id: 5, name: "HODL Hero #1337", price: "0.069 ETH", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop", rarity: "Epic" },
    { id: 6, name: "FOMO King #6969", price: "0.069 ETH", image: "https://images.unsplash.com/photo-1644361566696-3d442b5b482a?w=400&h=400&fit=crop", rarity: "Legendary" }
  ]

  // Stats data
  const stats = [
    { label: "Total Supply", value: "4,200", icon: "gem" },
    { label: "Floor Price", value: "0.69 ETH", icon: "trendingUp" },
    { label: "Unique Holders", value: "1,337", icon: "users" },
    { label: "Volume Traded", value: "420 ETH", icon: "coins" }
  ]

  return (
    <div className="min-h-screen bg-slate-950 bg-mesh">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-purple-500/20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center font-black text-xl">
                $
              </div>
              <span className="font-black text-xl md:text-2xl tracking-tight">
                a<span className="text-purple-400">DICK</span>kted
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {['Mint', 'Gallery', 'Tokenomics', 'Roadmap'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-slate-400 hover:text-white transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Wallet Button */}
            <div className="flex items-center gap-4">
              {walletConnected ? (
                <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 border border-purple-500/30 rounded-xl px-4 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-mono text-sm">{walletAddress}</span>
                  <button
                    onClick={disconnectWallet}
                    className="text-slate-400 hover:text-white"
                  >
                    <SafeIcon name="x" size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  <SafeIcon name="wallet" size={18} />
                  Connect Wallet
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                <SafeIcon name={mobileMenuOpen ? "x" : "menu"} size={24} />
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
              className="md:hidden bg-slate-900/95 border-t border-purple-500/20"
            >
              <div className="px-4 py-6 space-y-4">
                {['Mint', 'Gallery', 'Tokenomics', 'Roadmap'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block w-full text-left text-lg font-medium text-slate-300 hover:text-white py-2"
                  >
                    {item}
                  </button>
                ))}
                {!walletConnected && (
                  <button
                    onClick={connectWallet}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-semibold mt-4"
                  >
                    <SafeIcon name="wallet" size={18} />
                    Connect Wallet
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="mint" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2">
                <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-sm font-medium text-purple-300">Mint is Live on Ethereum</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter"
              >
                GET <span className="text-gradient">aDICK</span>KTED
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed"
              >
                The most addictive NFT collection on the blockchain. 4,200 unique degenerates staking their way to financial freedom.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollToSection('gallery')}
                  className="flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-white/10"
                >
                  <SafeIcon name="sparkles" size={20} />
                  Mint Now
                </button>
                <button
                  onClick={() => scrollToSection('tokenomics')}
                  className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
                >
                  <SafeIcon name="arrowRight" size={20} />
                  Learn More
                </button>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-slate-950" />
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  <span className="text-white font-bold">1,337</span> addicts already minted
                </p>
              </motion.div>
            </motion.div>

            {/* Right Content - Mint Card */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-30" />
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Public Mint</h3>
                    <p className="text-slate-400">Max 5 per wallet</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  Live
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl">
                    <span className="text-slate-400">Price</span>
                    <span className="text-xl font-bold">0.069 ETH</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <span className="text-slate-400">Quantity</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setMintCount(Math.max(1, mintCount - 1))}
                        className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-xl w-8 text-center">{mintCount}</span>
                      <button
                        onClick={() => setMintCount(Math.min(5, mintCount + 1))}
                        className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <span className="text-purple-300">Total</span>
                    <span className="text-2xl font-black text-purple-400">{(0.069 * mintCount).toFixed(3)} ETH</span>
                  </div>

                  <button
                    onClick={walletConnected ? undefined : connectWallet}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/25"
                  >
                    {walletConnected ? 'Mint NFT' : 'Connect Wallet to Mint'}
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    Gas fees estimated at ~0.002 ETH
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 bg-slate-900/50 border border-slate-800 rounded-2xl"
              >
                <SafeIcon name={stat.icon} size={24} className="mx-auto mb-3 text-purple-400" />
                <p className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">The <span className="text-gradient">Collection</span></h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              4,200 unique degenerates living on the Ethereum blockchain. Each NFT grants access to exclusive $aDICK rewards.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {nfts.map((nft) => (
              <motion.div
                key={nft.id}
                variants={fadeInUp}
                className="group relative bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                    {nft.rarity}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{nft.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Current Price</span>
                    <span className="font-bold text-purple-400">{nft.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              View Full Collection on OpenSea
              <SafeIcon name="externalLink" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-20 md:py-32 bg-slate-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">$aDICK <span className="text-gradient">Tokenomics</span></h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              The governance and utility token of the ecosystem. Stake your NFTs to earn passive $aDICK income.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Token Distribution</h3>
              <div className="space-y-4">
                {[
                  { label: "Public Sale", value: 40, color: "bg-purple-600" },
                  { label: "NFT Staking Rewards", value: 25, color: "bg-pink-600" },
                  { label: "Liquidity Pool", value: 20, color: "bg-blue-600" },
                  { label: "Team & Development", value: 15, color: "bg-slate-600" }
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-bold">{item.value}%</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Token Details</h3>
              <div className="space-y-4">
                {[
                  { label: "Token Name", value: "$aDICKkted" },
                  { label: "Symbol", value: "aDICK" },
                  { label: "Total Supply", value: "69,000,000" },
                  { label: "Blockchain", value: "Ethereum (ERC-20)" },
                  { label: "Tax", value: "5% (3% rewards, 2% LP)" }
                ].map((detail) => (
                  <div key={detail.label} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
                    <span className="text-slate-400">{detail.label}</span>
                    <span className="font-semibold">{detail.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-300">Contract Address</span>
                  <button
                    onClick={copyAddress}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <SafeIcon name={copied ? "checkCircle2" : "copy"} size={16} />
                  </button>
                </div>
                <code className="text-xs font-mono text-slate-400 break-all">
                  0x1234567890abcdef1234567890abcdef12345678
                </code>
              </div>
            </motion.div>
          </div>

          {/* Staking Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Common", apy: "420%", icon: "flame", color: "from-slate-600 to-slate-500" },
              { title: "Rare", apy: "690%", icon: "zap", color: "from-purple-600 to-blue-600" },
              { title: "Legendary", apy: "1337%", icon: "crown", color: "from-pink-600 to-purple-600" }
            ].map((tier) => (
              <motion.div
                key={tier.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 rounded-2xl p-6 transition-all hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center mb-4`}>
                  <SafeIcon name={tier.icon === "crown" ? "gem" : tier.icon} size={24} className="text-white" />
                </div>
                <h4 className="font-bold text-lg mb-1">{tier.title} NFTs</h4>
                <p className="text-3xl font-black text-gradient mb-2">{tier.apy} APY</p>
                <p className="text-sm text-slate-400">Stake to earn $aDICK daily</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">Road<span className="text-gradient">map</span></h2>
            <p className="text-lg text-slate-400">Our journey to meme coin dominance</p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-pink-600 to-purple-600 md:-translate-x-1/2" />

            {[
              { phase: "Phase 1", title: "The Addiction Begins", status: "completed", items: ["Smart Contract Development", "Website Launch", "Community Building", "1,000 Minted"] },
              { phase: "Phase 2", title: "Token Launch", status: "active", items: ["$aDICK Token Launch", "Uniswap Listing", "NFT Staking Live", "CoinGecko/CMC"] },
              { phase: "Phase 3", title: "Metaverse Expansion", status: "upcoming", items: ["3D Avatar Collection", "Metaverse Integration", "DAO Governance", "Major CEX"] },
              { phase: "Phase 4", title: "Global Domination", status: "upcoming", items: ["Merch Store", "Mobile App", "IRL Events", "To The Moon 🚀"] }
            ].map((phase, idx) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-start gap-8 mb-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="flex-1 md:text-right hidden md:block" />

                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-purple-600 rounded-full border-4 border-slate-950 md:-translate-x-1/2 z-10 shadow-lg shadow-purple-600/50" />

                <div className="flex-1 ml-12 md:ml-0">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                    phase.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    phase.status === 'active' ? 'bg-purple-500/20 text-purple-400 animate-pulse' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {phase.status === 'completed' && <SafeIcon name="checkCircle2" size={12} />}
                    {phase.phase}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-400 text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          phase.status === 'completed' ? 'bg-green-500' :
                          phase.status === 'active' ? 'bg-purple-500' :
                          'bg-slate-600'
                        }`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to get <span className="text-gradient">Addicted?</span></h2>
            <p className="text-lg text-slate-400 mb-8">
              Join 1,337+ degenerates in the most addictive community on the blockchain. Mint your NFT now and start earning $aDICK.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('mint')}
                className="flex items-center justify-center gap-2 bg-white text-slate-950 hover:bg-slate-200 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-white/10"
              >
                <SafeIcon name="rocket" size={20} />
                Mint Now
              </button>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                <SafeIcon name="externalLink" size={20} />
                Join Community
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 pb-24 md:pb-12">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center font-black">
                $
              </div>
              <span className="font-black text-xl">a<span className="text-purple-400">DICK</span>kted</span>
            </div>

            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">OpenSea</a>
              <a href="#" className="hover:text-white transition-colors">Etherscan</a>
            </div>

            <p className="text-sm text-slate-500">
              © 2024 aDICKkted. Not financial advice. DYOR.
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default App