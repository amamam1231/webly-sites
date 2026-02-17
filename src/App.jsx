import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Lenis from 'lenis';
import { Play, Clock, MapPin, Briefcase } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Custom Cursor Component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('[data-hover]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white"
      animate={{
        x: position.x - (isHovering ? 40 : 10),
        y: position.y - (isHovering ? 40 : 10),
        width: isHovering ? 80 : 20,
        height: isHovering ? 80 : 20,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    />
  );
};

// Border Animation Component
const AnimatedBorder = ({ delay = 0 }) => {
  return (
    <>
      <motion.div
        className="absolute top-0 left-0 h-px bg-white/20 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay, ease: 'easeInOut' }}
        style={{ width: '100%' }}
      />
      <motion.div
        className="absolute top-0 right-0 w-px bg-white/20 origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.1, ease: 'easeInOut' }}
        style={{ height: '100%' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-px bg-white/20 origin-right"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeInOut' }}
        style={{ width: '100%' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-px bg-white/20 origin-bottom"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3, ease: 'easeInOut' }}
        style={{ height: '100%' }}
      />
    </>
  );
};

// Cell Component
const Cell = ({
  colSpan = 1,
  rowSpan = 1,
  children,
  index,
  hoveredIndex,
  setHoveredIndex,
  className,
  delay = 0
}) => {
  const isHovered = hoveredIndex === index;
  const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1;

  const colSpanClass = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    6: 'col-span-6',
    8: 'col-span-8',
    12: 'col-span-12',
  }[colSpan] || 'col-span-1';

  const rowSpanClass = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
  }[rowSpan] || 'row-span-1';

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden",
        colSpanClass,
        rowSpanClass,
        className
      )}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      animate={{
        scale: isHovered ? 1.02 : 1,
        zIndex: isHovered ? 20 : 1,
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <AnimatedBorder delay={delay} />

      <motion.div
        className="absolute inset-0 bg-[#ccff00] z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className={cn(
          "relative z-10 h-full w-full transition-colors duration-300",
          isHovered ? "text-black" : "text-white"
        )}
        animate={{
          opacity: hoveredIndex !== null && !isHovered && !isNeighbor ? 0.3 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Interactive Grid Wrapper
const InteractiveGrid = ({ children, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={cn("grid grid-cols-12 auto-rows-min", className)}>
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              index,
              hoveredIndex,
              setHoveredIndex,
              delay: index * 0.05
            })
          : child
      )}
    </div>
  );
};

// Letter Component for Hero
const ParallaxLetter = ({ letter, colIndex, scrollY }) => {
  const isEven = colIndex % 2 === 0;
  const y = useTransform(
    scrollY,
    [0, 500],
    isEven ? [0, -80] : [0, 80]
  );

  return (
    <motion.span
      style={{ y }}
      className="text-[15vw] md:text-[12vw] font-black leading-none uppercase block"
    >
      {letter}
    </motion.span>
  );
};

// Hero Section
const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const letters = ["S", "T", "U", "D", "I", "O"];

  return (
    <section ref={containerRef} className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <InteractiveGrid className="w-full h-screen">
        {/* Top row spacing */}
        <Cell colSpan={12} rowSpan={1} className="h-20" />

        {/* Letters row 1 */}
        <Cell colSpan={2} className="h-32 md:h-48" />
        <Cell colSpan={2} className="flex items-center justify-center h-32 md:h-48">
          <ParallaxLetter letter="S" colIndex={0} scrollY={scrollY} />
        </Cell>
        <Cell colSpan={2} className="flex items-center justify-center h-32 md:h-48">
          <ParallaxLetter letter="T" colIndex={1} scrollY={scrollY} />
        </Cell>
        <Cell colSpan={2} className="flex items-center justify-center h-32 md:h-48">
          <ParallaxLetter letter="U" colIndex={2} scrollY={scrollY} />
        </Cell>
        <Cell colSpan={2} className="flex items-center justify-center h-32 md:h-48">
          <ParallaxLetter letter="D" colIndex={3} scrollY={scrollY} />
        </Cell>
        <Cell colSpan={2} className="h-32 md:h-48" />

        {/* Letters row 2 */}
        <Cell colSpan={4} className="h-32 md:h-48" />
        <Cell colSpan={2} className="flex items-center justify-center h-32 md:h-48">
          <ParallaxLetter letter="I" colIndex={0} scrollY={scrollY} />
        </Cell>
        <Cell colSpan={2} className="flex items-center justify-center h-32 md:h-48">
          <ParallaxLetter letter="O" colIndex={1} scrollY={scrollY} />
        </Cell>
        <Cell colSpan={4} className="h-32 md:h-48" />

        {/* Info row */}
        <Cell colSpan={3} className="h-24 flex items-center justify-center border-t border-white/10">
          <span className="text-xs uppercase tracking-widest text-white/60">Est. 2024</span>
        </Cell>
        <Cell colSpan={6} className="h-24 flex items-center justify-center border-t border-white/10">
          <span className="text-xs uppercase tracking-widest text-center text-white/60">
            Digital Design Studio<br />Creating Bold Experiences
          </span>
        </Cell>
        <Cell colSpan={3} className="h-24 flex items-center justify-center border-t border-white/10">
          <span className="text-xs uppercase tracking-widest text-white/60">Scroll Down</span>
        </Cell>
      </InteractiveGrid>
    </section>
  );
};

// Marquee Component
const Marquee = ({ items, speed = 20 }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap py-6 border-y border-white/10 bg-[#0a0a0a]">
      <motion.div
        className="inline-flex gap-12"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "linear"
        }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-lg uppercase font-bold text-white/40 tracking-wider">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// Project Card with Noise
const ProjectCard = ({ title, category, colSpan, rowSpan, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Cell
      colSpan={colSpan}
      rowSpan={rowSpan}
      index={index}
      className="relative min-h-[300px] md:min-h-[400px] group"
    >
      <div
        className="absolute inset-0 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Video/Image Background */}
        <motion.div
          className="absolute inset-0 bg-neutral-800"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={`https://images.unsplash.com/photo-${1550000000000 + index * 1000}?w=800&q=80`}
            alt={title}
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>

        {/* Noise Overlay */}
        <motion.div
          className="absolute inset-0 noise-bg pointer-events-none"
          animate={{ opacity: isHovered ? 0 : 0.3 }}
          transition={{ duration: 0.4 }}
        />

        {/* Play Button on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#ccff00] flex items-center justify-center">
                <Play className="w-8 h-8 text-black ml-1" fill="black" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <motion.div
            animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs uppercase tracking-widest text-white/60 block mb-2">
              {category}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold uppercase">{title}</h3>
          </motion.div>
        </div>
      </div>
    </Cell>
  );
};

// Project Gallery
const ProjectGallery = () => {
  const projects = [
    { title: "Neon Dreams", category: "Branding", colSpan: 6, rowSpan: 2 },
    { title: "Urban Flow", category: "Web Design", colSpan: 3, rowSpan: 2 },
    { title: "Cyber Punk", category: "Motion", colSpan: 3, rowSpan: 1 },
    { title: "Minimalist", category: "Editorial", colSpan: 3, rowSpan: 1 },
    { title: "Future Tech", category: "Product", colSpan: 4, rowSpan: 2 },
    { title: "Abstract", category: "Art Direction", colSpan: 4, rowSpan: 2 },
    { title: "Concrete", category: "Architecture", colSpan: 4, rowSpan: 2 },
  ];

  return (
    <section className="py-20">
      <div className="px-4 mb-12">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Selected Works</h2>
      </div>
      <InteractiveGrid>
        {projects.map((project, i) => (
          <ProjectCard
            key={i}
            {...project}
            index={i}
          />
        ))}
      </InteractiveGrid>
    </section>
  );
};

// Floating Sticker
const FloatingSticker = ({ children, initialX, initialY, icon: Icon }) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.1}
      initial={{ x: initialX, y: initialY, rotate: Math.random() * 10 - 5 }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      className="fixed z-40 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold uppercase text-sm cursor-grab active:cursor-grabbing shadow-2xl flex items-center gap-2 select-none"
      data-hover
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.div>
  );
};

// Floating Elements
const FloatingElements = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <>
      <FloatingSticker initialX={50} initialY={100} icon={Briefcase}>
        Available for work
      </FloatingSticker>

      <FloatingSticker initialX={window.innerWidth - 250} initialY={150} icon={MapPin}>
        San Francisco
      </FloatingSticker>

      <FloatingSticker initialX={100} initialY={window.innerHeight - 150} icon={Clock}>
        {formatTime(time)}
      </FloatingSticker>
    </>
  );
};

// Main App
function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
      <CustomCursor />
      <FloatingElements />

      <HeroSection />

      <Marquee
        items={[
          "Google", "Apple", "Meta", "Spotify", "Netflix", "Airbnb",
          "Tesla", "Nike", "Adidas", "Samsung", "Sony", "Microsoft"
        ]}
        speed={30}
      />

      <ProjectGallery />

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-white/10 mt-20">
        <InteractiveGrid>
          <Cell colSpan={6} className="p-8">
            <h3 className="text-2xl font-bold uppercase mb-4">Get in Touch</h3>
            <p className="text-white/60 mb-6">hello@studio.design</p>
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase hover:bg-[#ccff00] transition-colors">
              Start a Project
            </button>
          </Cell>
          <Cell colSpan={6} className="p-8 flex flex-col justify-between">
            <div className="flex gap-8 text-sm uppercase text-white/60">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Behance</a>
            </div>
            <p className="text-white/40 text-sm mt-8">© 2024 Studio. All rights reserved.</p>
          </Cell>
        </InteractiveGrid>
      </footer>
    </div>
  );
}

export default App;