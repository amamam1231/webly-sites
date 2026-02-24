import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// Services data
const services = [
  {
    icon: 'tooth',
    title: 'Dentální implantáty',
    description: 'Permanentní řešení chybějících zubů s garantovanou životností. Používáme švýcarské implantáty Straumann.',
    price: 'od 25 000 Kč'
  },
  {
    icon: 'sparkles',
    title: 'Profesionální bělení',
    description: 'Laserové bělení zubů s okamžitým výsledkem. O světlejší úsměv až o 8 odstínů.',
    price: 'od 8 000 Kč'
  },
  {
    icon: 'heart',
    title: 'Estetická stomatologie',
    description: 'Porcelánové fazety, keramické korunky a kompozitní výplně pro dokonalý úsměv.',
    price: 'od 12 000 Kč'
  },
  {
    icon: 'shield-check',
    title: 'Ortodoncie',
    description: 'Neviditelná alignery Invisalign a keramické rovnátka pro dospělé.',
    price: 'od 45 000 Kč'
  },
  {
    icon: 'award',
    title: 'Dětská stomatologie',
    description: 'Šetrná péče o dětské zuby v přátelském prostředí s dětským koutkem.',
    price: 'od 500 Kč'
  },
  {
    icon: 'check-circle',
    title: 'Endodoncie',
    description: 'Odborné ošetření kořenových kanálků pod mikroskopem s vysokou úspěšností.',
    price: 'od 6 000 Kč'
  }
]

// Doctors data
const doctors = [
  {
    name: 'MDDr. Jan Novák',
    role: 'Chief Dental Surgeon',
    specialization: 'Implantologie, chirurgie',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
    certificates: ['Straumann Certified', 'ITI Fellow']
  },
  {
    name: 'MDDr. Petra Svobodová',
    role: 'Orthodontist',
    specialization: 'Ortodoncie, estetika',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80',
    certificates: ['Invisalign Provider', 'ESO Member']
  },
  {
    name: 'MDDr. Tomáš Černý',
    role: 'Endodontist',
    specialization: 'Endodoncie, mikroskopická léčba',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80',
    certificates: ['ESE Certified', 'Microscopic Dentistry']
  }
]

// Reviews data
const reviews = [
  {
    name: 'Anna K.',
    text: 'Naprosto skvělá zkušenost! Konečně jsem našla zubní ordinaci, kde se necítím jako v mučírně. Implantly dopadly perfektně.',
    rating: 5,
    date: 'před 2 týdny'
  },
  {
    name: 'Martin P.',
    text: 'Profesionální přístup, moderní vybavení a příjemný personál. Bělení zubů trvalo hodinu a výsledek je úžasný.',
    rating: 5,
    date: 'před měsícem'
  },
  {
    name: 'Jana M.',
    text: 'Dcera se konečně nebojí k zubaři. Dětský koutek a trpělivý přístor paní doktorky jsou k nezaplacení.',
    rating: 5,
    date: 'před 2 měsíci'
  }
]

// Gallery data
const gallery = [
  {
    before: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80',
    title: 'Rekonstrukce úsměvu'
  },
  {
    before: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&q=80',
    title: 'Profesionální bělení'
  },
  {
    before: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80',
    title: 'Porcelánové fazety'
  }
]

function App() {
  const [lang, setLang] = useState('cz')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [callbackTime, setCallbackTime] = useState(15)
  const [currentReview, setCurrentReview] = useState(0)
  const [formState, setFormState] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const mapContainer = useRef(null)
  const map = useRef(null)

  // Callback timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallbackTime(prev => prev > 0 ? prev - 1 : 15)
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Map initialization
  useEffect(() => {
    if (map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [14.4378, 50.0755],
      zoom: 14,
      attributionControl: false
    })

    map.current.on('load', () => {
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

      new maplibregl.Marker({ color: '#2563eb' })
        .setLngLat([14.4378, 50.0755])
        .setPopup(new maplibregl.Popup().setHTML('<h3 class="font-bold">Prague Dental Clinic</h3><p>Václavské náměstí 1</p>'))
        .addTo(map.current)
    })

    return () => map.current?.remove()
  }, [])

  // Scroll handler
  const scrollTo = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          created_at: new Date().toISOString()
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormState({ name: '', phone: '', email: '', service: '', message: '' })
        setTimeout(() => setSubmitStatus(null), 5000)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      // Fallback to web3forms if API not available
      const formData = new FormData()
      formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY')
      formData.append('name', formState.name)
      formData.append('phone', formState.phone)
      formData.append('email', formState.email)
      formData.append('message', `Service: ${formState.service}\n\n${formState.message}`)

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        })
        if (res.ok) {
          setSubmitStatus('success')
          setFormState({ name: '', phone: '', email: '', service: '', message: '' })
          setTimeout(() => setSubmitStatus(null), 5000)
        } else {
          setSubmitStatus('error')
        }
      } catch {
        setSubmitStatus('error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Translations
  const t = {
    cz: {
      nav: { services: 'Služby', doctors: 'Lékaři', gallery: 'Galerie', reviews: 'Recenze', contact: 'Kontakt' },
      hero: {
        badge: '15 let zkušeností v Praze',
        title: 'Váš dokonalý úsměv začíná zde',
        subtitle: 'Moderní stomatologická klinika v srdci Prahy. Švýcarská kvalita, česká cena. Bezplatná konzultace.',
        cta: 'Zarezervovat konzultaci',
        ctaSecondary: 'Naše služby',
        trust: '5000+ spokojených pacientů'
      },
      callback: 'Zavoláme zpět za'
    },
    en: {
      nav: { services: 'Services', doctors: 'Doctors', gallery: 'Gallery', reviews: 'Reviews', contact: 'Contact' },
      hero: {
        badge: '15 years in Prague',
        title: 'Your perfect smile starts here',
        subtitle: 'Modern dental clinic in the heart of Prague. Swiss quality, Czech prices. Free consultation.',
        cta: 'Book consultation',
        ctaSecondary: 'Our services',
        trust: '5000+ happy patients'
      },
      callback: 'Callback in'
    }
  }

  const currentT = t[lang]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <SafeIcon name="tooth" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-xl text-slate-900">Prague Dental</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Est. 2009</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {Object.entries(currentT.nav).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => scrollTo(key)}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-4">
              {/* Callback timer */}
              <div className="hidden lg:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                <SafeIcon name="clock" size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {currentT.callback} {callbackTime} min
                </span>
              </div>

              {/* Language switcher */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setLang('cz')}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm font-medium transition-all",
                    lang === 'cz' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  CZ
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm font-medium transition-all",
                    lang === 'en' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  EN
                </button>
              </div>

              {/* Phone CTA - Desktop */}
              <a href="tel:+420777888999" className="hidden md:flex items-center gap-2 btn-primary text-sm py-2.5">
                <SafeIcon name="phone" size={16} />
                +420 777 888 999
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              >
                <SafeIcon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-200"
            >
              <div className="px-4 py-4 space-y-2">
                {Object.entries(currentT.nav).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => scrollTo(key)}
                    className="block w-full text-left px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {label}
                  </button>
                ))}
                <a href="tel:+420777888999" className="flex items-center gap-2 px-4 py-3 text-blue-600 font-medium">
                  <SafeIcon name="phone" size={20} />
                  +420 777 888 999
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 mb-6">
                <SafeIcon name="award" size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-slate-700">{currentT.hero.badge}</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                {currentT.hero.title}
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                {currentT.hero.subtitle}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <button onClick={() => scrollTo('contact')} className="btn-primary flex items-center justify-center gap-2">
                  {currentT.hero.cta}
                  <SafeIcon name="arrow-right" size={20} />
                </button>
                <button onClick={() => scrollTo('services')} className="btn-secondary">
                  {currentT.hero.ctaSecondary}
                </button>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-4 justify-center lg:justify-start text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white" />
                  ))}
                </div>
                <span>{currentT.hero.trust}</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80"
                  alt="Modern dental clinic"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <SafeIcon name="check-circle" size={24} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">98%</p>
                      <p className="text-xs text-slate-500">Úspěšnost</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
                  className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <SafeIcon key={i} name="star" size={16} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900">4.9</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Hodnocení na Google</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: 'shield-check', label: 'Certifikovaní specialisté', value: 'ISO 9001' },
              { icon: 'award', label: 'Švýcarské implantáty', value: 'Straumann' },
              { icon: 'clock', label: 'Otevřeno', value: 'Po-Pá 8-18' },
              { icon: 'heart', label: 'Záruka', value: '10 let' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <SafeIcon name={item.icon} size={32} className="text-blue-600" />
                <p className="font-bold text-slate-900">{item.value}</p>
                <p className="text-sm text-slate-500">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Naše služby
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              Komplexní stomatologická péče pod jednou střechou. Od prevence po komplexní rekonstrukce.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <SafeIcon name={service.icon} size={28} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-blue-600 font-bold">{service.price}</span>
                  <button className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                    Více info
                    <SafeIcon name="arrow-right" size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-20 md:py-32 bg-slate-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Náš tým specialistů
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
              Zkušení lékaři s mezinárodními certifikacemi a praxí z prestižních klinik.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {doctors.map((doctor, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group relative bg-slate-800 rounded-3xl overflow-hidden"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl font-bold mb-1">{doctor.name}</h3>
                  <p className="text-blue-400 font-medium mb-1">{doctor.role}</p>
                  <p className="text-slate-300 text-sm mb-3">{doctor.specialization}</p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.certificates.map((cert, cidx) => (
                      <span key={cidx} className="text-xs bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Před a Po
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              Reálné výsledky našich pacientů. Estetická stomatologie a rekonstrukce úsměvu.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {gallery.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-4"
              >
                <div className="relative group rounded-2xl overflow-hidden shadow-lg">
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      <img src={item.before} alt="Before" className="w-full h-48 object-cover" />
                      <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">Před</span>
                    </div>
                    <div className="relative">
                      <img src={item.after} alt="After" className="w-full h-48 object-cover" />
                      <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Po</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 text-center">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 md:py-32 bg-blue-50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Co říkají naši pacienti
            </motion.h2>
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-1">
              {[1,2,3,4,5].map(i => (
                <SafeIcon key={i} name="star" size={24} className="text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2 font-bold text-slate-900">4.9/5</span>
              <span className="text-slate-500">(127 recenzí)</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <div className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReview}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(reviews[currentReview].rating)].map((_, i) => (
                      <SafeIcon key={i} name="star" size={20} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-xl md:text-2xl text-slate-700 mb-6 leading-relaxed">
                    "{reviews[currentReview].text}"
                  </blockquote>
                  <div>
                    <p className="font-bold text-slate-900">{reviews[currentReview].name}</p>
                    <p className="text-sm text-slate-500">{reviews[currentReview].date}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentReview(prev => prev === 0 ? reviews.length - 1 : prev - 1)}
                  className="p-2 rounded-full border border-slate-200 hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  <SafeIcon name="chevron-left" size={24} />
                </button>
                <div className="flex items-center gap-2">
                  {reviews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentReview(idx)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        currentReview === idx ? "bg-blue-600 w-6" : "bg-slate-300 hover:bg-slate-400"
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentReview(prev => prev === reviews.length - 1 ? 0 : prev + 1)}
                  className="p-2 rounded-full border border-slate-200 hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  <SafeIcon name="chevron-right" size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Domluvte si konzultaci
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-600 mb-8">
                První konzultace je zdarma. Zavolejte nám nebo vyplňte formulář a my se vám ozveme do 30 minut.
              </motion.p>

              <motion.div variants={staggerContainer} className="space-y-6 mb-8">
                {[
                  { icon: 'phone', label: 'Telefon', value: '+420 777 888 999', href: 'tel:+420777888999' },
                  { icon: 'mail', label: 'Email', value: 'info@praha-dent.cz', href: 'mailto:info@praha-dent.cz' },
                  { icon: 'map-pin', label: 'Adresa', value: 'Václavské náměstí 1, Praha 1', href: '#' },
                  { icon: 'clock', label: 'Otevírací doba', value: 'Po-Pá: 8:00 - 18:00', href: '#' }
                ].map((item, idx) => (
                  <motion.a
                    key={idx}
                    variants={fadeInUp}
                    href={item.href}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <SafeIcon name={item.icon} size={24} className="text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </motion.div>

              {/* Map */}
              <motion.div
                variants={fadeInUp}
                ref={mapContainer}
                className="h-64 rounded-2xl overflow-hidden shadow-lg border border-slate-200"
              />
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-slate-200">
                <h3 classForm="font-serif text-2xl font-bold text-slate-900 mb-6">Kontaktní formulář</h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Jméno a příjmení *</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="Jan Novák"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Telefon *</label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({...formState, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="+420 777 888 999"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      placeholder="jan@example.cz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Zájem o službu</label>
                    <select
                      value={formState.service}
                      onChange={(e) => setFormState({...formState, service: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                    >
                      <option value="">Vyberte službu</option>
                      <option value="implants">Dentální implantáty</option>
                      <option value="whitening">Bělení zubů</option>
                      <option value="aesthetic">Estetická stomatologie</option>
                      <option value="orthodontics">Ortodoncie</option>
                      <option value="children">Dětská stomatologie</option>
                      <option value="endodontics">Endodoncie</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Zpráva</label>
                    <textarea
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                      placeholder="Popište váš problém nebo přání..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Odesílání...
                      </>
                    ) : (
                      <>
                        Odeslat poptávku
                        <SafeIcon name="send" size={20} />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-green-50 text-green-800 rounded-xl flex items-center gap-2"
                      >
                        <SafeIcon name="check-circle" size={20} />
                        Děkujeme! Ozveme se vám do 30 minut.
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-red-50 text-red-800 rounded-xl"
                      >
                        Něco se pokazilo. Zavolejte nám prosím přímo.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <SafeIcon name="tooth" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl">Prague Dental</h3>
                </div>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                Moderní stomatologická klinika v centru Prahy s 15 lety zkušeností.
                Poskytujeme komplexní dentální péči na nejvyšší úrovni.
              </p>
              <div className="flex gap-4">
                {['facebook', 'instagram', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <span className="capitalize text-sm">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Služby</h4>
              <ul className="space-y-2 text-slate-400">
                {services.slice(0, 4).map((service, idx) => (
                  <li key={idx}>
                    <button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">
                      {service.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Václavské náměstí 1</li>
                <li>Praha 1, 110 00</li>
                <li>+420 777 888 999</li>
                <li>info@praha-dent.cz</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 Prague Dental Clinic. Všechna práva vyhrazena.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Ochrana osobních údajů</a>
              <a href="#" className="hover:text-white transition-colors">Podmínky použití</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App