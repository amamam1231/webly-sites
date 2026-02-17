import { SafeIcon } from './components/SafeIcon';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Ethereum SVG Icon Component
const EthereumIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.925 23.96l-9.819-5.797L16 32l9.832-13.837-9.907 5.797z" fill="currentColor" fillOpacity="0.8" />
    <path d="M16 0L6.106 17.467l9.894 5.807 9.907-5.807L16 0zm0 25.03L6.114 19.18 16 32l9.886-12.82-9.886 5.85z" fill="currentColor" />
  </svg>
);

// Gold SVG Icon Component - Using user provided SVG with updated URL
const GoldIcon = ({ className }) => (
  <img src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-svg-1770689487-6284.svg?" alt="Gold" className={className} />
);

// Solana SVG Icon Component - Using user provided SVG with NEW URL
const SolanaIcon = ({ className }) => (
  <img src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-svg-1770697184-7363.svg?" alt="Solana" className={className} />
);

// Custom Cursor Component - ALWAYS WHITE, SCALES ON BUTTONS
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isScaled, setIsScaled] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const isButton = element.closest('button') || element.closest('a') || element.closest('[role="button"]') || element.closest('.cursor-pointer');
        setIsScaled(!!isButton);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={cn("custom-cursor", isScaled && "scaled")} style={{ left: position.x, top: position.y }} />
  );
};

// ENHANCED Tier Selection Modal Component with Chrome Alchemy Design - MOBILE OPTIMIZED
const TierSelectionModal = ({ isOpen, onClose, tier }) => {
  const [amount, setAmount] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !tier) return null;

  const minStake = tier.name === 'Iron' ? 1000 : tier.name === 'Chrome' ? 10000 : 100000;
  const maxStake = minStake * 100;

  const handleStake = async () => {
    if (!agreed || !amount || parseFloat(amount) < minStake) return;

    setIsLoading(true);
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setAmount('');
    setAgreed(false);
    onClose();
  };

  const getTierColor = () => {
    if (tier.name === 'Flare') return 'from-orange-500 via-orange-600 to-orange-700';
    if (tier.name === 'Chrome') return 'from-gray-300 via-gray-400 to-gray-500';
    return 'from-gray-700 via-gray-800 to-gray-900';
  };

  const getTierAccentColor = () => {
    if (tier.name === 'Flare') return '#FF4D00';
    if (tier.name === 'Chrome') return '#E5E5E5';
    return '#525252';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 modal-overlay overflow-hidden"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="relative w-full max-w-lg max-h-[85vh] md:max-h-[90vh] overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chrome border glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D00] via-transparent to-[#E5E5E5] opacity-20 blur-xl" />

            <div className={cn(
              "relative glass-card rounded-2xl p-3 md:p-8 border-2 overflow-y-auto max-h-[85vh] md:max-h-[90vh]",
              tier.name === 'Chrome' ? "border-[#E5E5E5]/30" : "border-[#FF4D00]/30"
            )}>
              {/* Animated background gradient */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-10",
                getTierColor()
              )} />

              {/* Close button */}
              <button


/* ... TRUNCATED ... */

r hide/show
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        // Scrolling down - hide header
        setHidden(true);
      } else {
        // Scrolling up - show header
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent",
      scrolled ? "bg-[#050505]/90 backdrop-blur-md border-[#E5E5E5]/10" : "bg-transparent",
      hidden ? "-translate-y-full" : "translate-y-0"
    )}>
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <span className="font-serif text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <SafeIcon name="hexagon" size={24} className="text-[#FF4D00]" /> AETHER
        </span>

        <div className="hidden md:flex items-center gap-8">
          {['Triad', 'Vault', 'Forge', 'Pulse', 'FAQ'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="font-mono text-sm text-[#E5E5E5]/60 hover:text-[#FF4D00] transition-colors tracking-wider flex items-center gap-1"
            >
              <SafeIcon name="chevron-right" size={12} /> {item.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={onLaunchAppClick}
          className="bg-[#FF4D00] hover:bg-[#ff6a2b] text-[#050505] px-6 py-2 rounded-full font-mono font-bold text-sm transition-all flex items-center gap-2"
        >
          <SafeIcon name="rocket" size={16} /> Launch App
        </button>
      </div>
    </nav>
  );
};

// Main App Component
function App() {
  const [transmuteModalOpen, setTransmuteModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const handleTransmuteClick = (asset) => {
    setSelectedAsset(asset);
    setTransmuteModalOpen(true);
  };

  const handleCloseTransmuteModal = () => {
    setTransmuteModalOpen(false);
    setSelectedAsset(null);
  };

  const handleLaunchAppClick = () => {
    setAppModalOpen(true);
  };

  const handleCloseAppModal = () => {
    setAppModalOpen(false);
  };

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    setTierModalOpen(true);
  };

  const handleCloseTierModal = () => {
    setTierModalOpen(false);
    setSelectedTier(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] overflow-x-hidden">
      <CustomCursor />
      <div className="grainy-noise" />

      <Navigation onLaunchAppClick={handleLaunchAppClick} />

      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        <MercurySphere />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center px-4"
        >
          <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
            WEALTH IN <span className="text-white">CONSTANT</span><br /> MOTION
          </h1>
          <p className="font-mono text-[#E5E5E5]/80 text-base md:text-lg lg:text-xl max-w-2xl mx-auto mt-8 drop-shadow-lg px-4">
            The Singularity. A protocol manifesting liquid chrome alchemy into decentralized finance.
          </p>
        </motion.div>
      </section>

      <Ticker />

      <section id="triad">
        <BentoFeatures />
      </section>

      <section id="vault">
        <AlchemicalVault onTransmuteClick={handleTransmuteClick} />
      </section>

      <section id="forge">
        <Forge />
      </section>

      <section id="pulse">
        <Pulse />
      </section>

      <section id="tiers">
        <VaultTiers onSelectTier={handleSelectTier} />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <Footer />

      {/* Modals */}
      <TransmuteModal
        isOpen={transmuteModalOpen}
        onClose={handleCloseTransmuteModal}
        asset={selectedAsset}
      />
      <AppComingSoonModal
        isOpen={appModalOpen}
        onClose={handleCloseAppModal}
      />
      <TierSelectionModal
        isOpen={tierModalOpen}
        onClose={handleCloseTierModal}
        tier={selectedTier}
      />
    </div>
  );
}

export default App;