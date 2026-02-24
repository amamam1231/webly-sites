import { SafeIcon } from './components/SafeIcon';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import maplibregl from 'maplibre-gl';

// Utility for Tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  }
};

// Header Component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Услуги', href: '#services' },
    { name: 'Цены', href: '#prices' },
    { name: 'Галерея', href: '#gallery' },
    { name: 'О нас', href: '#about' },
    { name: 'Контакты', href: '#contact' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <SafeIcon name="scissors" size={32} className="text-amber-500" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight">SERGIO</span>
              <span className="text-xs text-amber-500 tracking-widest uppercase">MUSEL</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium text-gray-300 hover:text-amber-500 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#booking"
              onClick={(e) => scrollToSection(e, '#booking')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all hover:scale-105"
            >
              <SafeIcon name="calendar" size={18} />
              Записаться
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <SafeIcon name="x" size={24} /> : <SafeIcon name="menu" size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-md border-t border-amber-500/20"
          >
            <nav className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-lg font-medium text-gray-300 hover:text-amber-500 py-2 border-b border-gray-800"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#booking"
                onClick={(e) => scrollToSection(e, '#booking')}
                className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-full"
              >
                <SafeIcon name="calendar" size={18} />
                Записаться онлайн
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Hero Section
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=80"
          alt="Barbershop interior"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 border border-amber-500/20 rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 border border-amber-500/10 rounded-full" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium">
              <SafeIcon name="scissors" size={16} />
              Премиум барбершоп
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight"
          >
            SERGIO{' '}
            <span className="text-gold-gradient">MUSEL</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Классические стрижки и опасное бритье в атмосфере настоящего мужского клуба.
            Доверь свой стиль профессионалам.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold rounded-full hover:shadow-xl hover:shadow-amber-500/30 transition-all hover:scale-105"
            >
              <SafeIcon name="calendar" size={20} />
              Записаться сейчас
            </a>
            <a
              href="#prices"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('prices').scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              <SafeIcon name="scissors" size={20} />
              Услуги и цены
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-amber-500/50 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-amber-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Services Section
const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      icon: 'scissors',
      title: 'Стрижка',
      description: 'Классические и современные мужские стрижки с учетом формы лица и типа волос',
      price: 'от 1 500 ₽'
    },
    {
      icon: 'user',
      title: 'Бритье',
      description: 'Опасное бритье с использованием премиальной косметики и горячих компрессов',
      price: 'от 1 200 ₽'
    },
    {
      icon: 'star',
      title: 'Уход за бородой',
      description: 'Моделирование, окрашивание и комплексный уход за бородой и усами',
      price: 'от 800 ₽'
    },
    {
      icon: 'calendar',
      title: 'Комплекс',
      description: 'Стрижка + бритье + уход. Полный комплекс услуг для идеального образа',
      price: 'от 3 500 ₽'
    }
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="inline-block text-amber-500 font-semibold tracking-wider uppercase text-sm mb-4">
            Наши услуги
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Что мы <span className="text-gold-gradient">предлагаем</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Профессиональные услуги для мужчин, которые ценят качество и стиль
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <SafeIcon name={service.icon} size={28} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-amber-500 font-bold text-lg">{service.price}</span>
                <a
                  href="#booking"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Записаться →
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Prices Section
const Prices = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const priceCategories = [
    {
      title: 'Стрижки',
      items: [
        { name: 'Мужская стрижка', price: '1 500 ₽', time: '45 мин' },
        { name: 'Стрижка машинкой', price: '800 ₽', time: '20 мин' },
        { name: 'Стрижка + борода', price: '2 200 ₽', time: '60 мин' },
        { name: 'Детская стрижка (до 12 лет)', price: '1 000 ₽', time: '30 мин' },
      ]
    },
    {
      title: 'Бритье и уход',
      items: [
        { name: 'Опасное бритье', price: '1 200 ₽', time: '40 мин' },
        { name: 'Королевское бритье', price: '1 800 ₽', time: '60 мин' },
        { name: 'Уход за бородой', price: '800 ₽', time: '20 мин' },
        { name: 'Окрашивание бороды', price: '1 500 ₽', time: '45 мин' },
      ]
    },
    {
      title: 'Комплексы',
      items: [
        { name: 'Базовый (стрижка + бритье)', price: '2 500 ₽', time: '75 мин' },
        { name: 'Премиум (все включено)', price: '3 500 ₽', time: '90 мин' },
        { name: 'VIP (премиум + уход)', price: '4 500 ₽', time: '120 мин' },
        { name: 'Друг + друг (2 стрижки)', price: '2 700 ₽', time: '90 мин' },
      ]
    }
  ];

  return (
    <section id="prices" className="py-20 md:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="inline-block text-amber-500 font-semibold tracking-wider uppercase text-sm mb-4">
            Прайс-лист
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Наши <span className="text-gold-gradient">цены</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Прозрачное ценообразование без скрытых платежей. Качество, достойное королей.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {priceCategories.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-amber-500/10 to-transparent">
                <h3 className="text-2xl font-bold text-white">{category.title}</h3>
              </div>
              <div className="p-6">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="price-row flex items-center justify-between py-4 border-b border-gray-800/50 last:border-0 cursor-pointer group"
                  >
                    <div className="flex-1">
                      <h4 className="text-white font-semibold group-hover:text-amber-500 transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                    <span className="text-xl font-bold text-amber-500 ml-4">{item.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 text-sm mb-4">* Цены указаны за услуги мастеров разного уровня. Точная стоимость после консультации.</p>
          <a
            href="#booking"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold transition-colors"
          >
            Записаться сейчас
            <SafeIcon name="chevronRight" size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// Gallery Section
const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const images = [
    { src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80', alt: 'Стрижка в процессе' },
    { src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80', alt: 'Мужская стрижка' },
    { src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80', alt: 'Опасное бритье' },
    { src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80', alt: 'Уход за бородой' },
    { src: 'https://images.unsplash.com/photo-1582095133177-472d4f9b6aef?w=800&q=80', alt: 'Барбер за работой' },
    { src: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&q=80', alt: 'Интерьер барбершопа' },
  ];

  return (
    <section id="gallery" className="py-20 md:py-32 bg-slate-950 relative">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="inline-block text-amber-500 font-semibold tracking-wider uppercase text-sm mb-4">
            Портфолио
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Наши <span className="text-gold-gradient">работы</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className={cn(
                "relative group cursor-pointer overflow-hidden rounded-xl aspect-square",
                index === 0 || index === 3 ? "md:col-span-2 md:row-span-2 aspect-auto" : ""
              )}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                <p className="text-white font-semibold">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <SafeIcon name="x" size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// About Section
const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { icon: 'star', title: '10+ лет', desc: 'Опыт работы' },
    { icon: 'user', title: '5000+', desc: 'Довольных клиентов' },
    { icon: 'check', title: 'Премиум', desc: 'Косметика' },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/5 to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="inline-block text-amber-500 font-semibold tracking-wider uppercase text-sm mb-4">
              О барбершопе
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-white mb-6">
              Место, где <span className="text-gold-gradient">создают стиль</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg mb-6 leading-relaxed">
              Sergio Musel — это не просто барбершоп, это настоящий мужской клуб, где каждый клиент
              получает индивидуальный подход и премиальный сервис. Наши мастера — настоящие
              профессионалы с многолетним опытом.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg mb-8 leading-relaxed">
              Мы используем только профессиональную косметику премиум-класса и стерильный инструмент.
              Атмосфера джентльменского клуба, хорошая музыка и лучшие мастера ждут вас.
            </motion.p>

            <motion.div variants={staggerContainer} className="grid grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div key={index} variants={scaleIn} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <SafeIcon name={feature.icon} size={24} className="text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{feature.title}</div>
                  <div className="text-sm text-gray-500">{feature.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1622286342621-4e9c63a2fe5c?w=800&q=80"
                alt="Barber at work"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-bold text-xl">Мастерская Sergio Musel</p>
                <p className="text-gray-300 text-sm">Где рождается стиль</p>
              </div>
            </div>

            {/* Decorative frame */}
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-amber-500/30 rounded-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Booking Form Section
const Booking = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setIsError(false);

    const data = new FormData();
    data.append('access_key', ACCESS_KEY);
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('service', formData.service);
    data.append('date', formData.date);
    data.append('time', formData.time);
    data.append('message', formData.message);
    data.append('subject', `Новая запись от ${formData.name}`);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setFormData({
          name: '',
          phone: '',
          service: '',
          date: '',
          time: '',
          message: ''
        });
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    'Мужская стрижка',
    'Стрижка + борода',
    'Опасное бритье',
    'Уход за бородой',
    'Комплексный уход',
    'Детская стрижка'
  ];

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <section id="booking" className="py-20 md:py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="inline-block text-amber-500 font-semibold tracking-wider uppercase text-sm mb-4">
            Онлайн запись
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Запишитесь <span className="text-gold-gradient">сейчас</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Выберите удобное время и услугу. Мы свяжемся с вами для подтверждения записи.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 md:p-10"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <SafeIcon name="check" size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Заявка отправлена!</h3>
                  <p className="text-gray-400 mb-6">Мы свяжемся с вами в ближайшее время для подтверждения записи.</p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-amber-500 hover:text-amber-400 font-semibold"
                  >
                    Отправить еще одну заявку
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Ваше имя *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                        placeholder="Иван"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Телефон *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                        placeholder="+7 (999) 999-99-99"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Услуга *</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Выберите услугу</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Дата *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Время *</label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Выберите время</option>
                        {timeSlots.map((time, index) => (
                          <option key={index} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Комментарий</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                      placeholder="Особые пожелания или вопросы..."
                    />
                  </div>

                  {isError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
                      Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или позвоните нам.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-amber-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <SafeIcon name="loader" size={24} className="animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <SafeIcon name="calendar" size={24} />
                        Подтвердить запись
                      </>
                    )}
                  </button>

                  <p className="text-center text-gray-500 text-sm">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <SafeIcon name="clock" size={28} className="text-amber-500" />
                Режим работы
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Понедельник — Пятница</span>
                  <span className="text-white font-semibold">10:00 — 21:00</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Суббота</span>
                  <span className="text-white font-semibold">10:00 — 20:00</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400">Воскресенье</span>
                  <span className="text-amber-500 font-semibold">Выходной</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-600 to-amber-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <SafeIcon name="phone" size={28} />
                Срочная запись
              </h3>
              <p className="text-amber-100 mb-6">
                Нужна стрижка сегодня? Позвоните нам — постараемся найти свободное окно.
              </p>
              <a
                href="tel:+79991234567"
                className="inline-flex items-center gap-2 text-2xl font-bold hover:text-amber-100 transition-colors"
              >
                +7 (999) 123-45-67
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'Александр М.',
      text: 'Лучший барбершоп в городе! Мастера настоящие профи, атмосфера потрясающая. Хожу только сюда уже 3 года.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
    },
    {
      name: 'Дмитрий К.',
      text: 'Опасное бритье — это что-то невероятное. Никогда не думал, что бритье может быть таким приятным процессом. Рекомендую!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80'
    },
    {
      name: 'Максим В.',
      text: 'Отличное место для настоящих мужчин. Приятная музыка, хороший кофе, профессиональные мастера. Цены полностью оправданы качеством.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80'
    }
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 md:py-32 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="inline-block text-amber-500 font-semibold tracking-wider uppercase text-sm mb-4">
            Отзывы
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Что говорят <span className="text-gold-gradient">клиенты</span>
          </motion.h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 md:p-12 text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <SafeIcon key={i} name="star" size={24} className="text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed italic">
                "{testimonials[activeIndex].text}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-500"
                />
                <div className="text-left">
                  <p className="text-white font-bold">{testimonials[activeIndex].name}</p>
                  <p className="text-amber-500 text-sm">Постоянный клиент</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-gray-800 text-white hover:bg-amber-500 transition-colors"
            >
              <SafeIcon name="chevronLeft" size={24} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    index === activeIndex ? "bg-amber-500 w-8" : "bg-gray-700 hover:bg-gray-600"
                  )}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-gray-800 text-white hover:bg-amber-500 transition-colors"
            >
              <SafeIcon name="chevronRight" size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section with Map
const Contact = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [37.6173, 55.7558],
      zoom: 15,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    new maplibregl.Marker({ color: '#f59e0b' })
      .setLngLat([37.6173, 55.7558])
      .addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <section id="contact" className="py-20 md:py-32 bg-black relative">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="inline-block text-amber-500 font-semibold tracking-wider uppercase text-sm mb-4">
            Контакты
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Приходите в <span className="text-gold-gradient">гости</span>
          </motion.h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <SafeIcon name="mapPin" size={24} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Адрес</h3>
                  <p className="text-gray-400">г. Москва, ул. Барберская, 15<br />м. Тверская, м. Пушкинская</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <SafeIcon name="phone" size={24} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Телефон</h3>
                  <a href="tel:+79991234567" className="text-gray-400 hover:text-amber-500 transition-colors">+7 (999) 123-45-67</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <SafeIcon name="clock" size={24} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Режим работы</h3>
                  <p className="text-gray-400">Пн-Пт: 10:00 — 21:00<br />Сб: 10:00 — 20:00<br />Вс: Выходной</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Мы в соцсетях</h3>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-white hover:bg-amber-500 hover:text-white transition-all"
                >
                  <SafeIcon name="instagram" size={24} />
                </a>
                <a
                  href="https://wa.me/79991234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-white hover:bg-green-600 hover:text-white transition-all"
                >
                  <SafeIcon name="messageCircle" size={24} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full min-h-[400px] lg:min-h-0"
          >
            <div
              ref={mapContainer}
              className="w-full h-full min-h-[400px] lg:min-h-full rounded-2xl overflow-hidden border border-gray-800"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// WhatsApp Float Button
const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/79991234567"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-600/30 hover:scale-110 transition-transform"
    >
      <SafeIcon name="messageCircle" size={28} className="text-white" />
    </motion.a>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-900 py-12">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <SafeIcon name="scissors" size={32} className="text-amber-500" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight">SERGIO</span>
                <span className="text-xs text-amber-500 tracking-widest uppercase">MUSEL</span>
              </div>
            </div>
            <p className="text-gray-400 max-w-sm">
              Премиальный барбершоп для тех, кто ценит стиль и качество.
              Классические традиции в современном исполнении.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Навигация</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-gray-400 hover:text-amber-500 transition-colors">Услуги</a></li>
              <li><a href="#prices" className="text-gray-400 hover:text-amber-500 transition-colors">Цены</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-amber-500 transition-colors">Галерея</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-amber-500 transition-colors">О нас</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Контакты</h4>
            <ul className="space-y-2 text-gray-400">
              <li>г. Москва, ул. Барберская, 15</li>
              <li>+7 (999) 123-45-67</li>
              <li>info@sergiomusel.ru</li>
              <li>Пн-Сб: 10:00 — 21:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Sergio Musel Barbershop. Все права защищены.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-amber-500 text-sm transition-colors">Политика конфиденциальности</a>
            <a href="#" className="text-gray-500 hover:text-amber-500 text-sm transition-colors">Договор оферты</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main>
        <Hero />
        <Services />
        <Prices />
        <Gallery />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;