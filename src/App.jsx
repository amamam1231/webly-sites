import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Services data
const services = [
  {
    title: "Záchrana zubů",
    desc: "Endodontické ošetření kořenových kanálků s použitím nejmodernější technologie.",
    icon: "shield-check"
  },
  {
    title: "Dentální hygiena",
    desc: "Profesionální čištění, fluoridace a instruktáž správné techniky čištění.",
    icon: "sparkles"
  },
  {
    title: "Bělení zubů",
    desc: "Ordinační a domácí bělení pro zářivý úsměv s dlouhotrvajícím efektem.",
    icon: "star"
  },
  {
    title: "Implantáty",
    desc: "Nahrazení chybějících zubů kvalitními titanovými implantáty.",
    icon: "check"
  },
  {
    title: "Keramické korunky",
    desc: "Estetické korunky a můstky z prémiové keramiky.",
    icon: "heart"
  },
  {
    title: "Ortodoncie",
    desc: "Průhledná alignery a klasické rovnátka pro dokonalé zarovnání zubů.",
    icon: "sparkles"
  }
];

// Team data
const team = [
  {
    name: "MUDr. Anna Nováková",
    role: "Hlavní stomatoložka",
    desc: "15 let praxe, specializace na estetickou stomatologii a implantologie."
  },
  {
    name: "MUDr. Petr Svoboda",
    role: "Ortodontista",
    desc: "Expert na neviditelná rovnátka Invisalign a estetickou ortodoncii."
  },
  {
    name: "MDDr. Kateřina Dvořáková",
    role: "Dentální hygienistka",
    desc: "Specialistka na prevenci a péči o dětské pacienty."
  }
];

// Reviews data
const reviews = [
  {
    name: "Jan K.",
    text: "Naprosto profesionální přístup. Konečně jsem našel zubaře, u kterého se nemusím bát.",
    stars: 5
  },
  {
    name: "Marie S.",
    text: "Úžasná klinika! Dcera se konečně nebojí k zubaři chodit. Doporučuji všem rodičům.",
    stars: 5
  },
  {
    name: "Tomáš B.",
    text: "Implantáty dopadly perfektně. Cítím se jako s vlastními zuby. Děkuji!",
    stars: 5
  }
];

function App() {
  const [settings, setSettings] = useState({
    hero_title: "Váš úsměv, naše vášeň",
    hero_subtitle: "Moderní stomatologická péče v srdci Prahy. Špičková technologie, šetrný přístup, trvalé výsledky.",
    clinic_name: "DentCare Praha",
    contact_phone: "+420 123 456 789",
    contact_email: "info@dentcare-praha.cz",
    contact_address: "Václavské náměstí 123, Praha 1",
    working_hours: "Po-Pá: 8:00 - 20:00",
    primary_cta: "Objednat se online",
    secondary_cta: "Zavolejte nám",
    booking_enabled: true
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  // Fetch settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => console.log('Using default settings'));
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Map initialization
  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [14.4378, 50.0755],
        zoom: 15,
        attributionControl: false,
        dragRotate: false
      });

      mapRef.current.scrollZoom.disable();

      new maplibregl.Marker({ color: '#06b6d4' })
        .setLngLat([14.4378, 50.0755])
        .addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }

    setTimeout(() => setFormStatus('idle'), 3000);
  };

  // Scroll to section
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Microdata - LocalBusiness Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dentist",
          "name": settings.clinic_name,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": settings.contact_address,
            "addressLocality": "Praha",
            "addressCountry": "CZ"
          },
          "telephone": settings.contact_phone,
          "email": settings.contact_email,
          "openingHours": "Mo-Fr 08:00-20:00",
          "priceRange": "$$"
        })
      }} />

      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-black/90 backdrop-blur-md border-gray-900/50 py-3" : "bg-transparent border-transparent py-5"
      )}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SafeIcon name="tooth" size={32} className="text-cyan-400" />
            <span className="text-xl font-bold tracking-tight">{settings.clinic_name}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Služby', 'O nás', 'Tým', 'Recenze', 'Kontakt'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase().replace(' ', '-'))}
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            onClick={() => scrollTo('kontakt')}
            className="hidden md:flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105"
          >
            <SafeIcon name="calendar" size={18} />
            {settings.primary_cta}
          </button>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <SafeIcon name={isMobileMenuOpen ? 'x' : 'menu'} size={28} />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 border-t border-gray-900/50"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                {['Služby', 'O nás', 'Tým', 'Recenze', 'Kontakt'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollTo(item.toLowerCase().replace(' ', '-'))}
                    className="text-left text-gray-300 hover:text-cyan-400 py-2"
                  >
                    {item}
                  </button>
                ))}
                <button
                  onClick={() => scrollTo('kontakt')}
                  className="flex items-center justify-center gap-2 bg-cyan-500 text-slate-950 font-semibold px-5 py-3 rounded-full mt-2"
                >
                  <SafeIcon name="calendar" size={18} />
                  {settings.primary_cta}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium">
                Vítejte v Praze
              </span>
              <span className="flex items-center gap-1 text-yellow-400 text-sm">
                <SafeIcon name="star" size={16} />
                <span className="font-semibold">4.9</span>
                <span className="text-gray-400">(127 recenzí)</span>
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
              {settings.hero_title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="gradient-text">{settings.hero_title.split(' ').pop()}</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl">
              {settings.hero_subtitle}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo('kontakt')}
                className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-cyan-500/25"
              >
                <SafeIcon name="calendar" size={20} />
                {settings.primary_cta}
              </button>
              <button
                onClick={() => window.location.href = `tel:${settings.contact_phone}`}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all"
              >
                <SafeIcon name="phone" size={20} />
                {settings.secondary_cta}
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 flex items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <SafeIcon name="shield-check" size={18} className="text-cyan-400" />
                <span>Bez bolesti</span>
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon name="clock" size={18} className="text-cyan-400" />
                <span>Rychlé termíny</span>
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon name="star" size={18} className="text-cyan-400" />
                <span>Garance kvality</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="služby" className="py-24 bg-black">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-cyan-400 font-semibold mb-4">Naše služby</motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">Komplexní stomatologická péče</motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 max-w-2xl mx-auto">
              Nabízíme široké spektrum služeb od preventivní péče po složité rekonstrukce.
              Vždy s důrazem na vaše pohodlí a zdravý úsměv.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group p-8 rounded-2xl bg-slate-900/50 border border-gray-800 hover:border-cyan-500/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                  <SafeIcon name={service.icon} size={28} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="o-nás" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-cyan-400 font-semibold mb-4">O naší klinice</motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">
                Moderní technologie, lidský přístup
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-400 mb-6 leading-relaxed">
                DentCare Praha je moderní stomatologická klinika v centru Prahy, která kombinuje
                nejnovější technologie s osobním přístupem k pacientům. Naším cílem je poskytovat
                prvotřídní péči v příjemném a uvolněném prostředí.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-gray-400 mb-8 leading-relaxed">
                Specializujeme se na estetickou stomatologii, implantologii a komplexní péči
                o celou rodinu. Díky digitálním technologiím a šetrným metodám jsou naše
                ošetření rychlejší, přesnější a bezbolestná.
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-800">
                  <div className="text-3xl font-black text-cyan-400 mb-1">15+</div>
                  <div className="text-sm text-gray-400">Let zkušeností</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-800">
                  <div className="text-3xl font-black text-cyan-400 mb-1">5000+</div>
                  <div className="text-sm text-gray-400">Spokojených pacientů</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-800">
                  <div className="text-3xl font-black text-cyan-400 mb-1">99%</div>
                  <div className="text-sm text-gray-400">Úspěšnost léčby</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-gray-800">
                  <div className="text-3xl font-black text-cyan-400 mb-1">100%</div>
                  <div className="text-sm text-gray-400">Sterilita prostředí</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80"
                  alt="Moderní zubní ordinace"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl bg-cyan-500 shadow-xl">
                <div className="flex items-center gap-3 text-slate-950">
                  <SafeIcon name="shield-check" size={32} />
                  <div>
                    <div className="font-bold">Certifikovaná</div>
                    <div className="text-sm opacity-80">klinika</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="tým" className="py-24 bg-black">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-cyan-400 font-semibold mb-4">Náš tým</motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">Setkáte se s profesionály</motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group text-center"
              >
                <div className="relative mb-6 mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-cyan-500/30 group-hover:border-cyan-500 transition-colors">
                  <img
                    src={`https://images.unsplash.com/photo-${index === 0 ? '1559839734-2b71ea197ec2' : index === 1 ? '1612349317150-bd4158d33ca0' : '1594824476967-48c8b964273f'}?w=400&q=80`}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-cyan-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">{member.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reviews */}
      <section id="recenze" className="py-24 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-cyan-400 font-semibold mb-4">Recenze</motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">Co říkají naši pacienti</motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-slate-900/50 border border-gray-800"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.stars)].map((_, i) => (
                    <SafeIcon key={i} name="star" size={20} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <span className="font-semibold">{review.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="kontakt" className="py-24 bg-black">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-cyan-400 font-semibold mb-4">Kontakt</motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">Objednejte se ještě dnes</motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-400 mb-8">
                Vyplňte formulář a my se vám ozveme do 24 hodin. Nebo nás kontaktujte přímo.
              </motion.p>

              <motion.div variants={fadeInUp} className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <SafeIcon name="map-pin" size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Adresa</div>
                    <div className="font-semibold">{settings.contact_address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <SafeIcon name="phone" size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Telefon</div>
                    <a href={`tel:${settings.contact_phone}`} className="font-semibold hover:text-cyan-400 transition-colors">
                      {settings.contact_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <SafeIcon name="mail" size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <a href={`mailto:${settings.contact_email}`} className="font-semibold hover:text-cyan-400 transition-colors">
                      {settings.contact_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <SafeIcon name="clock" size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Otevírací doba</div>
                    <div className="font-semibold">{settings.working_hours}</div>
                  </div>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div variants={fadeInUp} className="rounded-2xl overflow-hidden h-64 border border-gray-800">
                <div ref={mapContainer} className="w-full h-full" />
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-900/50 border border-gray-800">
                <h3 className="text-2xl font-bold mb-6">Online rezervace</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Jméno a příjmení</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 focus:border-cyan-500 focus:outline-none transition-colors text-white"
                      placeholder="Jan Novák"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Telefon</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 focus:border-cyan-500 focus:outline-none transition-colors text-white"
                      placeholder="+420 123 456 789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 focus:border-cyan-500 focus:outline-none transition-colors text-white"
                      placeholder="jan@email.cz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Vaše zpráva</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 focus:border-cyan-500 focus:outline-none transition-colors text-white resize-none"
                      placeholder="Popište svůj problém nebo požadovaný termín..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 text-slate-950 font-bold px-8 py-4 rounded-xl text-lg transition-all"
                  >
                    {formStatus === 'submitting' ? (
                      <span>Odesílání...</span>
                    ) : formStatus === 'success' ? (
                      <>
                        <SafeIcon name="check" size={20} />
                        <span>Odesláno!</span>
                      </>
                    ) : (
                      <>
                        <SafeIcon name="arrow-right" size={20} />
                        <span>Odeslat poptávku</span>
                      </>
                    )}
                  </button>

                  {formStatus === 'error' && (
                    <p className="text-red-400 text-sm text-center">Chyba při odesílání. Zkuste to prosím znovu.</p>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-900 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <SafeIcon name="tooth" size={24} className="text-cyan-400" />
              <span className="font-bold">{settings.clinic_name}</span>
            </div>

            <div className="text-sm text-gray-400">
              © 2024 {settings.clinic_name}. Všechna práva vyhrazena.
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">GDPR</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;