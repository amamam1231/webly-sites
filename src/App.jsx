import { SafeIcon } from './components/SafeIcon';
import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ArrowUpRight, Play, Pause, Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react';

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// GridCell Component
const GridCell = ({
  colSpan = 1,
  rowSpan = 1,
  children,
  className,
  onHover,
  isDimmed = false,
  delay = 0
}) => {
  return (
    <motion.div
      className={cn(
        "relative border border-zinc-800 bg-zinc-950 overflow-hidden",
        className
      )}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isDimmed ? 0.2 : 1,
        scale: 1,
        filter: isDimmed ? 'grayscale(100%)' : 'grayscale(0%)'
      }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        scale: 1.02,
        borderColor: '#CCFF00',
        transition: { type: "spring", stiffness: 300 }
      }}
      onMouseEnter={onHover}
      onMouseLeave={() => onHover && onHover(null)}
    >
      {children}
    </motion.div>
  );
};

// Marquee Component
const Marquee = ({ text, speed = 20 }) => {
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div
        className="flex gap-8 text-xs font-bold tracking-widest text-zinc-500 uppercase"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "linear"
        }}
      >
        {Array(10).fill(text).map((t, i) => (
          <span key={i} className="flex items-center gap-8">
            {t} <span className="w-2 h-2 bg-lime-400 rounded-full" style={{ backgroundColor: '#CCFF00' }} />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// Hero Section with Split Logo
const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const nX = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const eX = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const oX = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-zinc-950"
    >
      <div className="grid grid-cols-4 grid-rows-4 h-screen w-full">
        {/* Top Row */}
        <GridCell className="flex items-center justify-center p-4">
          <Marquee text="DIGITAL ART" speed={15} />
        </GridCell>
        <GridCell className="bg-zinc-900">
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-zinc-700 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-lime-400 rounded-full" style={{ backgroundColor: '#CCFF00' }} />
            </div>
          </div>
        </GridCell>
        <GridCell className="flex items-center justify-center">
          <span className="text-zinc-600 font-black text-4xl">01</span>
        </GridCell>
        <GridCell className="flex items-center justify-center p-4">
          <Marquee text="ILLUSTRATION" speed={25} />
        </GridCell>

        {/* Second Row */}
        <GridCell className="bg-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-transparent" />
          <div className="absolute bottom-4 left-4 text-zinc-500 text-xs font-mono">GRID.SYS</div>
        </GridCell>

        {/* Center Logo - Spans 2x2 */}
        <motion.div
          className="col-span-2 row-span-2 border border-zinc-800 bg-black flex items-center justify-center relative overflow-hidden"
          style={{ scale, opacity }}
        >
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <motion.span
              style={{ x: nX }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter"
            >
              N
            </motion.span>
            <motion.span
              style={{ x: eX }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter"
            >
              E
            </motion.span>
            <motion.span
              style={{ x: oX }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter"
            >
              O
            </motion.span>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500 text-xs tracking-widest uppercase">
            Design Studio
          </div>
        </motion.div>

        <GridCell className="bg-zinc-900">
          <div className="w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-zinc-700" style={{ opacity: Math.random() > 0.5 ? 1 : 0.3 }} />
              ))}
            </div>
          </div>
        </GridCell>

        {/* Third Row */}
        <GridCell className="flex items-center justify-center">
          <span className="text-zinc-600 font-black text-4xl">GRID</span>
        </GridCell>
        <GridCell className="bg-zinc-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-black text-lime-400" style={{ color: '#CCFF00' }}>↓</div>
          </div>
        </GridCell>

        {/* Bottom Row */}
        <GridCell className="flex items-center justify-center p-4">
          <Marquee text="MOTION DESIGN" speed={18} />
        </GridCell>
        <GridCell className="bg-zinc-900 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border border-zinc-700 rotate-45" />
          </div>
        </GridCell>
        <GridCell className="flex items-center justify-center">
          <span className="text-zinc-600 font-black text-4xl">24</span>
        </GridCell>
        <GridCell className="flex items-center justify-center p-4">
          <Marquee text="BRUTALISM" speed={22} />
        </GridCell>
      </div>
    </section>
  );
};

// Portfolio Section
const PortfolioSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yEven = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yOdd = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const portfolioItems = [
    { id: 1, colSpan: 2, rowSpan: 2, title: "CYBER PUNK", category: "3D ILLUSTRATION", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
    { id: 2, colSpan: 1, rowSpan: 3, title: "FLUID FORMS", category: "VECTOR ART", image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80" },
    { id: 3, colSpan: 1, rowSpan: 1, title: "NEON DREAMS", category: "MOTION", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80" },
    { id: 4, colSpan: 2, rowSpan: 1, title: "GRID SYSTEM", category: "BRANDING", image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80" },
    { id: 5, colSpan: 1, rowSpan: 2, title: "ABSTRACT", category: "ILLUSTRATION", image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&q=80" },
    { id: 6, colSpan: 1, rowSpan: 1, title: "KINETIC", category: "TYPOGRAPHY", image: "https://images.unsplash.com/photo-1614851099511-773084f6911d?w=800&q=80" },
    { id: 7, colSpan: 2, rowSpan: 2, title: "DIGITAL WAVE", category: "3D ART", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80" },
    { id: 8, colSpan: 1, rowSpan: 1, title: "RAW DATA", category: "CONCEPT", image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80" },
  ];

  return (
    <section ref={containerRef} className="relative py-20 bg-zinc-950">
      <div className="container mx-auto px-4 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4"
        >
          LIVING CELLS
        </motion.h2>
        <p className="text-zinc-500 text-sm tracking-widest uppercase">Selected Works 2023-2024</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
          {portfolioItems.map((item, index) => {
            const isEven = index % 2 === 0;
            const y = isEven ? yEven : yOdd;

            return (
              <motion.div
                key={item.id}
                style={{
                  gridColumn: `span ${item.colSpan}`,
                  gridRow: `span ${item.rowSpan}`,
                  y
                }}
              >
                <GridCell
                  colSpan={item.colSpan}
                  rowSpan={item.rowSpan}
                  className="h-64 md:h-auto min-h-[300px] cursor-pointer group"
                  onHover={() => setHoveredIndex(index)}
                  isDimmed={hoveredIndex !== null && hoveredIndex !== index}
                  delay={index * 0.1}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-500" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                    <p className="text-xs text-lime-400 uppercase tracking-widest mt-1" style={{ color: '#CCFF00' }}>{item.category}</p>
                  </div>

                  {hoveredIndex === index && (
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center pointer-events-none"
                      style={{ backgroundColor: '#CCFF00' }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <span className="text-black font-bold text-xs">VIEW</span>
                    </motion.div>
                  )}
                </GridCell>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Services Section with Floating Cursor
const ServicesSection = () => {
  const [hoveredService, setHoveredService] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const services = [
    { id: 1, title: "3D ILLUSTRATION", description: "Dimensional art for digital spaces", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80" },
    { id: 2, title: "VECTOR SYSTEMS", description: "Scalable graphic languages", image: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&q=80" },
    { id: 3, title: "MOTION DESIGN", description: "Kinetic typography & animation", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80" },
    { id: 4, title: "BRAND IDENTITY", description: "Visual systems & guidelines", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80" },
  ];

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative py-20 bg-zinc-950 border-t border-zinc-800"
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto px-4 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tighter"
        >
          TERMINAL
        </motion.h2>
      </div>

      <div className="container mx-auto px-4 relative">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-t-2 border-zinc-800 py-8 cursor-pointer group relative"
            onMouseEnter={() => setHoveredService(service)}
            onMouseLeave={() => setHoveredService(null)}
          >
            <motion.div
              className="flex items-center justify-between"
              whileHover={{ x: 20 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-8">
                <span className="text-zinc-600 font-mono text-sm">0{service.id}</span>
                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter group-hover:text-lime-400 transition-colors" style={{ color: hoveredService?.id === service.id ? '#CCFF00' : undefined }}>
                  {service.title}
                </h3>
              </div>
              <SafeIcon name="arrow-up-right" size={32} className="text-zinc-600 group-hover:text-lime-400 transition-colors" style={{ color: hoveredService?.id === service.id ? '#CCFF00' : undefined }} />
            </motion.div>
            <p className="text-zinc-500 mt-2 ml-16 text-sm tracking-wide">{service.description}</p>
          </motion.div>
        ))}

        {/* Floating Image Cursor */}
        <AnimatePresence>
          {hoveredService && (
            <motion.div
              className="fixed w-48 h-32 pointer-events-none z-50 overflow-hidden rounded-lg border-2 border-lime-400"
              style={{
                backgroundColor: '#CCFF00',
                left: mousePosition.x + 20,
                top: mousePosition.y - 60,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <img
                src={hoveredService.image}
                alt={hoveredService.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Footer Section
const FooterSection = () => {
  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800 pt-20 pb-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-20">
          <GridCell className="p-8 flex flex-col justify-between min-h-[200px]">
            <span className="text-zinc-500 text-xs tracking-widest uppercase">Location</span>
            <div className="flex items-center gap-2 text-white">
              <SafeIcon name="map-pin" size={16} />
              <span className="font-bold">BERLIN, DE</span>
            </div>
          </GridCell>

          <GridCell className="p-8 flex flex-col justify-between min-h-[200px]">
            <span className="text-zinc-500 text-xs tracking-widest uppercase">Contact</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <SafeIcon name="mail" size={16} />
                <span>hello@neo-grid.com</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <SafeIcon name="phone" size={16} />
                <span>+49 30 1234567</span>
              </div>
            </div>
          </GridCell>

          <GridCell className="p-8 flex flex-col justify-between min-h-[200px]">
            <span className="text-zinc-500 text-xs tracking-widest uppercase">Social</span>
            <div className="flex gap-4">
              <SafeIcon name="instagram" size={20} className="text-white hover:text-lime-400 cursor-pointer" style={{ hover: { color: '#CCFF00' } }} />
              <SafeIcon name="twitter" size={20} className="text-white hover:text-lime-400 cursor-pointer" />
              <SafeIcon name="linkedin" size={20} className="text-white hover:text-lime-400 cursor-pointer" />
            </div>
          </GridCell>

          <GridCell className="p-8 flex items-center justify-center min-h-[200px] bg-zinc-900">
            <div className="text-center">
              <div className="text-4xl font-black text-lime-400 mb-2" style={{ color: '#CCFF00' }}>©24</div>
              <div className="text-zinc-500 text-xs">NEO-GRID STUDIO</div>
            </div>
          </GridCell>
        </div>

        {/* Big CTA Button */}
        <motion.div
          className="w-full md:w-1/2 mx-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button className="w-full py-12 bg-lime-400 text-black font-black text-3xl md:text-5xl tracking-tighter hover:bg-white transition-colors border-2 border-lime-400" style={{ backgroundColor: '#CCFF00' }}>
            START PROJECT
          </button>
        </motion.div>

        <div className="mt-20 text-center">
          <p className="text-zinc-600 text-xs tracking-widest uppercase">© 2024 NEO-GRID Design Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  return (
    <div className="relative bg-zinc-950 min-h-screen">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Main Content */}
      <main>
        <HeroSection />
        <PortfolioSection />
        <ServicesSection />
        <FooterSection />
      </main>
    </div>
  );
}

export default App;