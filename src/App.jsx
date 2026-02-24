import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const icons = {
  menu: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  ),
  x: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  ),
  phone: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  mail: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  mapPin: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  clock: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  check: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>
  ),
  star: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill={props.fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  chevronLeft: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
  ),
  chevronRight: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
  ),
  tooth: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 2 4s2 3 2 5v3c0 1.5 1.5 2.5 2 2.5s2-1 2-2.5v-3c0-2 1-4 2-5s2-2.5 2-4c0-3.5-2.5-6-6-6z"/><path d="M12 2v20"/></svg>
  ),
  shield: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  award: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
  ),
  heart: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill={props.fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  send: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>
  ),
  calendar: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  ),
  globe: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  )
}

// Language content
const content = {
  cs: {
    nav: { home: 'Úvod', services: 'Služby', doctors: 'Lékaři', reviews: 'Recenze', contact: 'Kontakt', book: 'Objednat se' },
    hero: {
      title: 'Váš úsměv v nejlepších rukou',
      subtitle: 'Moderní zubní ordinace v centru Prahy s evropskými standardy péče',
      cta: 'Bezplatná konzultace',
      ctaSub: 'Rezervujte si termín online'
    },
    services: {
      title: 'Naše služby',
      subtitle: 'Komplexní stomatologická péče podle nejvyšších standardů',
      items: [
        { title: 'Preventivní péče', desc: 'Pravidelné prohlídky, profesionální čištění a fluoridace' },
        { title: 'Estetická stomatologie', desc: 'Bělení zubů, keramické fazety a kompozitní výplně' },
        { title: 'Protetika', desc: 'Korunky, můstky a náhrady zubů značkových materiálů' },
        { title: 'Implantologie', desc: 'Zubní implantáty švýcarské kvality s doživotní zárukou' },
        { title: 'Ortodoncie', desc: 'Neviditelná alignery a klasické rovnátka pro děti i dospělé' },
        { title: 'Dětská stomatologie', desc: 'Šetrná péče o dětský chrup v přátelském prostředí' }
      ]
    },
    trust: {
      title: 'Proč si nás vybrat',
      subtitle: 'Evropské standardy kvality a transparentní přístup',
      items: [
        { title: 'Certifikovaní specialisté', desc: 'Naši lékaři absolvovali školení v Německu a Švýcarsku' },
        { title: 'Transparentní ceny', desc: 'Žádné skryté poplatky - cenu znáte předem' },
        { title: 'Moderní technologie', desc: '3D rentgen, digitální skeny a CAD/CAM technologie' }
      ],
      badge: 'ISO 9001 Certified'
    },
    doctors: {
      title: 'Náš tým',
      subtitle: 'Zkušení odborníci s lidským přístupem',
      cta: 'Rezervovat konzultaci'
    },
    reviews: {
      title: 'Co říkají naši pacienti',
      subtitle: 'Přes 2000 spokojených pacientů ročně'
    },
    contact: {
      title: 'Kontaktujte nás',
      subtitle: 'Jsme tu pro váš dokonalý úsměv',
      form: {
        name: 'Jméno a příjmení',
        phone: 'Telefon',
        email: 'Email',
        service: 'Vyberte službu',
        message: 'Vaše zpráva',
        submit: 'Odeslat poptávku',
        success: 'Děkujeme! Brzy se vám ozveme.',
        services: ['Preventivní péče', 'Estetická stomatologie', 'Implantologie', 'Ortodoncie', 'Jiné']
      },
      info: {
        address: 'Václavské náměstí 123, Praha 1',
        hours: 'Po-Pá: 8:00 - 20:00, So: 9:00 - 14:00',
        phone: '+420 123 456 789',
        email: 'info@dentalcare.cz'
      }
    },
    footer: {
      rights: 'Všechna práva vyhrazena',
      privacy: 'Ochrana osobních údajů',
      terms: 'Obchodní podmínky'
    }
  },
  en: {
    nav: { home: 'Home', services: 'Services', doctors: 'Doctors', reviews: 'Reviews', contact: 'Contact', book: 'Book Now' },
    hero: {
      title: 'Your Smile in the Best Hands',
      subtitle: 'Modern dental clinic in the center of Prague with European standards of care',
      cta: 'Free Consultation',
      ctaSub: 'Book your appointment online'
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive dental care according to the highest standards',
      items: [
        { title: 'Preventive Care', desc: 'Regular check-ups, professional cleaning and fluoride treatment' },
        { title: 'Cosmetic Dentistry', desc: 'Teeth whitening, ceramic veneers and composite fillings' },
        { title: 'Prosthodontics', desc: 'Crowns, bridges and tooth replacements from premium materials' },
        { title: 'Implantology', desc: 'Swiss quality dental implants with lifetime warranty' },
        { title: 'Orthodontics', desc: 'Invisible aligners and traditional braces for children and adults' },
        { title: 'Pediatric Dentistry', desc: 'Gentle care for children teeth in a friendly environment' }
      ]
    },
    trust: {
      title: 'Why Choose Us',
      subtitle: 'European quality standards and transparent approach',
      items: [
        { title: 'Certified Specialists', desc: 'Our doctors trained in Germany and Switzerland' },
        { title: 'Transparent Pricing', desc: 'No hidden fees - you know the price in advance' },
        { title: 'Modern Technology', desc: '3D X-ray, digital scans and CAD/CAM technology' }
      ],
      badge: 'ISO 9001 Certified'
    },
    doctors: {
      title: 'Our Team',
      subtitle: 'Experienced professionals with human approach',
      cta: 'Book Consultation'
    },
    reviews: {
      title: 'What Our Patients Say',
      subtitle: 'Over 2000 satisfied patients annually'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'We are here for your perfect smile',
      form: {
        name: 'Full Name',
        phone: 'Phone',
        email: 'Email',
        service: 'Select Service',
        message: 'Your Message',
        submit: 'Send Inquiry',
        success: 'Thank you! We will contact you soon.',
        services: ['Preventive Care', 'Cosmetic Dentistry', 'Implantology', 'Orthodontics', 'Other']
      },
      info: {
        address: 'Wenceslas Square 123, Prague 1',
        hours: 'Mon-Fri: 8:00 - 20:00, Sat: 9:00 - 14:00',
        phone: '+420 123 456 789',
        email: 'info@dentalcare.cz'
      }
    },
    footer: {
      rights: 'All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    }
  }
}

// Doctors data
const doctors = [
  {
    name: 'Dr. Petra Nováková',
    role: 'Chief Dentist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
    desc: '15 let zkušeností v implantologii'
  },
  {
    name: 'Dr. Jan Svoboda',
    role: 'Orthodontist',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80',
    desc: 'Specialista na neviditelná rovnátka'
  },
  {
    name: 'Dr. Eva Kovářová',
    role: 'Pediatric Dentist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80',
    desc: 'Dětská stomatologie s láskou'
  }
]

// Reviews data
const reviews = [
  {
    name: 'Marie K.',
    text: 'Naprosto profesionální přístup, konečně jsem našla zubní ordinaci, kam se nebojím chodit. Bezbolestná léčba a milý personál.',
    rating: 5
  },
  {
    name: 'Tomáš B.',
    text: 'Skvělé zkušenosti s implantáty. Cena byla dopředu jasná, žádné překvapení. Doporučuji všem.',
    rating: 5
  },
  {
    name: 'Anna M.',
    text: 'Dcera se už nebojí zubaře! Dětská ordinace je krásně vybavená a paní doktorka má trpělivost anděla.',
    rating: 5
  },
  {
    name: 'David L.',
    text: 'Bělení zubů proběhlo perfektně, výsledek je přirozený. Moderní vybavení a čisté prostředí.',
    rating: 5
  }
]

// Animated Section Component
function AnimatedSection({ children, className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [lang, setLang] = useState('cs')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentReview, setCurrentReview] = useState(0)
  const [formState, setFormState] = useState({ isSubmitting: false, isSuccess: false, isError: false })
  const [scrolled, setScrolled] = useState(false)
  const mapContainer = useRef(null)
  const map = useRef(null)

  const t = content[lang]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [14.4241, 50.0806],
        zoom: 15,
        attributionControl: false
      })

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

      new maplibregl.Marker({ color: '#0ea5e9' })
        .setLngLat([14.4241, 50.0806])
        .addTo(map.current)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState({ isSubmitting: true, isSuccess: false, isError: false })

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setFormState({ isSubmitting: false, isSuccess: true, isError: false })
        e.target.reset()
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      setFormState({ isSubmitting: false, isSuccess: false, isError: true })
    }
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
                <SafeIcon name="tooth" size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Dental Care</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {Object.entries(t.nav).slice(0, 5).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => scrollToSection(key === 'home' ? 'hero' : key)}
                  className="text-slate-600 hover:text-sky-600 font-medium transition-colors"
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setLang(lang === 'cs' ? 'en' : 'cs')}
                className="flex items-center gap-1 text-slate-600 hover:text-sky-600 font-medium"
              >
                <SafeIcon name="globe" size={18} />
                {lang.toUpperCase()}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
              >
                {t.nav.book}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700"
            >
              <SafeIcon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-4 py-4 space-y-3">
                {Object.entries(t.nav).slice(0, 5).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => scrollToSection(key === 'home' ? 'hero' : key)}
                    className="block w-full text-left py-2 text-slate-700 font-medium"
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => setLang(lang === 'cs' ? 'en' : 'cs')}
                  className="flex items-center gap-2 py-2 text-slate-700 font-medium"
                >
                  <SafeIcon name="globe" size={18} />
                  {lang === 'cs' ? 'English' : 'Čeština'}
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold mt-2"
                >
                  {t.nav.book}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-orange-50" />
        <div className="absolute top-20 right-0 w-1/2 h-full opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0ea5e9_0%,_transparent_50%)]" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <SafeIcon name="shield" size={16} />
                ISO 9001 Certified
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">
                {t.hero.title}
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-sky-500/30 flex items-center justify-center gap-2"
                >
                  <SafeIcon name="calendar" size={20} />
                  {t.hero.cta}
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full font-bold text-lg transition-all"
                >
                  {t.hero.ctaSub}
                </button>
              </div>
            </AnimatedSection>

            <AnimatedSection className="relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-sky-200 to-orange-200 rounded-[2rem] blur-2xl opacity-30" />
                <img
                  src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80"
                  alt="Dental Clinic"
                  className="relative rounded-[2rem] shadow-2xl w-full object-cover h-[500px]"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <SafeIcon key={i} name="star" size={16} className="text-yellow-400" fill="currentColor" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900">4.9/5</span>
                  </div>
                  <p className="text-sm text-slate-600">2000+ spokojených pacientů</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{t.services.title}</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">{t.services.subtitle}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.services.items.map((service, idx) => (
              <AnimatedSection key={idx} className="group">
                <div className="bg-slate-50 rounded-2xl p-8 h-full border border-slate-100 hover:border-sky-200 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sky-500 transition-colors">
                    <SafeIcon name="tooth" size={28} className="text-sky-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{service.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
            >
              {t.nav.book}
            </button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.trust.title}</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">{t.trust.subtitle}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {t.trust.items.map((item, idx) => (
              <AnimatedSection key={idx} className="text-center">
                <div className="w-20 h-20 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SafeIcon name={idx === 0 ? 'award' : idx === 1 ? 'check' : 'shield'} size={32} className="text-sky-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full border border-white/20">
              <SafeIcon name="award" size={24} className="text-orange-400" />
              <span className="font-semibold">{t.trust.badge}</span>
              <SafeIcon name="check" size={20} className="text-green-400" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-24 bg-sky-50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{t.doctors.title}</h2>
            <p className="text-xl text-slate-600">{t.doctors.subtitle}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doctor, idx) => (
              <AnimatedSection key={idx} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
                      <p className="text-sky-300 font-medium">{doctor.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-600 mb-4">{doctor.desc}</p>
                    <button
                      onClick={() => scrollToSection('contact')}
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-full font-semibold transition-colors"
                    >
                      {t.doctors.cta}
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{t.reviews.title}</h2>
            <p className="text-xl text-slate-600">{t.reviews.subtitle}</p>
          </AnimatedSection>

          <AnimatedSection className="max-w-4xl mx-auto">
            <div className="relative bg-slate-50 rounded-3xl p-8 md:p-12">
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-6">
                  {[1,2,3,4,5].map(i => (
                    <SafeIcon key={i} name="star" size={24} className="text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl text-slate-700 italic mb-6 leading-relaxed">
                  "{reviews[currentReview].text}"
                </p>
                <p className="font-bold text-slate-900 text-lg">{reviews[currentReview].name}</p>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentReview(prev => prev === 0 ? reviews.length - 1 : prev - 1)}
                  className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-sky-50 transition-colors"
                >
                  <SafeIcon name="chevronLeft" size={20} className="text-slate-600" />
                </button>
                <div className="flex gap-2 items-center">
                  {reviews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentReview(idx)}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all",
                        currentReview === idx ? "bg-sky-500 w-8" : "bg-slate-300"
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentReview(prev => prev === reviews.length - 1 ? 0 : prev + 1)}
                  className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-sky-50 transition-colors"
                >
                  <SafeIcon name="chevronRight" size={20} className="text-slate-600" />
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <AnimatedSection>
              <h2 className="text-4xl md:text-5xl font-black mb-4">{t.contact.title}</h2>
              <p className="text-xl text-slate-300 mb-12">{t.contact.subtitle}</p>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="mapPin" size={24} className="text-sky-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Adresa</h4>
                    <p className="text-slate-400">{t.contact.info.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="clock" size={24} className="text-sky-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Otevírací doba</h4>
                    <p className="text-slate-400">{t.contact.info.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="phone" size={24} className="text-sky-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Telefon</h4>
                    <p className="text-slate-400">{t.contact.info.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="mail" size={24} className="text-sky-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Email</h4>
                    <p className="text-slate-400">{t.contact.info.email}</p>
                  </div>
                </div>
              </div>

              <div ref={mapContainer} className="w-full h-64 rounded-2xl overflow-hidden" />
            </AnimatedSection>

            <AnimatedSection>
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 text-slate-900">
                <h3 className="text-2xl font-bold mb-6">{t.nav.book}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t.contact.form.name}</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                      placeholder="Jan Novák"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t.contact.form.phone}</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                        placeholder="+420 123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t.contact.form.email}</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                        placeholder="jan@example.cz"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t.contact.form.service}</label>
                    <select
                      name="service"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                    >
                      {t.contact.form.services.map((service, idx) => (
                        <option key={idx} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t.contact.form.message}</label>
                    <textarea
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all resize-none"
                      placeholder="Popište váš požadavek..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                  >
                    {formState.isSubmitting ? (
                      <span>Odesílání...</span>
                    ) : (
                      <>
                        <SafeIcon name="send" size={20} />
                        {t.contact.form.submit}
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {formState.isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-4 bg-green-100 text-green-700 rounded-xl text-center"
                    >
                      {t.contact.form.success}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
                  <SafeIcon name="tooth" size={24} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">Dental Care</span>
              </div>
              <p className="text-sm">Moderní zubní ordinace v centru Prahy s důrazem na kvalitu a pohodlí pacienta.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Služby</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-sky-400 transition-colors">Preventivní péče</a></li>
                <li><a href="#services" className="hover:text-sky-400 transition-colors">Estetická stomatologie</a></li>
                <li><a href="#services" className="hover:text-sky-400 transition-colors">Implantologie</a></li>
                <li><a href="#services" className="hover:text-sky-400 transition-colors">Ortodoncie</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-sm">
                <li>Václavské náměstí 123</li>
                <li>Praha 1, 110 00</li>
                <li>+420 123 456 789</li>
                <li>info@dentalcare.cz</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Sledujte nás</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors">
                  <span className="text-white font-bold">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors">
                  <span className="text-white font-bold">ig</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2024 Dental Care Prague. {t.footer.rights}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
              <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App