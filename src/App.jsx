import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// Utility for tailwind class merging
function cn(...inputs) {
  import { clsx } from 'clsx';
  import { twMerge } from 'tailwind-merge';
  return twMerge(clsx(inputs));
}

// Animated section wrapper
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [clickColor, setClickColor] = useState('text-gray-900');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setIsLoading(false);
      })
      .catch(() => {
        setSettings({
          hero_title: 'Добро пожаловать',
          hero_subtitle: 'Простое решение для ваших задач',
          about_text: 'Мы создаем качественные продукты с вниманием к деталям.',
          contact_email: 'hello@example.com',
          phone_number: '+7 (999) 123-45-67',
          show_contact_form: true
        });
        setIsLoading(false);
      });
  }, []);

  const handleTextClick = () => {
    const colors = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-purple-500', 'text-orange-500', 'text-pink-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setClickColor(randomColor);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          telegram_chat_id: settings.telegram_chat_id
        })
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <SafeIcon name="zap" size={24} className="text-blue-600" />
              <span className="font-bold text-xl text-gray-900">SimpleSite</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#home" onClick={(e) => { e.preventDefault(); document.getElementById('home').scrollIntoView({behavior: 'smooth'}); }} className="text-gray-600 hover:text-blue-600 transition-colors">Главная</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about').scrollIntoView({behavior: 'smooth'}); }} className="text-gray-600 hover:text-blue-600 transition-colors">О нас</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({behavior: 'smooth'}); }} className="text-gray-600 hover:text-blue-600 transition-colors">Контакты</a>
            </nav>

            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({behavior: 'smooth'}); }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Связаться
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 text-center">
          <AnimatedSection>
            <h1
              onClick={handleTextClick}
              className={cn("text-5xl md:text-7xl font-black tracking-tight mb-6 cursor-pointer select-none transition-colors duration-300", clickColor)}
            >
              {settings.hero_title || 'Добро пожаловать'}
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {settings.hero_subtitle || 'Простое решение для ваших задач'}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({behavior: 'smooth'}); }}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-600/25"
              >
                <SafeIcon name="rocket" size={20} />
                Начать проект
              </a>
              <a
                href="#about"
                onClick={(e) => { e.preventDefault(); document.getElementById('about').scrollIntoView({behavior: 'smooth'}); }}
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <SafeIcon name="info" size={20} />
                Узнать больше
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="mt-6 text-sm text-gray-400">Нажмите на заголовок, чтобы изменить его цвет!</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Наши преимущества</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Простота, скорость и надежность — вот что мы предлагаем</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'zap', title: 'Быстрая загрузка', desc: 'Оптимизированный код для максимальной скорости' },
              { icon: 'smartphone', title: 'Адаптивность', desc: 'Отлично выглядит на любых устройствах' },
              { icon: 'shield', title: 'Надежность', desc: 'Стабильная работа без сбоев' }
            ].map((feature, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1} className="group">
                <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                    <SafeIcon name={feature.icon} size={28} className="text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <SafeIcon name="layers" size={120} className="text-white/30" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-4xl font-black text-yellow-900">5+</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">О нас</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {settings.about_text || 'Мы создаем качественные продукты с вниманием к деталям. Наш подход основан на простоте и функциональности.'}
              </p>
              <ul className="space-y-4">
                {['Качественная работа', 'Внимание к деталям', 'Клиентоориентированность'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <SafeIcon name="check-circle" size={20} className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Свяжитесь с нами</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Готовы начать? Отправьте нам сообщение</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <SafeIcon name="mail" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="font-semibold">{settings.contact_email || 'hello@example.com'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <SafeIcon name="phone" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Телефон</p>
                    <p className="font-semibold">{settings.phone_number || '+7 (999) 123-45-67'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <SafeIcon name="map-pin" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Адрес</p>
                    <p className="font-semibold">Москва, Россия</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {settings.show_contact_form !== false && (
              <AnimatedSection delay={0.2}>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Сообщение"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Отправка...
                      </>
                    ) : formStatus === 'success' ? (
                      <>
                        <SafeIcon name="check" size={20} />
                        Отправлено!
                      </>
                    ) : (
                      <>
                        <SafeIcon name="send" size={20} />
                        Отправить
                      </>
                    )}
                  </button>
                  {formStatus === 'error' && (
                    <p className="text-red-400 text-sm text-center">Произошла ошибка. Попробуйте снова.</p>
                  )}
                </form>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-950 border-t border-gray-900">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SafeIcon name="zap" size={20} className="text-blue-600" />
              <span className="font-bold text-gray-100">SimpleSite</span>
            </div>
            <p className="text-gray-500 text-sm">© 2024 SimpleSite. Все права защищены.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <SafeIcon name="github" size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <SafeIcon name="twitter" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;