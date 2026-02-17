import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Star,
  ShoppingBag,
  Menu,
  Search,
  ArrowRight,
  CheckCircle,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const products = [
  {
    id: 1,
    name: "Беспроводные наушники Pro",
    price: 12990,
    category: "Аудио",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    description: "Премиальные наушники с активным шумоподавлением"
  },
  {
    id: 2,
    name: "Смарт-часы Ultra",
    price: 24990,
    category: "Носимые устройства",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    description: "Фитнес-трекер с GPS и мониторингом здоровья"
  },
  {
    id: 3,
    name: "Портативная колонка 360",
    price: 8990,
    category: "Аудио",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
    description: "Водонепроницаемая колонка с объёмным звуком"
  },
  {
    id: 4,
    name: "Механическая клавиатура",
    price: 15990,
    category: "Аксессуары",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
    description: "RGB клавиатура с переключателями Cherry MX"
  },
  {
    id: 5,
    name: "Игровая мышь Elite",
    price: 5990,
    category: "Аксессуары",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
    description: "Прецизионная мышь с 25K DPI сенсором"
  },
  {
    id: 6,
    name: "Умная колонка Home",
    price: 6990,
    category: "Умный дом",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&q=80",
    description: "Голосовой помощник с премиальным звуком"
  }
]

function ProductCard({ product, onAddToCart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-slate-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <SafeIcon name="star" size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-slate-400">{product.rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <SafeIcon name="shoppingCart" size={18} />
            <span className="hidden sm:inline">В корзину</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function CartSidebar({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <SafeIcon name="shoppingBag" size={24} className="text-blue-400" />
                <h2 className="text-xl font-bold text-white">Корзина</h2>
                <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <SafeIcon name="x" size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center">
                    <SafeIcon name="shoppingCart" size={48} className="text-slate-600" />
                  </div>
                  <p className="text-slate-400">Ваша корзина пуста</p>
                  <button
                    onClick={onClose}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Продолжить покупки
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-4 bg-slate-800/50 p-4 rounded-xl"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{item.name}</h4>
                      <p className="text-sm text-slate-400 mb-2">{item.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-700 rounded transition-colors"
                          >
                            <SafeIcon name="minus" size={14} className="text-slate-400" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-700 rounded transition-colors"
                          >
                            <SafeIcon name="plus" size={14} className="text-slate-400" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-white">
                            {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <SafeIcon name="trash2" size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-slate-400">Итого:</span>
                  <span className="font-bold text-2xl text-white">{total.toLocaleString('ru-RU')} ₽</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
                >
                  <span>Оформить заказ</span>
                  <SafeIcon name="arrowRight" size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CheckoutModal({ isOpen, onClose, cartItems, onComplete }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)

    setTimeout(() => {
      onComplete()
      onClose()
      setIsSuccess(false)
      setFormData({ name: '', email: '', phone: '', address: '' })
    }, 2000)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
        >
          {isSuccess ? (
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center"
              >
                <SafeIcon name="checkCircle" size={40} className="text-green-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white">Заказ оформлен!</h3>
              <p className="text-slate-400">Спасибо за покупку. Мы свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">Оформление заказа</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <SafeIcon name="x" size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="p-6 border-b border-slate-800">
                <p className="text-sm text-slate-400 mb-2">Сумма заказа:</p>
                <p className="text-3xl font-bold text-white">{total.toLocaleString('ru-RU')} ₽</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Имя</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Введите ваше имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Телефон</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Адрес доставки</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Город, улица, дом, квартира"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Подтвердить заказ</span>
                      <SafeIcon name="arrowRight" size={20} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <SafeIcon name="shoppingBag" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">TechStore</span>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {['Главная', 'Каталог', 'О нас', 'Контакты'].map((item, index) => {
                const ids = ['hero', 'products', 'about', 'contacts']
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(ids[index])}
                    className="text-slate-300 hover:text-white font-medium transition-colors"
                  >
                    {item}
                  </button>
                )
              })}
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <SafeIcon name="search" size={22} />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <SafeIcon name="shoppingCart" size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <SafeIcon name={isMobileMenuOpen ? 'x' : 'menu'} size={22} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-800 bg-slate-900/95"
            >
              <nav className="container mx-auto px-4 py-4 space-y-2">
                {['Главная', 'Каталог', 'О нас', 'Контакты'].map((item, index) => {
                  const ids = ['hero', 'products', 'about', 'contacts']
                  return (
                    <button
                      key={item}
                      onClick={() => scrollToSection(ids[index])}
                      className="block w-full text-left text-slate-300 hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      {item}
                    </button>
                  )
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
              Техника будущего{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                уже здесь
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed max-w-2xl">
              Откройте для себя премиальные гаджеты и аксессуары. Бесплатная доставка при заказе от 10 000 ₽.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('products')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <SafeIcon name="shoppingBag" size={20} />
                <span>Смотреть товары</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('about')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 border border-slate-700 flex items-center justify-center gap-2"
              >
                <span>Узнать больше</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="products" className="py-20 md:py-32 bg-slate-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Популярные товары</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Лучшая электроника по доступным ценам. Гарантия качества на все товары.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Почему выбирают нас</h2>
              <div className="space-y-6">
                {[
                  { title: 'Быстрая доставка', desc: 'Доставка по всей России от 1 до 3 дней' },
                  { title: 'Гарантия качества', desc: 'Официальная гарантия производителя до 2 лет' },
                  { title: 'Поддержка 24/7', desc: 'Наши специалисты всегда на связи' }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="checkCircle" size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600/20 to-indigo-600/20 p-8 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80"
                  alt="About us"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 md:py-32 bg-slate-900/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Свяжитесь с нами</h2>
            <p className="text-slate-400 text-lg mb-12">
              Остались вопросы? Мы всегда готовы помочь вам с выбором.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: 'phone', label: 'Телефон', value: '+7 (999) 999-99-99' },
                { icon: 'mail', label: 'Email', value: 'info@techstore.ru' },
                { icon: 'mapPin', label: 'Адрес', value: 'Москва, ул. Технологий, 1' }
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
                >
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <SafeIcon name={contact.icon} size={24} className="text-blue-400" />
                  </div>
                  <p className="text-sm text-slate-400 mb-1">{contact.label}</p>
                  <p className="font-medium text-white">{contact.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-12 pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <SafeIcon name="shoppingBag" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">TechStore</span>
            </div>
            <p className="text-slate-400 text-sm text-center">
              © 2024 TechStore. Все права защищены.
            </p>
            <div className="flex gap-4">
              {['twitter', 'instagram', 'github'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-slate-400 rounded-full" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onComplete={clearCart}
      />
    </div>
  )
}