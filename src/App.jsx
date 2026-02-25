import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const menuCategories = [
  {
    id: 'chebureki',
    title: 'Čebureky',
    description: 'Křupavé, šťavnaté, s různými náplněmi',
    color: 'from-amber-500 to-orange-600',
    icon: 'flame',
    items: [
      { name: 'Klasický s masem', price: '120 Kč', desc: 'Hovězí a vepřové maso, cibule, koření' },
      { name: 'Se sýrem', price: '110 Kč', desc: 'Suluguni a adygejský sýr' },
      { name: 'S houbami', price: '115 Kč', desc: 'Žampiony, cibule, zelenina' }
    ]
  },
  {
    id: 'soups',
    title: 'Polévky',
    description: 'Tradiční první chody',
    color: 'from-red-600 to-rose-700',
    icon: 'soup',
    items: [
      { name: 'Ukrajinský boršč', price: '95 Kč', desc: 'Červená řepa, zelí, hovězí maso, zakysaná smetana' },
      { name: 'Masová soljanka', price: '110 Kč', desc: 'Směs masa, okurky, citron' },
      { name: 'Ščí z čerstvého zelí', price: '85 Kč', desc: 'Zelí, mrkev, rajčata' }
    ]
  },
  {
    id: 'hot',
    title: 'Hlavní chody',
    description: 'Sytá jídla pro každý vkus',
    color: 'from-orange-500 to-red-500',
    icon: 'utensils',
    items: [
      { name: 'Domácí pelmeně', price: '150 Kč', desc: 'Hovězí a vepřové maso, máslo' },
      { name: 'Kyjevské kotlety', price: '180 Kč', desc: 'Kuřecí prsa, máslo, bramborová kaše' },
      { name: 'Holubce', price: '145 Kč', desc: 'Rýže, hovězí maso, rajčatová omáčka' }
    ]
  },
  {
    id: 'salads',
    title: 'Saláty',
    description: 'Čerstvé a pikantní',
    color: 'from-green-500 to-emerald-600',
    icon: 'leaf',
    items: [
      { name: 'Olivier salát', price: '85 Kč', desc: 'Klasický s klobásou a majonézou' },
      { name: 'Vinegret', price: '75 Kč', desc: 'Červená řepa, brambory, mrkev, kysané zelí' },
      { name: 'Sleď v kožichu', price: '95 Kč', desc: 'Vrstvený salát se sleděm a zeleninou' }
    ]
  }
]

const timeSlots = [
  '11:00 - 11:30',
  '11:30 - 12:00',
  '12:00 - 12:30',
  '12:30 - 13:00',
  '13:00 - 13:30',
  '13:30 - 14:00',
  '14:00 - 14:30',
  '14:30 - 15:00',
  '15:00 - 15:30',
  '15:30 - 16:00',
  '16:00 - 16:30',
  '16:30 - 17:00',
  '17:00 - 17:30',
  '17:30 - 18:00',
  '18:00 - 18:30',
  '18:30 - 19:00',
  '19:00 - 19:30',
  '19:30 - 20:00',
  '20:00 - 20:30',
  '20:30 - 21:00'
]

function MapComponent() {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [14.4378, 50.0755],
      zoom: 13,
      attributionControl: false,
      dragRotate: false
    })

    map.current.scrollZoom.disable()

    new maplibregl.Marker({ color: '#f59e0b' })
      .setLngLat([14.4378, 50.0755])
      .addTo(map.current)

    return () => {
      map.current?.remove()
    }
  }, [])

  return <div ref={mapContainer} className="w-full h-full min-h-[300px] rounded-2xl" />
}

function App() {
  const [settings, setSettings] = useState({})
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('chebureki')
  const [deliveryForm, setDeliveryForm] = useState({
    name: '',
    phone: '',
    address: '',
    timeSlot: '',
    paymentMethod: 'card',
    comment: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const heroRef = useRef(null)
  const menuRef = useRef(null)
  const deliveryRef = useRef(null)
  const locationRef = useRef(null)
  const aboutRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true })
  const menuInView = useInView(menuRef, { once: true, margin: "-100px" })
  const deliveryInView = useInView(deliveryRef, { once: true, margin: "-100px" })
  const locationInView = useInView(locationRef, { once: true, margin: "-100px" })
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings({
        hero_title: 'Bistro Čeburek',
        hero_subtitle: 'Autentická kuchyně SNS v srdci Prahy',
        phone_number: '+420 777 888 999',
        address: 'Václavské náměstí 1, Praha 1',
        working_hours: 'Denně 11:00 - 21:00',
        min_order_amount: '300',
        delivery_fee: '50'
      }))
  }, [])

  const addToCart = (item, category) => {
    setCart([...cart, { ...item, category, id: Date.now() }])
    setIsCartOpen(true)
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = parseInt(item.price.replace(' Kč', ''))
      return sum + price
    }, 0)
  }

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData = {
        ...deliveryForm,
        items: cart.map(item => `${item.name} (${item.price})`),
        total: calculateTotal()
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setCart([])
        setDeliveryForm({
          name: '',
          phone: '',
          address: '',
          timeSlot: '',
          paymentMethod: 'card',
          comment: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="font-display text-2xl text-amber-500">ČEBUREK</div>
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection(menuRef)} className="text-stone-300 hover:text-amber-500 transition-colors">Menu</button>
              <button onClick={() => scrollToSection(deliveryRef)} className="text-stone-300 hover:text-amber-500 transition-colors">Rozvoz</button>
              <button onClick={() => scrollToSection(locationRef)} className="text-stone-300 hover:text-amber-500 transition-colors">Lokace</button>
              <button onClick={() => scrollToSection(aboutRef)} className="text-stone-300 hover:text-amber-500 transition-colors">O nás</button>
            </nav>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-300 hover:text-amber-500 transition-colors"
            >
              <SafeIcon name="shopping-bag" size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-950 text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-stone-950 to-stone-950" />
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-stone-100 mb-6 tracking-tight">
              <span className="text-gradient">BISTRO</span>
              <br />
              ČEBUREK
            </h1>
            <p className="text-xl md:text-2xl text-stone-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              {settings.hero_subtitle || 'Autentická kuchyně SNS v srdci Prahy'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection(deliveryRef)}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-full transition-all transform hover:scale-105"
              >
                Objednat rozvoz
              </button>
              <button
                onClick={() => scrollToSection(menuRef)}
                className="px-8 py-4 border-2 border-stone-700 hover:border-amber-500 text-stone-300 hover:text-amber-500 font-bold rounded-full transition-all"
              >
                Zobrazit menu
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={menuRef} className="py-20 md:py-32 bg-stone-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={menuInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="font-display text-5xl md:text-6xl text-stone-100 mb-4">NAŠE MENU</h2>
            <p className="text-stone-400 text-lg">Vyberte kategorii</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {menuCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2",
                  activeCategory === category.id
                    ? "bg-gradient-to-r text-white shadow-lg scale-105"
                    : "bg-stone-800 text-stone-400 hover:bg-stone-700"
                )}
                style={activeCategory === category.id ? { backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` } : {}}
              >
                <SafeIcon name={category.icon} size={18} />
                {category.title}
              </button>
            ))}
          </div>

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {menuCategories.find(c => c.id === activeCategory)?.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-xl text-stone-100 group-hover:text-amber-500 transition-colors">{item.name}</h3>
                  <span className="text-amber-500 font-bold text-lg">{item.price}</span>
                </div>
                <p className="text-stone-400 text-sm mb-6">{item.desc}</p>
                <button
                  onClick={() => addToCart(item, activeCategory)}
                  className="w-full py-3 bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-300 rounded-xl transition-all font-medium flex items-center justify-center gap-2"
                >
                  <SafeIcon name="plus" size={18} />
                  Přidat do košíku
                </button>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section ref={deliveryRef} className="py-20 md:py-32 bg-stone-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={deliveryInView ? { opacity: 1, y: 0 } : {}}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            <div>
              <h2 className="font-display text-5xl md:text-6xl text-stone-100 mb-6">ROZVOZ</h2>
              <p className="text-stone-400 text-lg mb-8">
                Objednejte a my doručíme chutné jídlo přímo k vašim dveřím. Rychle, teplé a chutné.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-stone-300">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <SafeIcon name="clock" size={24} />
                  </div>
                  <div>
                    <div className="font-medium">Denně 11:00 - 21:00</div>
                    <div className="text-sm text-stone-500">Otevírací doba</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-stone-300">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <SafeIcon name="truck" size={24} />
                  </div>
                  <div>
                    <div className="font-medium">{settings.delivery_fee || '50'} Kč</div>
                    <div className="text-sm text-stone-500">Cena doručení</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-stone-300">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <SafeIcon name="banknote" size={24} />
                  </div>
                  <div>
                    <div className="font-medium">Min. {settings.min_order_amount || '300'} Kč</div>
                    <div className="text-sm text-stone-500">Minimální objednávka</div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 text-sm mb-2">Vaše jméno</label>
                  <input
                    type="text"
                    required
                    value={deliveryForm.name}
                    onChange={(e) => setDeliveryForm({...deliveryForm, name: e.target.value})}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="Jan Novák"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-sm mb-2">Telefon</label>
                  <input
                    type="tel"
                    required
                    value={deliveryForm.phone}
                    onChange={(e) => setDeliveryForm({...deliveryForm, phone: e.target.value})}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="+420 123 456 789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 text-sm mb-2">Doručovací adresa</label>
                <input
                  type="text"
                  required
                  value={deliveryForm.address}
                  onChange={(e) => setDeliveryForm({...deliveryForm, address: e.target.value})}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="Ulice, číslo popisné, město"
                />
              </div>

              <div>
                <label className="block text-stone-400 text-sm mb-2">Čas doručení</label>
                <select
                  required
                  value={deliveryForm.timeSlot}
                  onChange={(e) => setDeliveryForm({...deliveryForm, timeSlot: e.target.value})}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-500 focus:outline-none transition-colors"
                >
                  <option value="">Vyberte čas</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-400 text-sm mb-2">Způsob platby</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryForm({...deliveryForm, paymentMethod: 'card'})}
                    className={cn(
                      "py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2",
                      deliveryForm.paymentMethod === 'card'
                        ? "border-amber-500 bg-amber-500/10 text-amber-500"
                        : "border-stone-700 text-stone-400 hover:border-stone-600"
                    )}
                  >
                    <SafeIcon name="credit-card" size={18} />
                    Kartou online
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryForm({...deliveryForm, paymentMethod: 'cash'})}
                    className={cn(
                      "py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2",
                      deliveryForm.paymentMethod === 'cash'
                        ? "border-amber-500 bg-amber-500/10 text-amber-500"
                        : "border-stone-700 text-stone-400 hover:border-stone-600"
                    )}
                  >
                    <SafeIcon name="banknote" size={18} />
                    Hotově
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 text-sm mb-2">Poznámka k objednávce</label>
                <textarea
                  value={deliveryForm.comment}
                  onChange={(e) => setDeliveryForm({...deliveryForm, comment: e.target.value})}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                  rows={3}
                  placeholder="Speciální přání, alergie..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-500 text-center">
                  Objednávka byla úspěšně odeslána! Brzy vás budeme kontaktovat.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-center">
                  Chyba při odesílání. Zkuste to prosím znovu.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-stone-950 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Odesílání...' : `Objednat (${calculateTotal()} Kč)`}
              </button>

              {cart.length === 0 && (
                <p className="text-center text-stone-500 text-sm">Nejprve přidejte položky do košíku</p>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      <section ref={locationRef} className="py-20 md:py-32 bg-stone-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={locationInView ? { opacity: 1, y: 0 } : {}}
          >
            <div className="text-center mb-12">
              <h2 className="font-display text-5xl md:text-6xl text-stone-100 mb-4">LOKACE</h2>
              <p className="text-stone-400 text-lg">Přijďte k nám na návštěvu</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-stone-900/50 border border-stone-800 rounded-2xl overflow-hidden">
                <MapComponent />
              </div>

              <div className="space-y-6">
                <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                      <SafeIcon name="map-pin" size={24} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-stone-100 mb-2">Adresa</h3>
                      <p className="text-stone-400">{settings.address || 'Václavské náměstí 1, Praha 1'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                      <SafeIcon name="clock" size={24} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-stone-100 mb-2">Otevírací doba</h3>
                      <p className="text-stone-400">{settings.working_hours || 'Denně 11:00 - 21:00'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                      <SafeIcon name="phone" size={24} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-stone-100 mb-2">Telefon</h3>
                      <p className="text-stone-400">{settings.phone_number || '+420 777 888 999'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={aboutRef} className="py-20 md:py-32 bg-stone-900/30 border-t border-stone-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-5xl md:text-6xl text-stone-100 mb-8">O NÁS</h2>
            <p className="text-stone-400 text-lg leading-relaxed mb-8">
              Bistro «Čeburek» je místo, kde se tradice setkávají s moderností. Připravujeme
              autentická jídla kuchyně SNS podle starodávných receptů, používáme pouze čerstvé
              ingredience a pravé koření.
            </p>
            <p className="text-stone-400 text-lg leading-relaxed mb-12">
              Naše čebureky křupou stejně jako u babičky v kuchyni a boršč je hustý a
              voňavý. Každé jídlo je kousek domácího pohodlí daleko od vlasti.
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="font-display text-4xl text-amber-500 mb-2">5+</div>
                <div className="text-stone-500">Let zkušeností</div>
              </div>
              <div>
                <div className="font-display text-4xl text-amber-500 mb-2">50+</div>
                <div className="text-stone-500">Jídel v menu</div>
              </div>
              <div>
                <div className="font-display text-4xl text-amber-500 mb-2">30 min</div>
                <div className="text-stone-500">Průměrná doba doručení</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-stone-800 bg-stone-950 pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-display text-2xl text-amber-500 mb-4">ČEBUREK</h3>
              <p className="text-stone-500 text-sm">
                Autentická kuchyně SNS v Praze. Rozvoz a osobní odběr.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-stone-100 mb-4">Menu</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li><button onClick={() => scrollToSection(menuRef)} className="hover:text-amber-500 transition-colors">Čebureky</button></li>
                <li><button onClick={() => scrollToSection(menuRef)} className="hover:text-amber-500 transition-colors">Polévky</button></li>
                <li><button onClick={() => scrollToSection(menuRef)} className="hover:text-amber-500 transition-colors">Hlavní chody</button></li>
                <li><button onClick={() => scrollToSection(menuRef)} className="hover:text-amber-500 transition-colors">Saláty</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-100 mb-4">Informace</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li><button onClick={() => scrollToSection(deliveryRef)} className="hover:text-amber-500 transition-colors">Rozvoz</button></li>
                <li><button onClick={() => scrollToSection(locationRef)} className="hover:text-amber-500 transition-colors">Kontakty</button></li>
                <li><button onClick={() => scrollToSection(aboutRef)} className="hover:text-amber-500 transition-colors">O nás</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-100 mb-4">Kontakty</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li>{settings.phone_number || '+420 777 888 999'}</li>
                <li>{settings.delivery_email || 'info@cheburek.cz'}</li>
                <li>{settings.address || 'Praha 1'}</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-600 text-sm">
              © 2024 Bistro Čeburek. Všechna práva vyhrazena.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-stone-500 hover:text-amber-500 transition-colors">
                <SafeIcon name="instagram" size={20} />
              </a>
              <a href="#" className="text-stone-500 hover:text-amber-500 transition-colors">
                <SafeIcon name="facebook" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-stone-900 border-l border-stone-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-stone-800">
                  <h2 className="font-display text-2xl text-stone-100">Košík</h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-stone-400 hover:text-stone-100 transition-colors"
                  >
                    <SafeIcon name="x" size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  {cart.length === 0 ? (
                    <div className="text-center text-stone-500 mt-12">
                      <SafeIcon name="shopping-bag" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Váš košík je prázdný</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-stone-800/50 rounded-xl p-4">
                          <div>
                            <h4 className="text-stone-100 font-medium">{item.name}</h4>
                            <p className="text-stone-400 text-sm">{item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <SafeIcon name="trash-2" size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-stone-800 p-6 space-y-4">
                    <div className="flex justify-between text-lg font-bold text-stone-100">
                      <span>Celkem:</span>
                      <span>{calculateTotal()} Kč</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false)
                        scrollToSection(deliveryRef)
                      }}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition-colors"
                    >
                      Objednat
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App