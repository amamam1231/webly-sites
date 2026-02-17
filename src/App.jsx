import { SafeIcon } from './components/SafeIcon';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Lenis from 'lenis';
import { clsx, twMerge } from 'tailwind-merge';

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('[data-cursor-hover]') || e.target.closest('button') || e.target.closest('a') || e.target.closest('.interactive')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest('[data-cursor-hover]')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        opacity: 1,
      }}
      transition={{ duration: 0.2 }}
    />
  );
};

const Cell = ({ children, className, onHoverStart, onHoverEnd, isDimmed, delay = 0 }) => {
  return (
    <motion.div
      className={cn(
        "relative border border-white/10 bg-[#0a0a0a] overflow-hidden interactive",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isDimmed ? 0.4 : 1,
      }}
      transition={{ duration: 0.4, delay: delay * 0.05 }}
      whileHover={{
        scale: 1.02,
        zIndex: 20,
        transition: { duration: 0.2 }
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      data-cursor-hover
    >
      <motion.div
        className="absolute inset-0 bg-[#ccff00] z-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center transition-colors duration-200 group-hover:text-black">
        {children}
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();

  // Parallax transforms: even columns up, odd columns down
  const yUp = useTransform(scrollY, [0, 600], [0, -80]);
  const yDown = useTransform(scrollY, [0, 600], [0, 80]);

  const columns = [
    { transform: yUp, cells: [null, { char: 'S', sub: 'Strategy' }, { text: 'Since 2024' }] },
    { transform: yDown, cells: [{ char: 'D', sub: 'Design' }, { char: 'I', sub: 'Innovation' }, null] },
    { transform: yUp, cells: [{ char: 'E', sub: 'Experience' }, { char: 'G', sub: 'Growth' }, null] },
    { transform: yDown, cells: [null, { char: 'N', sub: 'Network' }, { text: 'Scroll to explore' }] },
  ];

  return (
    <section className="min-h-screen w-full flex border-b border-white/10 relative overflow-hidden">
      {columns.map((col, colIdx) => (
        <motion.div
          key={colIdx}
          className="flex-1 grid grid-rows-3 border-r border-white/10 last:border-r-0"
          style={{ y: col.transform }}
        >
          {col.cells.map((cell, cellIdx) => (
            <div
              key={cellIdx}
              className={cn(
                "border-b border-white/10 last:border-b-0 flex items-center justify-center relative overflow-hidden group",
                !cell && "bg-[#0a0a0a]"
              )}
            >
              {cell?.char && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-[#ccff00] z-0"
                    initial={{ y: '100%' }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-[18vw] md:text-[14vw] font-black uppercase leading-none tracking-tighter mix-blend-difference group-hover:text-black transition-colors duration-300">
                      {cell.char}
                    </span>
                    {cell.sub && (
                      <span className="text-xs uppercase tracking-widest text-white/40 group-hover:text-black/60 transition-colors mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                        {cell.sub}
                      </span>
                    )}
                  </div>
                </>
              )}
              {cell?.text && (
                <span className="text-xs md:text-sm uppercase tracking-widest text-white/40 text-center px-4 font-medium">
                  {cell.text}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      ))}
    </section>
  );
};

const Marquee = ({ items, speed = 30 }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap relative w-full py-6">
      <div
        className="inline-flex gap-12 animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <span key={idx} className="text-lg uppercase tracking-[0.2em] text-white/30 font-bold flex items-center gap-4">
            <span className="w-2 h-2 bg-[#ccff00] rounded-full inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProjectCard = ({ title, category, image, size = "normal" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden border border-white/10 group interactive",
        size === "large" && "min-h-[500px]",
        size === "normal" && "min-h-[300px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor-hover
    >
      {/* Noise overlay that disappears on hover */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none noise-overlay"
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Image with grayscale effect */}
      <motion.img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{
          filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-[#ccff00]/10 z-10"
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <motion.h3
          className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1"
          animate={{ x: isHovered ? 10 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <p className="text-white/60 text-sm uppercase tracking-widest">{category}</p>
      </div>

      {/* Corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      >
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#ccff00]" />
      </motion.div>
    </div>
  );
};

const ProjectGallery = () => {
  const projects = [
    { title: "Nexus", category: "Brand Identity", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80", size: "large" },
    { title: "Aurora", category: "Web Experience", image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80", size: "normal" },
    { title: "Prism", category: "Motion Design", image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80", size: "normal" },
    { title: "Vertex", category: "Development", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80", size: "normal" },
    { title: "Echo", category: "Art Direction", image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200&q=80", size: "large" },
  ];

  const clients = ["Google", "Apple", "Meta", "Spotify", "Netflix", "Amazon", "Tesla", "Nike", "Adidas", "Sony"];

  return (
    <section className="w-full border-b border-white/10">
      {/* Section Header */}
      <div className="grid grid-cols-12 border-b border-white/10">
        <div className="col-span-12 md:col-span-4 p-8 border-r border-white/10 flex items-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Selected<br/>Works</h2>
        </div>
        <div className="col-span-12 md:col-span-8 p-8 flex items-center justify-between">
          <p className="text-white/60 max-w-md text-sm leading-relaxed">
            Crafting digital experiences that push boundaries and redefine user expectations. Each project is a journey into innovation.
          </p>
          <span className="text-[#ccff00] font-bold text-sm uppercase tracking-widest hidden md:block">04 Projects</span>
        </div>
      </div>

      {/* Mosaic Grid */}
      <div className="grid grid-cols-12 auto-rows-[300px]">
        <div className="col-span-12 md:col-span-8 row-span-2 border-r border-b border-white/10">
          <ProjectCard {...projects[0]} size="large" />
        </div>
        <div className="col-span-12 md:col-span-4 row-span-1 border-b border-white/10">
          <ProjectCard {...projects[1]} />
        </div>
        <div className="col-span-12 md:col-span-4 row-span-1 border-b border-white/10">
          <ProjectCard {...projects[2]} />
        </div>
        <div className="col-span-12 md:col-span-6 row-span-1 border-r border-b border-white/10">
          <ProjectCard {...projects[3]} />
        </div>
        <div className="col-span-12 md:col-span-6 row-span-1 border-b border-white/10">
          <ProjectCard {...projects[4]} size="large" />
        </div>
      </div>

      {/* Marquee */}
      <div className="border-t border-white/10 bg-[#0a0a0a]">
        <Marquee items={clients} speed={25} />
      </div>
    </section>
  );
};

const FloatingElements = () => {
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Los_Angeles'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const stickers = [
    {
      text: "Available for work",
      color: "bg-[#ccff00] text-black",
      defaultPos: { x: 60, y: 100 }
    },
    {
      text: "San Francisco",
      color: "bg-white text-black",
      icon: "map-pin",
      defaultPos: { x: 80, y: 300 }
    },
    {
      text: time,
      color: "bg-black text-white border border-white/20",
      defaultPos: { x: 100, y: 500 }
    },
  ];

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 hidden md:block">
      {stickers.map((sticker, idx) => (
        <motion.div
          key={idx}
          className={cn(
            "absolute pointer-events-auto px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest cursor-grab active:cursor-grabbing shadow-2xl interactive",
            sticker.color
          )}
          initial={{ ...sticker.defaultPos, opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + idx * 0.2, duration: 0.5 }}
          drag
          dragConstraints={{
            left: 0,
            right: typeof window !== 'undefined' ? window.innerWidth - 220 : 1000,
            top: 0,
            bottom: typeof window !== 'undefined' ? window.innerHeight - 80 : 800
          }}
          dragElastic={0.1}
          dragMomentum={false}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-cursor-hover
        >
          <div className="flex items-center gap-2">
            {sticker.icon && (
              <SafeIcon name={sticker.icon} size={14} />
            )}
            {sticker.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    { num: "01", title: "Brand Strategy", desc: "Defining your voice in a crowded market" },
    { num: "02", title: "Visual Identity", desc: "Crafting memorable aesthetic systems" },
    { num: "03", title: "Digital Products", desc: "Websites and apps that convert" },
    { num: "04", title: "Motion Design", desc: "Bringing static to life with purpose" },
  ];

  return (
    <section className="w-full border-b border-white/10">
      <div className="grid grid-cols-12">
        {services.map((service, idx) => (
          <div
            key={idx}
            className={cn(
              "col-span-12 md:col-span-6 lg:col-span-3 p-8 border-b md:border-b-0 border-white/10 last:border-r-0 border-r group interactive",
              idx !== services.length - 1 && "lg:border-r"
            )}
            data-cursor-hover
          >
            <motion.div
              className="h-full flex flex-col justify-between min-h-[300px]"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <span className="text-[#ccff00] font-bold text-sm mb-4 block">{service.num}</span>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-3 group-hover:text-[#ccff00] transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                <span className="text-xs uppercase tracking-widest">Learn more</span>
                <SafeIcon name="arrow-right" size={14} />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center border-t border-white/10 p-8 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 grid grid-cols-4 opacity-20 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border-r border-white/10 last:border-r-0" />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.p
          className="text-[#ccff00] uppercase tracking-widest text-sm mb-6 font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Start a Project
        </motion.p>

        <motion.h2
          className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-8 leading-none"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Let's Create<br/>
          <span className="text-white/20">Together</span>
        </motion.h2>

        <motion.p
          className="text-white/60 max-w-md mx-auto mb-12 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Ready to transform your digital presence? We're here to turn your vision into reality.
        </motion.p>

        <motion.button
          className="px-10 py-5 bg-[#ccff00] text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300 interactive"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          data-cursor-hover
        >
          Get in Touch
        </motion.button>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute left-10 bottom-20 text-white/10 text-6xl font-black uppercase tracking-tighter hidden lg:block"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        Design
      </motion.div>

      <motion.div
        className="absolute right-10 top-20 text-white/10 text-6xl font-black uppercase tracking-tighter hidden lg:block"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        Future
      </motion.div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-6 p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Grid Studio</h3>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Creating digital experiences that matter. Based in San Francisco, working globally.
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            {['twitter', 'instagram', 'linkedin', 'dribbble'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all duration-300 interactive"
                data-cursor-hover
              >
                <SafeIcon name={social} size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-6 md:col-span-3 p-8 border-r border-white/10">
          <h4 className="text-xs uppercase tracking-widest text-white/40 mb-6 font-bold">Navigation</h4>
          <ul className="space-y-3">
            {['Work', 'Services', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm uppercase tracking-wider hover:text-[#ccff00] transition-colors interactive" data-cursor-hover>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-6 md:col-span-3 p-8">
          <h4 className="text-xs uppercase tracking-widest text-white/40 mb-6 font-bold">Contact</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li>hello@gridstudio.co</li>
            <li>+1 (555) 123-4567</li>
            <li className="pt-2 text-white/40">San Francisco, CA</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest text-white/40">
        <span>© 2024 Grid Studio. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

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

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-[#ccff00] selection:text-black overflow-x-hidden">
      <CustomCursor />
      <FloatingElements />

      <main>
        <HeroSection />
        <ProjectGallery />
        <ServicesSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;