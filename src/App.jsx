import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as LucideIcons from 'lucide-react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function useFormHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const submitForm = async (formData) => {
    setIsSubmitting(true)
    setIsSuccess(false)
    setIsError(false)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setIsError(true)
      }
    } catch (error) {
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, isSuccess, isError, submitForm }
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

function Section({ children, className, id }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function AnimatedCard({ children, className, delay = 0 }) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const [settings, setSettings] = useState({
    telegram_chat_id: '',
    clinic_name: 'Prague Dental Care',
    hero_title: 'Your Smile, Our Passion',
    hero_subtitle: 'Premium dental care in the heart of Prague. Modern technology, experienced doctors, gentle approach.',
    phone_number: '+420 777 888 999',
    email: 'info@praguedental.cz',
    address: 'Václavské náměstí 1, Prague 1',
    booking_enabled: true,
    emergency_24h: true
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeLang, setActiveLang] = useState('en')
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => console.log('Using default settings'))
  }, [])

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [14.4242, 50.0755],
        zoom: 14,
        attributionControl: false
      })

      map.current.scrollZoom.disable()
      map.current.dragRotate.disable()

      new maplibregl.Marker({ color: '#2563eb' })
        .setLngLat([14.4242, 50.0755])
        .addTo(map.current)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const services = [
    {
      icon: 'Sparkles',
      title: 'Teeth Whitening',
      desc: 'Professional whitening treatments for a brighter smile',
      price: 'from 3,500 CZK'
    },
    {
      icon: 'Smile',
      title: 'Dental Implants',
      desc: 'Permanent tooth replacement with titanium implants',
      price: 'from 25,000 CZK'
    },
    {
      icon: 'AlignCenterHorizontal',
      title: 'Orthodontics',
      desc: 'Invisible aligners and braces for perfect alignment',
      price: 'from 45,000 CZK'
    },
    {
      icon: 'Shield',
      title: 'Preventive Care',
      desc: 'Regular checkups, cleaning, and cavity prevention',
      price: 'from 1,200 CZK'
    },
    {
      icon: 'Zap',
      title: 'Emergency Care',
      desc: '24/7 emergency dental services for urgent needs',
      price: 'from 2,500 CZK'
    },
    {
      icon: 'Scan',
      title: 'Digital X-Ray',
      desc: 'Low-radiation 3D imaging and diagnostics',
      price: 'from 800 CZK'
    }
  ]

  const doctors = [
    {
      name: 'Dr. Martin Novák',
      role: 'Head Dentist',
      spec: 'Implantology & Surgery',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80'
    },
    {
      name: 'Dr. Petra Svobodová',
      role: 'Orthodontist',
      spec: 'Invisible Aligners',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'
    },
    {
      name: 'Dr. Tomáš Horák',
      role: 'Endodontist',
      spec: 'Root Canal Specialist',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      text: 'Best dental experience in Prague! The staff speaks perfect English and the clinic is incredibly modern.',
      rating: 5,
      flag: '🇬🇧'
    },
    {
      name: 'Jan K.',
      text: 'Professionalní přístup, bezbolestné ošetření. Doporučuji všem!',
      rating: 5,
      flag: '🇨🇿'
    },
    {
      name: 'Michael R.',
      text: 'Got my implants done here. Half the price of Germany with better quality. Amazing!',
      rating: 5,
      flag: '🇩🇪'
    }
  ]

  const galleryImages = [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80',
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80',
    'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&q=80'
  ]

  const { isSubmitting, isSuccess, isError, submitForm } = useFormHandler()

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      date: formData.get('date'),
      message: formData.get('message'),
      type: 'booking'
    }
    await submitForm(data)
    e.target.reset()
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200"
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => scrollToSection('hero')}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="Smile" className="text-white" size={24} />
              </div>
              <span className="font-bold text-xl text-slate-900">
                {settings.clinic_name}
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center gap-8">
              {['Services', 'Doctors', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1">
                <button
                  onClick={() => setActiveLang('en')}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-all",
                    activeLang === 'en' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                  )}
                >
                  EN
                </button>
                <button
                  onClick={() => setActiveLang('cs')}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-all",
                    activeLang === 'cs' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                  )}
                >
                  CS
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('booking')}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
              >
                Book Now
              </motion.button>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <SafeIcon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-200"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {['Services', 'Doctors', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block w-full text-left py-2 text-slate-600 font-medium"
                  >
                    {item}
                  </button>
                ))}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setActiveLang('en')}
                    className={cn(
                      "flex-1 py-2 rounded-lg font-medium",
                      activeLang === 'en' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setActiveLang('cs')}
                    className={cn(
                      "flex-1 py-2 rounded-lg font-medium",
                      activeLang === 'cs' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    Čeština
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <Section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-blue-50 via-white to-slate-50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold"
              >
                <SafeIcon name="Award" size={16} />
                <span>ISO 9001 Certified Clinic</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight"
              >
                {settings.hero_title}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl"
              >
                {settings.hero_subtitle}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('booking')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors shadow-xl shadow-blue-600/25 flex items-center gap-2"
                >
                  <SafeIcon name="Calendar" size={20} />
                  Book Appointment
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('services')}
                  className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  Our Services
                </motion.button>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                      <SafeIcon name="User" size={16} />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-bold text-slate-900">2,500+</div>
                  <div className="text-sm text-slate-500">Happy Patients</div>
                </div>
                <div className="h-10 w-px bg-slate-300" />
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <SafeIcon key={i} name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1 font-bold text-slate-900">4.9</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80"
                  alt="Modern dental clinic"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <SafeIcon name="Clock" className="text-green-600" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Open Today</div>
                    <div className="text-sm text-slate-500">8:00 - 20:00</div>
                  </div>
                </div>
              </motion.div>

              {settings.emergency_24h && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                >
                  24/7 Emergency
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </Section>

      <Section id="services" className="py-20 md:py-32 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-6">
              Complete Dental Care
            </h2>
            <p className="text-lg text-slate-600">
              From routine checkups to advanced procedures, we offer comprehensive dental services using the latest technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <AnimatedCard
                key={service.title}
                delay={index * 0.1}
                className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                  <SafeIcon name={service.icon} className="text-blue-600 group-hover:text-white transition-colors" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{service.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold">{service.price}</span>
                  <button
                    onClick={() => scrollToSection('booking')}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <SafeIcon name="ArrowRight" size={20} />
                  </button>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </Section>

      <Section id="doctors" className="py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-6">
              Meet Our Experts
            </h2>
            <p className="text-lg text-slate-600">
              Our team of experienced dentists is committed to providing you with the highest quality care in a comfortable environment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <AnimatedCard key={doctor.name} delay={index * 0.15} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{doctor.name}</h3>
                  <div className="text-blue-600 font-medium mb-2">{doctor.role}</div>
                  <p className="text-slate-500 text-sm">{doctor.spec}</p>
                  <div className="flex gap-3 mt-4">
                    <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                      <SafeIcon name="Linkedin" size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                      <SafeIcon name="Mail" size={18} />
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </Section>

      <Section id="gallery" className="py-20 md:py-32 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Clinic Gallery</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-6">
              State-of-the-Art Facility
            </h2>
            <p className="text-lg text-slate-600">
              Take a tour of our modern clinic equipped with the latest dental technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((src, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={cn(
                  "relative overflow-hidden rounded-2xl group cursor-pointer",
                  index === 0 ? "md:col-span-2 md:row-span-2" : ""
                )}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={src}
                  alt={`Clinic ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <SafeIcon name="ZoomIn" size={24} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="reviews" className="py-20 md:py-32 bg-blue-600">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-200 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-6">
              What Our Patients Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((review, index) => (
              <AnimatedCard key={review.name} delay={index * 0.1} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <SafeIcon key={i} name="Star" size={20} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 text-lg mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{review.flag}</div>
                  <div>
                    <div className="font-bold text-white">{review.name}</div>
                    <div className="text-blue-200 text-sm">Verified Patient</div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </Section>

      <Section id="booking" className="py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp} className="space-y-6">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Book Appointment</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">
                Schedule Your Visit
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Book your appointment online and we'll confirm within 2 hours. Emergency cases are treated immediately.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <SafeIcon name="Phone" className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Phone</div>
                    <div className="font-bold text-slate-900">{settings.phone_number}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <SafeIcon name="Mail" className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Email</div>
                    <div className="font-bold text-slate-900">{settings.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <SafeIcon name="MapPin" className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Address</div>
                    <div className="font-bold text-slate-900">{settings.address}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <form onSubmit={handleBookingSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                      placeholder="+420 777 888 999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Service</label>
                    <select
                      name="service"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all bg-white"
                    >
                      <option value="">Select service</option>
                      <option value="checkup">General Checkup</option>
                      <option value="whitening">Teeth Whitening</option>
                      <option value="implant">Dental Implant</option>
                      <option value="orthodontics">Orthodontics</option>
                      <option value="emergency">Emergency Care</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message (Optional)</label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all resize-none"
                    placeholder="Tell us about your concern..."
                  />
                </div>

                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-100 text-green-700 p-4 rounded-lg flex items-center gap-3"
                    >
                      <SafeIcon name="CheckCircle" size={24} />
                      <span className="font-medium">Thank you! We'll contact you shortly.</span>
                    </motion.div>
                  ) : isError ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center gap-3"
                    >
                      <SafeIcon name="AlertCircle" size={24} />
                      <span className="font-medium">Something went wrong. Please try again.</span>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <SafeIcon name="Loader2" className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <SafeIcon name="CalendarCheck" size={20} />
                      Book Appointment
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </Section>

      <Section id="contact" className="py-20 md:py-32 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Location</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-6">
              Find Us in Prague
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
            <div ref={mapContainer} className="w-full h-full" />
          </motion.div>
        </div>
      </Section>

      <footer className="bg-slate-900 text-white py-16 pb-24">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <SafeIcon name="Smile" className="text-white" size={24} />
                </div>
                <span className="font-bold text-xl">{settings.clinic_name}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Premium dental care in the heart of Prague. Modern technology, experienced doctors, gentle approach.
              </p>
              <div className="flex gap-4">
                {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                  <button key={social} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <SafeIcon name={social} size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                {['Services', 'Doctors', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className="hover:text-white transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-slate-400">
                <li>General Dentistry</li>
                <li>Dental Implants</li>
                <li>Teeth Whitening</li>
                <li>Orthodontics</li>
                <li>Emergency Care</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center gap-3">
                  <SafeIcon name="MapPin" size={18} />
                  {settings.address}
                </li>
                <li className="flex items-center gap-3">
                  <SafeIcon name="Phone" size={18} />
                  {settings.phone_number}
                </li>
                <li className="flex items-center gap-3">
                  <SafeIcon name="Mail" size={18} />
                  {settings.email}
                </li>
                <li className="flex items-center gap-3">
                  <SafeIcon name="Clock" size={18} />
                  Mon-Fri: 8:00 - 20:00
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2024 {settings.clinic_name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}