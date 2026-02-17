// === IMPORTS ===
import { SafeIcon } from './components/SafeIcon';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

// Bitcoin SVG Icon Component
const BitcoinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.52 2.1c-.347-.087-.7-.167-1.05-.247l.53-2.12-1.32-.33-.54 2.15c-.285-.065-.565-.13-.84-.2l-1.815-.45-.35 1.406s.975.224.955.238c.535.136.63.486.615.766l-.617 2.473c.037.01.085.025.138.048l-.14-.035-.865 3.47c-.066.164-.234.41-.61.316.014.02-.956-.238-.956-.238L8.1 17.5l1.71.426c.318.08.63.164.935.243l-.545 2.19 1.32.33.54-2.16c.36.1.705.19 1.045.27l-.54 2.14 1.32.33.545-2.18c2.24.424 3.926.252 4.635-1.77.57-1.63-.025-2.57-1.21-3.18.86-.2 1.508-.77 1.68-1.95h.01zm-3.01 4.25c-.405 1.63-3.145.75-4.035.53l.72-2.89c.89.22 3.74.66 3.315 2.36zm.405-4.24c-.37 1.48-2.645.73-3.385.55l.654-2.64c.74.18 3.115.52 2.73 2.09z" fill="currentColor"/>
  </svg>
);

// Ethereum SVG Icon Component
const EthereumIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.925 23.96l-9.819-5.797L16 32l9.832-13.837-9.907 5.797z" fill="currentColor" fillOpacity="0.8" />
    <path d="M16 0L6.106 17.467l9.894 5.807 9.907-5.807L16 0zm0 25.03L6.114 19.18 16 32l9.886-12.82-9.886 5.85z" fill="currentColor" />
  </svg>
);

// Gold SVG Icon Component
const GoldIcon = ({ className }) => (
  <img src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-svg-1770689487-6284.svg?" alt="Gold" className={className} />
);

// Solana SVG Icon Component
const SolanaIcon = ({ className }) => (
  <img src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-svg-1770697184-7363.svg?" alt="Solana" className={className} />
);

// Custom Cursor Component
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, textarea, select, .cursor-pointer');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={cn(
        "custom-cursor",
        !isVisible && "opacity-0",
        isHovering && "scaled"
      )}
    />
  );
};

// Particle Wave Component
const ParticleWave = ({ onRipple }) => {
  const canvasRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (canvas.width / particleCount) * i,
        y: canvas.height / 2,
        baseY: canvas.height / 2,
        speed: 0.02 + Math.random() * 0.02,
        amplitude: 20 + Math.random() * 30,
        offset: Math.random() * Math.PI * 2
      });
    }

    const animate = (time) => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw ripples
      setRipples(prev => {
        const updated = prev.map(r => ({ ...r, radius: r.radius + 5, opacity: r.opacity - 0.02 }))
          .filter(r => r.opacity > 0);
        return updated;
      });

      ripples.forEach(ripple => {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 77, 0, ${ripple.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw particles
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      particles.forEach((p, i) => {
        p.y = p.baseY + Math.sin(time * p.speed + p.offset) * p.amplitude;

        if (i === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      });

      ctx.strokeStyle = '#FF4D00';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw glow
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FF4D00';
      ctx.stroke();
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [ripples]);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipples(prev => [...prev, { x, y, radius: 0, opacity: 1 }]);
    onRipple();
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full h-64 md:h-96 cursor-pointer"
    />
  );
};

// Modal Components
const TierSelectionModal = ({ isOpen, onClose, tier }) => {
  if (!isOpen || !tier) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card rounded-2xl p-6 md:p-8 max-w-md w-full border border-[#E5E5E5]/20"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#E5E5E5]">{tier.name} Tier</h3>
            <button onClick={onClose} className="text-[#E5E5E5]/60 hover:text-[#E5E5E5]">
              <SafeIcon name="x" size={24} />
            </button>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-black font-mono text-[#FF4D00]">{tier.apy}</span>
            <span className="font-mono text-sm ml-2 text-[#E5E5E5]/60">APY</span>
          </div>

          <div className="space-y-3 mb-8">
            {tier.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 font-mono text-sm text-[#E5E5E5]/70">
                <SafeIcon name="check" size={16} className="text-[#FF4D00]" />
                {feature}
              </div>
            ))}
          </div>

          <div className="font-mono text-xs text-[#E5E5E5]/40 mb-6">
            Min: {tier.minStake.toLocaleString()} AETH | Max: {tier.maxStake.toLocaleString()} AETH
          </div>

          <button className="w-full py-3 bg-[#FF4D00] text-[#050505] rounded-xl font-mono font-bold hover:bg-[#ff6a2b] transition-colors">
            Confirm Selection
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const TransmuteModal = ({ isOpen, onClose, asset }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen || !asset) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card rounded-2xl p-6 md:p-8 max-w-md w-full border border-[#E5E5E5]/20"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#E5E5E5]">Transmute {asset.symbol}</h3>
            <button onClick={onClose} className="text-[#E5E5E5]/60 hover:text-[#E5E5E5]">
              <SafeIcon name="x" size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
            <asset.icon className={cn("w-10 h-10", asset.color)} />
            <div>
              <div className="font-serif text-lg font-bold">{asset.name}</div>
              <div className="font-mono text-sm text-[#E5E5E5]/60">${asset.price}</div>
            </div>
          </div>

          <div className="mb-6">
            <label className="font-mono text-xs text-[#E5E5E5]/40 mb-2 block">Amount to Transmute</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-[#E5E5E5]/20 rounded-xl px-4 py-3 font-mono text-[#E5E5E5] placeholder-[#E5E5E5]/30 focus:outline-none focus:border-[#FF4D00]/50"
            />
          </div>

          <div className="flex justify-between font-mono text-xs text-[#E5E5E5]/40 mb-6">
            <span>Receive AETH</span>
            <span>{amount ? (parseFloat(amount) * 0.95).toFixed(2) : '0.00'}</span>
          </div>

          <button className="w-full py-3 bg-[#FF4D00] text-[#050505] rounded-xl font-mono font-bold hover:bg-[#ff6a2b] transition-colors">
            Transmute Asset
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// === MAIN APP COMPONENT ===
function App() {
  const [sphereScale, setSphereScale] = useState(1);
  const [distortText, setDistortText] = useState(false);
  const [footerProgress, setFooterProgress] = useState(0);
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [transmuteModalOpen, setTransmuteModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const footerRef = useRef(null);

  // Mouse velocity tracking for sphere
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = now - lastTime;

      if (dt > 50) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const velocity = Math.sqrt(dx * dx + dy * dy) / dt;

        const newScale = Math.min(1.3, 1 + velocity * 0.5);
        setSphereScale(newScale);

        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Footer scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;

      const rect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight) {
        const progress = Math.min(1, (windowHeight - rect.top) / (windowHeight * 0.5));
        setFooterProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRipple = () => {
    setDistortText(true);
    setTimeout(() => setDistortText(false), 300);
  };

  const handleOpenTierModal = (tier) => {
    setSelectedTier(tier);
    setTierModalOpen(true);
  };

  const handleCloseTierModal = () => {
    setTierModalOpen(false);
    setSelectedTier(null);
  };

  const handleOpenTransmuteModal = (asset) => {
    setSelectedAsset(asset);
    setTransmuteModalOpen(true);
  };

  const handleCloseTransmuteModal = () => {
    setTransmuteModalOpen(false);
    setSelectedAsset(null);
  };

  const tiers = [
    {
      name: 'Iron',
      apy: '12.4%',
      minStake: 1000,
      maxStake: 10000,
      features: [
        'Base yield generation',
        'Standard security',
        'Community access',
        'Monthly reports'
      ]
    },
    {
      name: 'Chrome',
      apy: '24.8%',
      minStake: 10000,
      maxStake: 50000,
      features: [
        'Enhanced yield rates',
        'Priority transactions',
        'Advanced analytics',
        '24/7 premium support',
        'Exclusive alpha access'
      ]
    },
    {
      name: 'Flare',
      apy: '42.0%',
      minStake: 50000,
      maxStake: 100000,
      features: [
        'Maximum yield generation',
        'Zero transaction fees',
        'Governance rights',
        'Private concierge',
        'Early protocol features',
        'Direct team access'
      ]
    }
  ];

  const assets = [
    { symbol: 'GOLD', name: 'Digital Gold', price: '2,847.32', icon: GoldIcon, color: 'text-yellow-500' },
    { symbol: 'BTC', name: 'Bitcoin', price: '97,245.00', icon: BitcoinIcon, color: 'text-orange-500' },
    { symbol: 'ETH', name: 'Ethereum', price: '3,847.50', icon: EthereumIcon, color: 'text-blue-400' },
  ];

  const features = [
    {
      title: 'Instant Transmutation',
      subtitle: 'Exchange',
      description: 'Convert any asset to AETH in milliseconds with zero slippage protection.',
      icon: 'zap'
    },
    {
      title: 'Neural Security',
      subtitle: 'Protection',
      description: 'AI-powered threat detection monitors your assets 24/7 across all chains.',
      icon: 'shield'
    },
    {
      title: 'Infinite Yield',
      subtitle: 'Staking',
      description: 'Auto-compounding rewards with dynamic rebalancing for maximum returns.',
      icon: 'trending-up'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] overflow-x-hidden">
      <CustomCursor />

      <div className="grainy-noise" />

      {/* Section 1: Hero - The Singularity */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] pointer-events-none" />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: sphereScale, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full mercury-sphere mx-auto mb-8 md:mb-12"
          />

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 md:mb-6"
          >
            WEALTH IN CONSTANT
            <span className="block text-[#FF4D00]">MOTION</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-sm md:text-base text-[#E5E5E5]/60 max-w-xl mx-auto mb-8"
          >
            The Aether Protocol transforms static assets into liquid opportunities through quantum-grade financial engineering.
          </motion.p>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-[#FF4D00] text-[#050505] font-mono font-bold rounded-full hover:bg-[#ff6a2b] transition-colors flex items-center gap-2 mx-auto"
          >
            <SafeIcon name="play" size={18} />
            ENTER PROTOCOL
          </motion.button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <SafeIcon name="chevron-down" size={24} className="text-[#E5E5E5]/40" />
        </div>
      </section>

      {/* Section 2: Ticker - The Velocity Tape */}
      <section className="py-4 md:py-6 border-y border-[#E5E5E5]/10 overflow-hidden bg-[#050505]/50 backdrop-blur-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 md:gap-16 px-4 md:px-8">
              <span className="font-mono text-xs md:text-sm text-[#E5E5E5]/40">TVL: <span className="text-[#FF4D00]">$2.4B</span></span>
              <span className="font-mono text-xs md:text-sm text-[#E5E5E5]/40">AETHER_STABLE: <span className="text-[#E5E5E5]">1.002</span></span>
              <span className="font-mono text-xs md:text-sm text-[#E5E5E5]/40">24H VOL: <span className="text-[#FF4D00]">$847M</span></span>
              <span className="font-mono text-xs md:text-sm text-[#E5E5E5]/40">PROTOCOL_REVENUE: <span className="text-[#E5E5E5]">$2.1M</span></span>
              <span className="font-mono text-xs md:text-sm text-[#E5E5E5]/40">ACTIVE_VALIDATORS: <span className="text-[#FF4D00]">14,847</span></span>
              <span className="font-mono text-xs md:text-sm text-[#E5E5E5]/40">BLOCK_TIME: <span className="text-[#E5E5E5]">2.1s</span></span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Bento Features - The Alchemical Triad */}
      <section className="py-20 md:py-32 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">The Alchemical Triad</h2>
            <p className="font-mono text-sm text-[#E5E5E5]/40">Three pillars of financial transformation</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative card-gradient-border rounded-2xl p-6 md:p-8 overflow-hidden"
              >
                <div className="blueprint-overlay absolute inset-0" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#FF4D00]/10 border border-[#FF4D00]/30 flex items-center justify-center mb-6 group-hover:bg-[#FF4D00]/20 transition-colors">
                    <SafeIcon name={feature.icon} size={24} className="text-[#FF4D00]" />
                  </div>

                  <div className="font-mono text-xs text-[#E5E5E5]/40 mb-2 uppercase tracking-widest">
                    {feature.subtitle}
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold mb-3 group-hover:text-[#FF4D00] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="font-mono text-sm text-[#E5E5E5]/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: The Forge - Interactive Asset Melt */}
      <section className="py-20 md:py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">The Forge</h2>
            <p className="font-mono text-sm text-[#E5E5E5]/40">Hard assets turned into liquid opportunities</p>
          </motion.div>

          <div className="space-y-4">
            {assets.map((asset, index) => (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleOpenTransmuteModal(asset)}
                className="group card-gradient-border rounded-xl p-4 md:p-6 flex items-center justify-between cursor-pointer transition-all hover:border-[#FF4D00]/50"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500">
                    <asset.icon className={cn("w-8 h-8 md:w-10 md:h-10", asset.color)} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-bold group-hover:text-[#FF4D00] transition-colors">
                      {asset.symbol}
                    </h3>
                    <p className="font-mono text-xs md:text-sm text-[#E5E5E5]/40">{asset.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-lg md:text-2xl font-bold text-[#E5E5E5]">
                    ${asset.price}
                  </div>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <span className="font-mono text-xs text-[#E5E5E5]/40">Available for transmutation</span>
                    <SafeIcon name="arrow-right" size={14} className="text-[#FF4D00] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: The Pulse - Heartbeat of the Protocol */}
      <section className="py-20 md:py-32 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        <div className={cn("max-w-7xl mx-auto text-center transition-transform duration-300", distortText && "scale-y-110 skew-x-2")}>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-bold mb-4"
          >
            The Pulse
          </motion.h2>
          <p className="font-mono text-sm text-[#E5E5E5]/40 mb-12">Heartbeat of the Protocol</p>
        </div>

        <ParticleWave onRipple={handleRipple} />

        <p className="text-center font-mono text-xs text-[#E5E5E5]/30 mt-4">
          Click anywhere on the wave to create ripples
        </p>
      </section>

      {/* Section 6: The Vault Tiers - Membership Evolution */}
      <section className="py-20 md:py-32 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16 text-center"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Membership Evolution</h2>
            <p className="font-mono text-sm text-[#E5E5E5]/40">Choose your tier in the new financial order</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                onClick={() => handleOpenTierModal(tier)}
                className={cn(
                  "group relative rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-500 card-3d",
                  tier.name === 'Chrome' ? "card-chrome" : "glass-card",
                  tier.name === 'Iron' && "border-gray-600",
                  tier.name === 'Flare' && "border-[#FF4D00]"
                )}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <div className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  tier.name === 'Chrome' ? "bg-gradient-to-br from-white/20 to-gray-400/20" : "bg-gradient-to-br from-[#FF4D00]/10 to-transparent"
                )} />

                <div className="relative z-10">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border-2",
                    tier.name === 'Chrome' ? "border-gray-400 bg-gradient-to-br from-gray-200 to-gray-400" :
                    tier.name === 'Flare' ? "border-[#FF4D00] bg-[#FF4D00]/10" :
                    "border-gray-600 bg-gray-800"
                  )}>
                    <SafeIcon
                      name={tier.name === 'Flare' ? "flame" : tier.name === 'Chrome' ? "hexagon" : "shield"}
                      size={32}
                      className={tier.name === 'Chrome' ? "text-gray-900" : tier.name === 'Flare' ? "text-[#FF4D00]" : "text-gray-400"}
                    />
                  </div>

                  <h3 className={cn(
                    "font-serif text-2xl md:text-3xl font-bold mb-2",
                    tier.name === 'Chrome' ? "text-gray-900" : "text-white"
                  )}>
                    {tier.name}
                  </h3>

                  <div className="mb-6">
                    <span className={cn(
                      "text-4xl md:text-5xl font-black font-mono",
                      tier.name === 'Chrome' ? "text-gray-900" : "text-[#FF4D00]"
                    )}>
                      {tier.apy}
                    </span>
                    <span className={cn(
                      "font-mono text-sm ml-2",
                      tier.name === 'Chrome' ? "text-gray-700" : "text-[#E5E5E5]/60"
                    )}>APY</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className={cn(
                        "flex items-center gap-3 font-mono text-xs md:text-sm",
                        tier.name === 'Chrome' ? "text-gray-800" : "text-[#E5E5E5]/70"
                      )}>
                        <SafeIcon name="check" size={16} className={tier.name === 'Chrome' ? "text-gray-600" : "text-[#FF4D00]"} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className={cn(
                    "w-full py-3 rounded-xl font-mono font-bold transition-all",
                    tier.name === 'Chrome'
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-[#FF4D00] text-[#050505] hover:bg-[#ff6a2b]"
                  )}>
                    Select {tier.name}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Footer - The Core Integration */}
      <section
        ref={footerRef}
        className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
        style={{
          background: `linear-gradient(to top, #FF4D00 0%, #050505 ${Math.max(0, 100 - footerProgress * 200)}%)`
        }}
      >
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif text-5xl md:text-7xl lg:text-9xl font-black mb-8 tracking-tighter"
          >
            JACK INTO
            <span className="block text-[#050505] mix-blend-screen">AETHER</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-mono text-sm md:text-base text-[#050505]/80 mb-12 max-w-xl mx-auto"
          >
            The protocol awaits. Transform your assets. Join the singularity.
          </motion.p>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-[#050505] text-[#FF4D00] font-mono font-bold rounded-full hover:bg-[#0a0a0a] transition-colors text-lg flex items-center gap-3 mx-auto border-2 border-[#050505]"
          >
            <SafeIcon name="plug" size={24} />
            CONNECT WALLET
          </motion.button>
        </div>

        <div className="absolute bottom-8 left-0 right-0 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-[#050505]/60">
            <div className="flex items-center gap-6">
              <span>© 2024 AETHER PROTOCOL</span>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:text-[#050505] transition-colors">DOCS</a>
              <a href="#" className="hover:text-[#050505] transition-colors">AUDIT</a>
              <a href="#" className="hover:text-[#050505] transition-colors">GOVERNANCE</a>
            </div>
            <div className="flex items-center gap-4">
              <SafeIcon name="twitter" size={18} className="cursor-pointer hover:text-[#050505] transition-colors" />
              <SafeIcon name="github" size={18} className="cursor-pointer hover:text-[#050505] transition-colors" />
              <SafeIcon name="message-circle" size={18} className="cursor-pointer hover:text-[#050505] transition-colors" />
            </div>
          </div>
        </div>
      </section>

      <TierSelectionModal
        isOpen={tierModalOpen}
        onClose={handleCloseTierModal}
        tier={selectedTier}
      />

      <TransmuteModal
        isOpen={transmuteModalOpen}
        onClose={handleCloseTransmuteModal}
        asset={selectedAsset}
      />
    </div>
  );
}

export default App;