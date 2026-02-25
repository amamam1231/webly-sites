import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { SafeIcon } from './components/SafeIcon.jsx'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'

const translations = {
  cs: {
    nav: { home: 'Úvod', services: 'Služby', doctors: 'Lékaři', reviews: 'Recenze', contact: 'Kontakt', book: 'Objednat se' },
    hero: {
      badge: 'Vítejte v Dental Care Prague',
      title: 'Váš úsměv je naší',
      titleAccent: 'předností',
      subtitle: 'Moderní stomatologická klinika v centru Prahy s týmem zkušených specialistů, nejnovější technologií a individuálním přístupem ke každému pacientovi.',
      ctaPrimary: 'Objednat se online',
      ctaSecondary: 'Naše služby'
    },
    services: {
      title: 'Naše služby',
      subtitle: 'Komplexní péče o váš úsměv pod jednou střechou',
      items: [
        { icon: 'sparkles', title: 'Dentální hygiena', desc: 'Profesionální čištění, prevence a péče o zdraví dásní.' },
        { icon: 'zap', title: 'Bělení zubů', desc: 'Šetrné bělení pro zářivý úsměv během jedné návštěvy.' },
        { icon: 'activity', title: 'Implantáty', desc: 'Nahrazení chybějících zubů trvalými implantáty špičkové kvality.' },
        { icon: 'smile', title: 'Ortodoncie', desc: 'Průhledná i klasická rovnátka pro dokonalé zarovnání zubů.' }
      ]
    },
    doctors: {
      title: 'Náš tým',
      subtitle: 'Zkušení specialisté s láskou k dentistry',
      items: [
        { name: 'Dr. Martin Novák', role: 'Hl. stomatolog / Implantolog', exp: '15 let praxe' },
        { name: 'Dr. Petra Svobodová', role: 'Ortodontistka', exp: '12 let praxe' },
        { name: 'Dr. Jan Procházka', role: 'Endodontolog', exp: '10 let praxe' }
      ]
    },
    testimonials: {
      title: 'Co říkají naši pacienti',
      items: [
        { name: 'Eva K.', text: 'Nejlepší dentální klinika v Praze! Profesionální přístup a bezbolestné ošetření.', rating: 5 },
        { name: 'Tomáš M.', text: 'Konečně jsem našel kliniku, kde se nemusím bát. Doporučuji všem.', rating: 5 },
        { name: 'Anna S.', text: 'Skvělá práce s implantáty. Vypadají naprosto přirozeně.', rating: 5 }
      ]
    },
    contact: {
      title: 'Kontaktujte nás',
      subtitle: 'Jsme tu pro vás každý pracovní den',
      form: {
        name: 'Vaše jméno',
        phone: 'Telefon',
        email: 'Email',
        service: 'Vyberte službu',
        message: 'Vaše zpráva',
        submit: 'Odeslat zprávu',
        success: 'Děkujeme! Brzy vás kontaktujeme.',
        services: ['Dentální hygiena', 'Bělení zubů', 'Implantáty', 'Ortodoncie', 'Jiné']
      },
      info: {
        address: 'Václavské náměstí 1, Praha 1',
        hours: 'Po - Pá: 8:00 - 18:00',
        phone: '+420 123 456 789',
        email: 'info@dentalprague.cz'
      }
    },
    footer: {
      rights: 'Všechna práva vyhrazena.',
      privacy: 'Ochrana osobních údajů'
    },
    modal: {
      title: 'Objednejte se online',
      name: 'Jméno a příjmení',
      phone: 'Telefonní číslo',
      email: 'Email',
      date: 'Preferované datum',
      service: 'Služba',
      note: 'Poznámka',
      submit: 'Potvrdit rezervaci',
      success: 'Rezervace odeslána! Brzy vás budeme kontaktovat.',
      services: ['Dentální hygiena', 'Bělení zubů', 'Implantáty', 'Ortodoncie', 'Konzultace', 'Jiné']
    },
    whatsapp: 'Napište nám na WhatsApp'
  },
  en: {
    nav: { home: 'Home', services: 'Services', doctors: 'Doctors', reviews: 'Reviews', contact: 'Contact', book: 'Book Now' },
    hero: {
      badge: 'Welcome to Dental Care Prague',
      title: 'Your smile is our',
      titleAccent: 'priority',
      subtitle: 'Modern dental clinic in the center of Prague with a team of experienced specialists, latest technology and individual approach to every patient.',
      ctaPrimary: 'Book Online',
      ctaSecondary: 'Our Services'
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive care for your smile under one roof',
      items: [
        { icon: 'sparkles', title: 'Dental Hygiene', desc: 'Professional cleaning, prevention and gum health care.' },
        { icon: 'zap', title: 'Teeth Whitening', desc: 'Gentle whitening for a radiant smile in one visit.' },
        { icon: 'activity', title: 'Implants', desc: 'Replacement of missing teeth with top-quality permanent implants.' },
        { icon: 'smile', title: 'Orthodontics', desc: 'Clear and traditional braces for perfect teeth alignment.' }
      ]
    },
    doctors: {
      title: 'Our Team',
      subtitle: 'Experienced specialists with passion for dentistry',
      items: [
        { name: 'Dr. Martin Novák', role: 'Head Dentist / Implantologist', exp: '15 years exp.' },
        { name: 'Dr. Petra Svobodová', role: 'Orthodontist', exp: '12 years exp.' },
        { name: 'Dr. Jan Procházka', role: 'Endodontist', exp: '10 years exp.' }
      ]
    },
    testimonials: {
      title: 'What Our Patients Say',
      items: [
        { name: 'Eva K.', text: 'Best dental clinic in Prague! Professional approach and painless treatment.', rating: 5 },
        { name: 'Tomáš M.', text: 'Finally found a clinic where I do not have to be afraid. Recommend to everyone.', rating: 5 },
        { name: 'Anna S.', text: 'Great work with implants. They look absolutely natural.', rating: 5 }
      ]
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'We are here for you every working day',
      form: {
        name: 'Your name',
        phone: 'Phone',
        email: 'Email',
        service: 'Select service',
        message: 'Your message',
        submit: 'Send message',
        success: 'Thank you! We will contact you soon.',
        services: ['Dental Hygiene', 'Teeth Whitening', 'Implants', 'Orthodontics', 'Other']
      },
      info: {
        address: 'Václavské náměstí 1, Prague 1',
        hours: 'Mon - Fri: 8:00 - 18:00',
        phone: '+420 123 456 789',
        email: 'info@dentalprague.cz'
      }
    },
    footer: {
      rights: 'All rights reserved.',
      privacy: 'Privacy Policy'
    },
    modal: {
      title: 'Book Online',
      name: 'Full name',
      phone: 'Phone number',
      email: 'Email',
      date: 'Preferred date',
      service: 'Service',
      note: 'Note',
      submit: 'Confirm Booking',
      success: 'Booking sent! We will contact you soon.',
      services: ['Dental Hygiene', 'Teeth Whitening', 'Implants', 'Orthodontics', 'Consultation', 'Other']
    },
    whatsapp: 'Message us on WhatsApp'
  }
}

function App() {
  const [lang, setLang] = useState('cs')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [settings, setSettings] = useState({})
  const [scrolled, setScrolled] = useState(false)

  const t = translations[lang]

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({}))

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header
        t={t}
        lang={lang}
        setLang={setLang}
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrollToSection={scrollToSection}
        setIsModalOpen={setIsModalOpen}
      />

      <main>
        <Hero t={t} scrollToSection={scrollToSection} setIsModalOpen={setIsModalOpen} />
        <Services t={t} />
        <Doctors t={t} />
        <Testimonials t={t} />
        <Contact t={t} lang={lang} />
      </main>

      <Footer t={t} />

      <WhatsAppButton settings={settings} />

      <AnimatePresence>
        {isModalOpen && (
          <BookingModal
            t={t}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function Header({ t, lang, setLang, scrolled, isMenuOpen, setIsMenuOpen, scrollToSection, setIsModalOpen }) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <SafeIcon name="smile" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Dental Care
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['home', 'services', 'doctors', 'reviews', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                {t.nav[item]}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'cs' ? 'en' : 'cs')}
              className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium"
            >
              <SafeIcon name="globe" size={18} />
              {lang.toUpperCase()}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              {t.nav.book}
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600"
          >
            <SafeIcon name={isMenuOpen ? 'x' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {['home', 'services', 'doctors', 'reviews', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-left text-slate-600 hover:text-blue-600 font-medium py-2"
                >
                  {t.nav[item]}
                </button>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setLang(lang === 'cs' ? 'en' : 'cs')}
                  className="flex items-center gap-1 text-slate-600"
                >
                  <SafeIcon name="globe" size={18} />
                  {lang === 'cs' ? 'English' : 'Čeština'}
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsModalOpen(true)
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-full"
                >
                  {t.nav.book}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Hero({ t, scrollToSection, setIsModalOpen }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-blue-100 text-blue-600 font-medium text-sm mb-6">
            <SafeIcon name="shield-check" size={16} />
            {t.hero.badge}
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">
            {t.hero.title}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              {t.hero.titleAccent}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold rounded-full hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {t.hero.ctaPrimary}
              <SafeIcon name="arrow-right" size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="px-8 py-4 bg-white text-slate-700 font-bold rounded-full border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-center"
            >
              {t.hero.ctaSecondary}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block w-1/2 h-4/5"
        >
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80"
            alt="Dental Clinic"
            className="w-full h-full object-cover rounded-l-3xl shadow-2xl"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <SafeIcon name="users" size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">5000+</div>
                <div className="text-sm text-slate-500">{lang === 'cs' ? 'Spokojených pacientů' : 'Happy Patients'}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Services({ t }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="services" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{t.services.title}</h2>
          <p className="text-slate-600 text-lg">{t.services.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.items.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 transition-all border border-slate-100 hover:border-blue-200"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <SafeIcon name={service.icon} size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Doctors({ t }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const doctors = [
    { img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80' },
    { img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80' },
    { img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80' }
  ]

  return (
    <section id="doctors" className="py-20 md:py-32 bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{t.doctors.title}</h2>
          <p className="text-slate-600 text-lg">{t.doctors.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.doctors.items.map((doctor, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.15 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="h-80 overflow-hidden">
                <img
                  src={doctors[idx].img}
                  alt={doctor.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{doctor.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{doctor.role}</p>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <SafeIcon name="award" size={16} />
                  <span>{doctor.exp}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials({ t }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="reviews" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{t.testimonials.title}</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.testimonials.items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <SafeIcon key={i} name="star" size={20} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">{item.text}</p>
              <div className="font-bold text-slate-900">{item.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact({ t, lang }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [14.4378, 50.0755],
        zoom: 13,
        attributionControl: false
      })

      new maplibregl.Marker({ color: '#0ea5e9' })
        .setLngLat([14.4378, 50.0755])
        .addTo(map.current)
    }
  }, [])

  const [formState, setFormState] = useState({ isSubmitting: false, isSuccess: false, isError: false })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState({ isSubmitting: true, isSuccess: false, isError: false })

    const formData = new FormData(e.target)
    formData.append('access_key', ACCESS_KEY)

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setFormState({ isSubmitting: false, isSuccess: true, isError: false })
        e.target.reset()
      } else {
        setFormState({ isSubmitting: false, isSuccess: false, isError: true })
      }
    } catch {
      setFormState({ isSubmitting: false, isSuccess: false, isError: true })
    }
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{t.contact.title}</h2>
          <p className="text-slate-600 text-lg">{t.contact.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <div ref={mapContainer} className="w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-8" />

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <SafeIcon name="map-pin" size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{lang === 'cs' ? 'Adresa' : 'Address'}</h4>
                  <p className="text-slate-600">{t.contact.info.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <SafeIcon name="clock" size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{lang === 'cs' ? 'Ordinační hodiny' : 'Opening Hours'}</h4>
                  <p className="text-slate-600">{t.contact.info.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <SafeIcon name="phone" size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{lang === 'cs' ? 'Telefon' : 'Phone'}</h4>
                  <p className="text-slate-600">{t.contact.info.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <SafeIcon name="mail" size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Email</h4>
                  <p className="text-slate-600">{t.contact.info.email}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.contact.form.name}</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t.contact.form.phone}</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t.contact.form.email}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.contact.form.service}</label>
                <select
                  name="service"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                >
                  {t.contact.form.services.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.contact.form.message}</label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                />
              </div>

              <AnimatePresence mode="wait">
                {formState.isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2"
                  >
                    <SafeIcon name="check-circle-2" size={20} />
                    {t.contact.form.success}
                  </motion.div>
                ) : (
                  <button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {formState.isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <SafeIcon name="send" size={20} />
                    )}
                    {t.contact.form.submit}
                  </button>
                )}
              </AnimatePresence>

              {formState.isError && (
                <p className="text-red-500 text-sm text-center">Error sending message. Please try again.</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Footer({ t }) {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <SafeIcon name="smile" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold">Dental Care Prague</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <span>© 2024 {t.footer.rights}</span>
            <button className="hover:text-white transition-colors">{t.footer.privacy}</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppButton({ settings }) {
  const phone = settings?.whatsapp_number || '+420123456789'
  return (
    <a
      href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all group"
      title="WhatsApp"
    >
      <SafeIcon name="message-circle" size={28} />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        WhatsApp
      </span>
    </a>
  )
}

function BookingModal({ t, onClose }) {
  const [formState, setFormState] = useState({ isSubmitting: false, isSuccess: false, isError: false })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState({ isSubmitting: true, isSuccess: false, isError: false })

    const formData = new FormData(e.target)
    formData.append('access_key', ACCESS_KEY)
    formData.append('subject', 'New Booking Request - Dental Clinic')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setFormState({ isSubmitting: false, isSuccess: true, isError: false })
        setTimeout(() => onClose(), 2000)
      } else {
        setFormState({ isSubmitting: false, isSuccess: false, isError: true })
      }
    } catch {
      setFormState({ isSubmitting: false, isSuccess: false, isError: true })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-slate-900">{t.modal.title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <SafeIcon name="x" size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {formState.isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon name="check-circle-2" size={32} className="text-emerald-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{t.modal.success}</h4>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.modal.name}</label>
                <input type="text" name="name" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.modal.phone}</label>
                <input type="tel" name="phone" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.modal.email}</label>
                <input type="email" name="email" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.modal.date}</label>
                <input type="date" name="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.modal.service}</label>
                <select name="service" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white">
                  {t.modal.services.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.modal.note}</label>
                <textarea name="note" rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none" />
              </div>

              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {formState.isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <SafeIcon name="calendar" size={20} />
                )}
                {t.modal.submit}
              </button>

              {formState.isError && (
                <p className="text-red-500 text-sm text-center">Error. Please try again.</p>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default App