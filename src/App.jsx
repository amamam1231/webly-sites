// === IMPORTS ===
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

// Gold SVG Icon Component
const GoldIcon = ({ className }) => (
  <img src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-svg-1770689487-6284.svg?" alt="Gold" className={className} />
);

// Solana SVG Icon Component
const SolanaIcon = ({ className }) => (
  <img src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-svg-1770697184-7363.svg?" alt="Solana" className={className} />
);

// Bitcoin Icon Component
const BitcoinIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#F7931A" />
    <path d="M22.7 14.2c0.4-2.6-1.6-4-4.1-4.9l0.8-3.3-2.1-0.5-0.8 3.2c-0.5-0.1-1.1-0.3-1.6-0.4l0.8-3.3-2.1-0.5-0.8 3.3c-0.4-0.1-0.8-0.2-1.2-0.3l0-0-2.9-0.7-0.5 2.2s1.6 0.4 1.6 0.4c0.9 0.2 1.1 0.7 1 1.2l-1 4.1c0.1 0 0.2 0.1 0.3 0.1l-0.3-0.1-1.4 5.7c-0.1 0.3-0.4 0.7-1.1 0.5 0 0-1.6-0.4-1.6-0.4l-0.9 2.1 2.7 0.7c0.5 0.1 1 0.2 1.4 0.3l-0.9 3.4 2.1 0.5 0.8-3.3c0.5 0.1 1.1 0.3 1.6 0.4l-0.8 3.3 2.1 0.5 0.9-3.4c3.3 0.6 5.8-0.4 6.8-3.1 0.8-2.3 0-3.6-1.4-4.4 1-0.2 1.8-0.8 2-2.2zM20.6 18c-0.5 2.1-4.2 1-5.4 0.7l1-4c1.2 0.3 5.1 0.9 4.4 3.3zM21.1 14.1c-0.5 1.9-3.5 0.9-4.5 0.7l0.9-3.7c0.9 0.2 4 0.6 3.6 3z" fill="white" />
  </svg>
);

// Custom Cursor Component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, [role="button"], input, textarea, select, .cursor-pointer')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return null;

  return (
    <div
      className={cn(
        "custom-cursor",
        isHovering && "scaled"
      )}
      style={{
        left: position.x,
        top: position.y,
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
};

// Tier Selection Modal Component
const TierSelectionModal = ({ isOpen, onClose, tier }) => {
  const [amount, setAmount] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!tier) return null;

  const minStake = tier.minStake || 1000;
  const maxStake = tier.maxStake || 100000;

  const handleStake = () => {
    if (!agreed || !amount || parseFloat(amount) < minStake) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D00] via-transparent to-[#E5E5E5] opacity-20 blur-xl" />

            <div className={cn(
              "relative glass-card rounded-2xl p-3 md:p-8 border-2 overflow-y-auto max-h-[85vh] md:max-h-[90vh]",
              tier.name === 'Chrome' ? "border-[#E5E5E5]/30" : "border-[#FF4D00]/30"
            )}>
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-10",
                getTierColor()
              )} />

              <button
                onClick={handleClose}
                className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#FF4D00]/20 border border-white/10 transition-all z-20 group"
              >
                <SafeIcon name="x" size={16} className="text-[#E5E5E5] group-hover:text-[#FF4D00] transition-colors" />
              </button>

              {!isSuccess ? (
                <div className="relative z-10">
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
                    <div className={cn(
                      "w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center border-2 flex-shrink-0",
                      tier.name === 'Chrome' ? "border-[#E5E5E5] bg-gradient-to-br from-gray-200 to-gray-400" :
                      tier.name === 'Flare' ? "border-[#FF4D00] bg-gradient-to-br from-orange-500 to-orange-700" :
                      "border-[#525252] bg-gradient-to-br from-gray-700 to-gray-900"
                    )}>
                      <SafeIcon
                        name={tier.name === 'Flare' ? "flame" : tier.name === 'Chrome' ? "hexagon" : "shield"}
                        size={18}
                        className={cn("md:w-6 md:h-6", tier.name === 'Chrome' ? "text-gray-900" : "text-white")}
                      />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-[#E5E5E5]/40 tracking-widest uppercase">
                        Membership Tier
                      </div>
                      <h3 className={cn(
                        "font-serif text-xl md:text-3xl font-black tracking-tight",
                        tier.name === 'Chrome' ? "text-[#E5E5E5]" : "text-white"
                      )}>
                        {tier.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3 md:mb-8 p-2.5 md:p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className={cn(
                      "text-2xl md:text-4xl font-black font-mono",
                      tier.name === 'Chrome' ? "text-[#E5E5E5]" : "text-[#FF4D00]"
                    )}>
                      {tier.apy}
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-[10px] md:text-sm text-[#E5E5E5]/60">Annual Percentage Yield</div>
                      <div className="font-mono text-[9px] md:text-xs text-[#E5E5E5]/40 hidden md:block">Auto-compounding every block</div>
                    </div>
                  </div>

                  <div className="mb-3 md:mb-6">
                    <div className="font-mono text-[9px] md:text-xs text-[#E5E5E5]/40 mb-2 tracking-widest uppercase">
                      Tier Privileges
                    </div>
                    <div className="space-y-1.5 md:space-y-3 max-h-28 md:max-h-none overflow-y-auto md:overflow-visible pr-1">
                      {tier.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 md:gap-3 p-1.5 md:p-3 rounded-lg bg-white/5 border border-white/5"
                        >
                          <div className={cn(
                            "w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0",
                            tier.name === 'Chrome' ? "bg-[#E5E5E5]/20" : "bg-[#FF4D00]/20"
                          )}>
                            <SafeIcon name="check" size={10} className={cn("md:w-[14px] md:h-[14px]", tier.name === 'Chrome' ? "text-[#E5E5E5]" : "text-[#FF4D00]")} />
                          </div>
                          <span className="font-mono text-[11px] md:text-sm text-[#E5E5E5]/80">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3 md:mb-6">
                    <div className="flex justify-between mb-1.5 md:mb-2">
                      <label className="font-mono text-[9px] md:text-xs text-[#E5E5E5]/60 tracking-wider uppercase">
                        Stake Amount
                      </label>
                      <span className="font-mono text-[9px] md:text-xs text-[#E5E5E5]/40">
                        Min: {minStake.toLocaleString()} AETH
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={minStake.toString()}
                        min={minStake}
                        className={cn(
                          "w-full px-3 md:px-4 py-2.5 md:py-4 bg-white/5 border-2 rounded-xl text-white font-mono text-sm md:text-lg placeholder-[#E5E5E5]/30 focus:outline-none focus:border-[#FF4D00]/50 transition-all",
                          tier.name === 'Chrome' ? "border-[#E5E5E5]/20 focus:border-[#E5E5E5]/50" : "border-[#FF4D00]/20 focus:border-[#FF4D00]/50"
                        )}
                      />
                      <span className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] md:text-sm text-[#E5E5E5]/40">
                        AETH
                      </span>
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="font-mono text-[9px] md:text-xs text-[#E5E5E5]/30">Balance: 0.00 AETH</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAmount(minStake.toString())}
                          className="font-mono text-[9px] md:text-xs text-[#FF4D00] hover:text-[#ff6a2b] transition-colors px-2 py-0.5 rounded bg-white/5 flex items-center gap-1"
                        >
                          <SafeIcon name="arrow-down" size={10} /> MIN
                        </button>
                        <button
                          onClick={() => setAmount(maxStake.toString())}
                          className="font-mono text-[9px] md:text-xs text-[#FF4D00] hover:text-[#ff6a2b] transition-colors px-2 py-0.5 rounded bg-white/5 flex items-center gap-1"
                        >
                          <SafeIcon name="arrow-up" size={10} /> MAX
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-3 md:mb-6 p-2 md:p-3 rounded-lg bg-white/5 border border-white/5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 md:w-4 md:h-4 rounded border-[#E5E5E5]/30 bg-transparent text-[#FF4D00] focus:ring-[#FF4D00] focus:ring-offset-0 cursor-pointer flex-shrink-0"
                    />
                    <label htmlFor="terms" className="font-mono text-[9px] md:text-xs text-[#E5E5E5]/60 leading-relaxed cursor-pointer">
                      I understand that staking requires a 30-day lockup period and early withdrawal carries a 5% penalty fee.
                    </label>
                  </div>

                  <button
                    onClick={handleStake}
                    disabled={!agreed || !amount || parseFloat(amount) < minStake || isLoading}
                    className={cn(
                      "w-full py-2.5 md:py-4 rounded-xl font-mono font-bold text-sm md:text-lg transition-all transform relative overflow-hidden group flex items-center justify-center gap-2",
                      agreed && amount && parseFloat(amount) >= minStake && !isLoading
                        ? tier.name === 'Chrome'
                          ? "bg-[#E5E5E5] text-[#050505] hover:bg-white hover:scale-[1.02]"
                          : "bg-[#FF4D00] text-[#050505] hover:bg-[#ff6a2b] hover:scale-[1.02]"
                        : "bg-white/10 text-[#E5E5E5]/40 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className={cn(
                          "w-4 h-4 border-2 border-t-transparent rounded-full animate-spin",
                          tier.name === 'Chrome' ? "border-gray-900" : "border-[#050505]"
                        )} />
                        <span className="text-xs md:text-base">Processing...</span>
                      </div>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <SafeIcon name="lock" size={14} className="md:w-[18px] md:h-[18px]" />
                        CONFIRM STAKE
                      </span>
                    )}

                    {!isLoading && agreed && amount && parseFloat(amount) >= minStake && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                  </button>

                  <p className="text-center font-mono text-[8px] md:text-[10px] text-[#E5E5E5]/30 mt-2 md:mt-4 flex items-center justify-center gap-1">
                    <SafeIcon name="fuel" size={10} /> Gas fees will be deducted • Network: Aether Mainnet
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative z-10 text-center py-4 md:py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={cn(
                      "w-14 h-14 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 border-4",
                      tier.name === 'Chrome' ? "border-[#E5E5E5] bg-[#E5E5E5]/10" : "border-[#FF4D00] bg-[#FF4D00]/10"
                    )}
                  >
                    <SafeIcon name="check" size={28} className={cn("md:w-12 md:h-12", tier.name === 'Chrome' ? "text-[#E5E5E5]" : "text-[#FF4D00]")} />
                  </motion.div>

                  <h3 className="font-serif text-xl md:text-3xl font-bold text-white mb-2">
                    Stake Confirmed
                  </h3>
                  <p className="font-mono text-[11px] md:text-sm text-[#E5E5E5]/60 mb-3 md:mb-6 max-w-xs mx-auto">
                    You have successfully joined the {tier.name} tier. Your assets are now generating yield.
                  </p>

                  <div className="bg-white/5 rounded-xl p-2.5 md:p-4 mb-3 md:mb-6 border border-white/10">
                    <div className="font-mono text-[9px] md:text-xs text-[#E5E5E5]/40 mb-1">TRANSACTION HASH</div>
                    <div className="font-mono text-xs md:text-sm text-[#FF4D00] truncate flex items-center justify-center gap-2">
                      <SafeIcon name="link" size={12} /> 0x7f8a9b2c...3d4e5f6a
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="bg-white/10 hover:bg-white/20 text-white px-5 md:px-8 py-2 md:py-3 rounded-lg font-mono font-bold transition-all text-xs md:text-base flex items-center gap-2 mx-auto"
                  >
                    <SafeIcon name="x" size={16} /> CLOSE
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Transmute Modal Component
const TransmuteModal = ({ isOpen, onClose, asset }) => {
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  if (!isOpen || !asset) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4 modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl p-5 md:p-8 max-w-md w-full max-h-[85vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#FF4D00]/20 transition-colors"
          >
            <SafeIcon name="x" size={18} className="text-[#E5E5E5]" />
          </button>

          <div className="mb-4 md:mb-6">
            <div className="font-mono text-[10px] md:text-xs text-[#E5E5E5]/40 mb-2 tracking-widest uppercase">
              Transmute Configuration
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              {asset.symbol} <SafeIcon name="arrow-right" size={20} className="text-[#FF4D00]" /> AETH
            </h3>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="font-mono text-[10px] md:text-xs text-[#E5E5E5]/60 mb-2 block tracking-wider uppercase">
                Amount to Transmute
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 md:px-4 py-3 bg-white/5 border border-[#E5E5E5]/20 rounded-lg text-white font-mono placeholder-[#E5E5E5]/30 focus:outline-none focus:border-[#FF4D00]/50 transition-colors"
                />
                <span className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#E5E5E5]/40">
                  {asset.symbol}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-mono text-[10px] md:text-xs text-[#E5E5E5]/30">Balance: 0.00</span>
                <button className="font-mono text-[10px] md:text-xs text-[#FF4D00] hover:text-[#ff6a2b] transition-colors flex items-center gap-1">
                  <SafeIcon name="arrow-up" size={10} /> MAX
                </button>
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] md:text-xs text-[#E5E5E5]/60 mb-2 block tracking-wider uppercase">
                Max Slippage: {slippage}%
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="font-mono text-[10px] md:text-xs text-[#E5E5E5]/30">0.1%</span>
                <span className="font-mono text-[10px] md:text-xs text-[#E5E5E5]/30">5%</span>
              </div>
            </div>

            <div className="p-3 md:p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between mb-2">
                <span className="font-mono text-[10px] md:text-xs text-[#E5E5E5]/60">Exchange Rate</span>
                <span className="font-mono text-[10px] md:text-xs text-[#E5E5E5]">1 {asset.symbol} = {asset.price} AETH</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-[10px] md:text-xs text-[#E5E5E5]/60">Network Fee</span>
                <span className="font-mono text-[10px] md:text-xs text-[#E5E5E5]">~0.004 AETH</span>
              </div>
            </div>

            <button className="w-full py-3 md:py-4 bg-[#FF4D00] hover:bg-[#ff6a2b] text-[#050505] rounded-xl font-mono font-bold transition-colors flex items-center justify-center gap-2">
              <SafeIcon name="zap" size={18} />
              TRANSMUTE NOW
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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

    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 77, 0, 0.6)';
        ctx.fill();

        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 77, 0, ${0.2 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });

      ripples.forEach((ripple, index) => {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 77, 0, ${1 - ripple.radius / 200})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ripple.radius += 2;
        if (ripple.radius > 200) {
          ripples.splice(index, 1);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [ripples]);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipples(prev => [...prev, { x, y, radius: 0 }]);
    onRipple && onRipple();
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full h-64 md:h-96 cursor-pointer"
      style={{ background: 'transparent' }}
    />
  );
};

// Main App Component
function App() {
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [sphereScale, setSphereScale] = useState(1);
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [transmuteModalOpen, setTransmuteModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [distortText, setDistortText] = useState(false);
  const [footerProgress, setFooterProgress] = useState(0);

  useEffect(() => {
    let lastTime = Date.now();

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const dt = currentTime - lastTime;

      if (dt > 0) {
        const vx = (e.clientX - lastMousePos.x) / dt;
        const vy = (e.clientY - lastMousePos.y) / dt;
        const velocity = Math.sqrt(vx * vx + vy * vy);

        const newScale = 1 + Math.min(velocity * 0.5, 0.3);
        setSphereScale(newScale);

        setTimeout(() => setSphereScale(1), 200);
      }

      setLastMousePos({ x: e.clientX, y: e.clientY });
      lastTime = currentTime;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [lastMousePos]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setFooterProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleRipple = () => {
    setDistortText(true);
    setTimeout(() => setDistortText(false), 300);
  };

  const tiers = [
    {
      name: 'Iron',
      apy: '12.5%',
      minStake: 1000,
      maxStake: 10000,
      features: [
        'Basic yield generation',
        'Community access',
        'Monthly reports',
        'Standard support'
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

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF4D00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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