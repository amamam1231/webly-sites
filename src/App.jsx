import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const menuCategories = [
  {
    id: 'chebureki',
    title: 'Чебуреки',
    description: 'Хрустящие, сочные, с разными начинками',
    color: 'from-amber-500 to-orange-600',
    icon: 'flame',
    items: [
      { name: 'Классический с мясом', price: '120 Kč', desc: 'Говядина и свинина, лук, специи' },
      { name: 'С сыром', price: '110 Kč', desc: 'Сулугуни и адыгейский сыр' },
      { name: 'С грибами', price: '115 Kč', desc: 'Шампиньоны, лук, зелень' }
    ]
  },
  {
    id: 'soups',
    title: 'Супы',
    description: 'Традиционные первые блюда',
    color: 'from-red-600 to-rose-700',
    icon: 'soup',
    items: [
      { name: 'Борщ украинский', price: '95 Kč', desc: 'Свекла, капуста, говядина, сметана' },
      { name: 'Солянка мясная', price: '110 Kč', desc: 'Ассорти мяса, огурцы, лимон' },
      { name: 'Щи из свежей капусты', price: '85 Kč', desc: 'Капуста, морковь, томаты' }
    ]
  },
  {
    id: 'hot',
    title: 'Горячее',
    description: 'Сытные блюда на любой вкус',
    color: 'from-orange-500 to-red-500',
    icon: 'utensils',
    items: [
      { name: 'Пельмени домашние', price: '150 Kč', desc: 'Говядина и свинина, сливочное масло' },
      { name: 'Котлеты по-киевски', price: '180 Kč', desc: 'Куриное филе, сливочное масло, картофельное пюре' },
      { name: 'Голубцы', price: '145 Kč', desc: 'Рис, говядина, томатный соус' }
    ]
  },
  {
    id: 'salads',
    title: 'Салаты',
    description: 'Свежие и пикантные',
    color: 'from-green-500 to-emerald-600',
    icon: 'leaf',
    items: [
      { name: 'Оливье', price: '85 Kč', desc: 'Классический с колбасой и майонезом' },
      { name: 'Винегрет', price: '75 Kč', desc: 'Свекла, картофель, морковь, квашеная капуста' },
      { name: 'Сельдь под шубой', price: '95 Kč', desc: 'Слоеный салат с сельдью и овощами' }
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
        hero_title: 'Бистро Чебурек',
        hero_subtitle: 'Аутентичная кухня СНГ в сердце Праги',
        phone_number: '+420 777 888 999',
        address: 'Václavské náměstí 1, Praha 1',
        working_hours: 'Ежедневно 11:00 - 21:00',
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

  const cartTotal = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ''))
    return sum + price
  }, 0)

  const handleDeliverySubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...deliveryForm,
          cart: cart,
          total: cartTotal,
          type: 'delivery_order'
        })
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

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-stone-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => scrollToSection(heroRef)}
              className="font-display text-2xl md:text-3xl text-amber-500 tracking-wide hover:text-amber-400 transition-colors"
            >
              ЧЕБУРЕК
            </button>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection(menuRef)} className="text-stone-300 hover:text-amber-500 transition-colors text-sm font-medium">
                Меню
              </button>
              <button onClick={() => scrollToSection(deliveryRef)} className="text-stone-300 hover:text-amber-500 transition-colors text-sm font-medium">
                Доставка
              </button>
              <button onClick={() => scrollToSection(locationRef)} className="text-stone-300 hover:text-amber-500 transition-colors text-sm font-medium">
                Локация
              </button>
              <button onClick={() => scrollToSection(aboutRef)} className="text-stone-300 hover:text-amber-500 transition-colors text-sm font-medium">
                О нас
              </button>
            </nav>

            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
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

      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-stone-900 border-l border-stone-800 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-stone-800">
                <h3 className="font-display text-2xl text-stone-100">Корзина</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-100 transition-colors"
                >
                  <SafeIcon name="x" size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-stone-500">
                    <SafeIcon name="shopping-bag" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Корзина пуста</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-stone-800/50 rounded-xl border border-stone-700/50">
                        <div>
                          <h4 className="font-medium text-stone-100">{item.name}</h4>
                          <p className="text-sm text-stone-400">{item.category}</p>
                          <p className="text-amber-500 font-semibold mt-1">{item.price}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-stone-500 hover:text-red-500 transition-colors"
                        >
                          <SafeIcon name="trash-2" size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-800 bg-stone-900/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-stone-400">Итого:</span>
                    <span className="font-display text-3xl text-amber-500">{cartTotal} Kč</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false)
                      scrollToSection(deliveryRef)
                    }}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all transform hover:scale-[1.02]"
                  >
                    Оформить заказ
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8"
            >
              <SafeIcon name="map-pin" size={16} />
              <span>Прага • Доставка по всему городу</span>
            </motion.div>

            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-stone-100 mb-6 tracking-tight">
              {settings.hero_title || 'БИСТРО'}{' '}
              <span className="text-gradient">ЧЕБУРЕК</span>
            </h1>

            <p className="text-xl md:text-2xl text-stone-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              {settings.hero_subtitle || 'Аутентичная кухня СНГ в сердце Праги. Хрустящие чебуреки, наваристый борщ, домашние пельмени.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection(menuRef)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <SafeIcon name="utensils" size={20} />
                Смотреть меню
              </button>
              <button
                onClick={() => scrollToSection(deliveryRef)}
                className="w-full sm:w-auto px-8 py-4 bg-stone-800 text-stone-100 font-semibold rounded-xl border border-stone-700 hover:border-amber-500/50 hover:bg-stone-800/80 transition-all flex items-center justify-center gap-2"
              >
                <SafeIcon name="truck" size={20} />
                Заказать доставку
              </button>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 text-stone-500">
              <div className="flex items-center gap-2">
                <SafeIcon name="clock" size={18} className="text-amber-500" />
                <span className="text-sm">{settings.working_hours || '11:00 - 21:00'}</span>
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon name="phone" size={18} className="text-amber-500" />
                <span className="text-sm">{settings.phone_number || '+420 777 888 999'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={menuRef} className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={menuInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="font-display text-5xl md:text-6xl text-stone-100 mb-4">НАШЕ МЕНЮ</h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">
              Традиционные блюда России, Украины и СНГ, приготовленные по домашним рецептам
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn( "px-6 py-3 rounded-full font-medium transition-all",
                  activeCategory === cat.id
                    ? "bg-amber-500 text-stone-950"
                    : "bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200"
                )}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {menuCategories
                .find(c => c.id === activeCategory)
                ?.items.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-stone-900/50 border border-stone-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <div className={cn( "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity",
                    menuCategories.find(c => c.id === activeCategory)?.color
                  )} />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-2xl text-stone-100 mb-1">{item.name}</h3>
                        <p className="text-stone-500 text-sm">{item.desc}</p>
                      </div>
                      <span className="font-display text-2xl text-amber-500">{item.price}</span>
                    </div>

                    <button
                      onClick={() => addToCart(item, menuCategories.find(c => c.id === activeCategory)?.title)}
                      className="w-full py-3 bg-stone-800 text-stone-300 rounded-xl font-medium hover:bg-amber-500 hover:text-stone-950 transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                    >
                      <SafeIcon name="plus" size={18} />
                      В корзину
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section ref={deliveryRef} className="py-20 md:py-32 bg-stone-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={deliveryInView ? { opacity: 1, y: 0 } : {}}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            <div>
              <h2 className="font-display text-5xl md:text-6xl text-stone-100 mb-6">ДОСТАВКА</h2>
              <p className="text-stone-400 text-lg mb-8">
                Быстрая доставка по всей Праге. Выберите удобное время и способ оплаты.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-stone-800/50 rounded-xl border border-stone-700/50">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <SafeIcon name="truck" size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-100">Доставка от {settings.min_order_amount || '300'} Kč</h4>
                    <p className="text-sm text-stone-400">Стоимость доставки {settings.delivery_fee || '50'} Kč</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-stone-800/50 rounded-xl border border-stone-700/50">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <SafeIcon name="credit-card" size={24} className="text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-100">Онлайн-оплата</h4>
                    <p className="text-sm text-stone-400">Безопасная оплата картой</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-stone-800/50 rounded-xl border border-stone-700/50">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <SafeIcon name="clock" size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-100">Выбор времени</h4>
                    <p className="text-sm text-stone-400">Интервалы по 30 минут</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={deliveryInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8"
            >
              <h3 className="font-display text-2xl text-stone-100 mb-6">Оформить заказ</h3>

              <form onSubmit={handleDeliverySubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-400 mb-2">Имя</label>
                    <input
                      type="text"
                      required
                      value={deliveryForm.name}
                      onChange={(e) => setDeliveryForm({...deliveryForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none transition-colors"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-400 mb-2">Телефон</label>
                    <input
                      type="tel"
                      required
                      value={deliveryForm.phone}
                      onChange={(e) => setDeliveryForm({...deliveryForm, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none transition-colors"
                      placeholder="+420 XXX XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-2">Адрес доставки</label>
                  <input
                    type="text"
                    required
                    value={deliveryForm.address}
                    onChange={(e) => setDeliveryForm({...deliveryForm, address: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="Улица, дом, квартира"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-2">Время доставки</label>
                  <select
                    required
                    value={deliveryForm.timeSlot}
                    onChange={(e) => setDeliveryForm({...deliveryForm, timeSlot: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 focus:border-amber-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                  >
                    <option value="">Выберите время</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-2">Способ оплаты</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={cn( "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                      deliveryForm.paymentMethod === 'card'
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-stone-700 bg-stone-800"
                    )}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={deliveryForm.paymentMethod === 'card'}
                        onChange={(e) => setDeliveryForm({...deliveryForm, paymentMethod: e.target.value})}
                        className="sr-only"
                      />
                      <SafeIcon name="credit-card" size={20} className={deliveryForm.paymentMethod === 'card' ? "text-amber-500" : "text-stone-400"} />
                      <span className={deliveryForm.paymentMethod === 'card' ? "text-stone-100" : "text-stone-400"}>Картой</span>
                    </label>
                    <label className={cn( "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                      deliveryForm.paymentMethod === 'cash'
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-stone-700 bg-stone-800"
                    )}>
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={deliveryForm.paymentMethod === 'cash'}
                        onChange={(e) => setDeliveryForm({...deliveryForm, paymentMethod: e.target.value})}
                        className="sr-only"
                      />
                      <SafeIcon name="banknote" size={20} className={deliveryForm.paymentMethod === 'cash' ? "text-amber-500" : "text-stone-400"} />
                      <span className={deliveryForm.paymentMethod === 'cash' ? "text-stone-100" : "text-stone-400"}>Наличными</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-2">Комментарий</label>
                  <textarea
                    value={deliveryForm.comment}
                    onChange={(e) => setDeliveryForm({...deliveryForm, comment: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                    placeholder="Дополнительная информация..."
                  />
                </div>

                {cart.length > 0 && (
                  <div className="p-4 bg-stone-800/50 rounded-xl border border-stone-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-stone-400">Товаров в корзине:</span>
                      <span className="text-stone-100 font-semibold">{cart.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Сумма заказа:</span>
                      <span className="font-display text-2xl text-amber-500">{cartTotal} Kč</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <SafeIcon name="loader-2" size={20} className="animate-spin" />
                      Оформление...
                    </>
                  ) : (
                    <>
                      <SafeIcon name="check" size={20} />
                      Подтвердить заказ
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn( "p-4 rounded-xl text-center",
                        submitStatus === 'success' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      )}
                    >
                      {submitStatus === 'success'
                        ? 'Заказ успешно оформлен! Мы свяжемся с вами для подтверждения.'
                        : 'Произошла ошибка. Пожалуйста, попробуйте позже.'}
                    </motion.div>
                  )}
                </AnimatePresence>

                {cart.length === 0 && (
                  <p className="text-center text-stone-500 text-sm">
                    Добавьте товары в корзину для оформления заказа
                  </p>
                )}
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section ref={locationRef} className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={locationInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="font-display text-5xl md:text-6xl text-stone-100 mb-4">ГДЕ НАС НАЙТИ</h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">
              Приходите к нам поесть на месте или заберите заказ самовывозом
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={locationInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="aspect-video rounded-2xl overflow-hidden border border-stone-800 bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="Интерьер бистро"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden border border-stone-800 bg-stone-900">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80"
                    alt="Зал ресторана"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden border border-stone-800 bg-stone-900">
                  <img
                    src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80"
                    alt="Кухня"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={locationInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-stone-800">
                <MapComponent />
              </div>

              <div className="p-6 bg-stone-900 border border-stone-800 rounded-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="map-pin" size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-100 mb-1">Адрес</h4>
                    <p className="text-stone-400">{settings.address || 'Václavské náměstí 1, Praha 1'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="clock" size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-100 mb-1">Режим работы</h4>
                    <p className="text-stone-400">{settings.working_hours || 'Ежедневно 11:00 - 21:00'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <SafeIcon name="phone" size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-100 mb-1">Телефон</h4>
                    <p className="text-stone-400">{settings.phone_number || '+420 777 888 999'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={aboutRef} className="py-20 md:py-32 bg-stone-900/30 border-t border-stone-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-5xl md:text-6xl text-stone-100 mb-8">О НАС</h2>
            <p className="text-stone-400 text-lg leading-relaxed mb-8">
              Бистро «Чебурек» — это место, где традиции встречаются с современностью. Мы готовим
              аутентичные блюда кухни СНГ по старинным рецептам, используя только свежие
              ингредиенты и настоящие специи.
            </p>
            <p className="text-stone-400 text-lg leading-relaxed mb-12">
              Наши чебуреки хрустят так же, как у бабушки на кухне, а борщ наваристый и
              ароматный. Каждое блюдо — это частичка домашнего уюта далеко от родины.
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="font-display text-4xl text-amber-500 mb-2">5+</div>
                <div className="text-stone-500">Лет опыта</div>
              </div>
              <div>
                <div className="font-display text-4xl text-amber-500 mb-2">50+</div>
                <div className="text-stone-500">Блюд в меню</div>
              </div>
              <div>
                <div className="font-display text-4xl text-amber-500 mb-2">30 мин</div>
                <div className="text-stone-500">Среднее время доставки</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-stone-800 bg-stone-950 pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-display text-2xl text-amber-500 mb-4">ЧЕБУРЕК</h3>
              <p className="text-stone-500 text-sm">
                Аутентичная кухня СНГ в Праге. Доставка и самовывоз.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-stone-100 mb-4">Меню</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li><button onClick={() => scrollToSection(menuRef)} className="hover:text-amber-500 transition-colors">Чебуреки</button></li>
                <li><button onClick={() => scrollToSection(menuRef)} className="hover:text-amber-500 transition-colors">Супы</button></li>
                <li><button onClick={() => scrollToSection(menuRef)} className="hover:text-amber-500 transition-colors">Горячее</button></li>
                <li><button onClick={() => scrollToSection(menuRef)} className="hover:text-amber-500 transition-colors">Салаты</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-100 mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li><button onClick={() => scrollToSection(deliveryRef)} className="hover:text-amber-500 transition-colors">Доставка</button></li>
                <li><button onClick={() => scrollToSection(locationRef)} className="hover:text-amber-500 transition-colors">Контакты</button></li>
                <li><button onClick={() => scrollToSection(aboutRef)} className="hover:text-amber-500 transition-colors">О нас</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-100 mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li>{settings.phone_number || '+420 777 888 999'}</li>
                <li>{settings.delivery_email || 'info@cheburek.cz'}</li>
                <li>{settings.address || 'Praha 1'}</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-600 text-sm">
              © 2024 Бистро Чебурек. Все права защищены.
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
    </div>
  )
}

export default App