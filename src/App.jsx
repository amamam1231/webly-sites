import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, Music, Instagram, Send, Heart, Zap, Award } from 'lucide-react'

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const essenceRef = useRef(null)
  const playlistRef = useRef(null)
  const technoRef = useRef(null)
  const archiveRef = useRef(null)
  const footerRef = useRef(null)

  const isEssenceInView = useInView(essenceRef, { once: true, margin: "-100px" })
  const isPlaylistInView = useInView(playlistRef, { once: true, margin: "-100px" })
  const isTechnoInView = useInView(technoRef, { once: true, margin: "-100px" })
  const isArchiveInView = useInView(archiveRef, { once: true, margin: "-100px" })
  const isFooterInView = useInView(footerRef, { once: true, margin: "-100px" })

  const mediaItems = useMemo(() => [
    { type: 'image', url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1769987939.jpg?', caption: 'настраиваю живот', width: 800, height: 1067, loading: 'lazy' },
    { type: 'image', url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1769987992.jpg?', caption: 'в паузе от спецоперации', width: 800, height: 1067, loading: 'lazy' },
    { type: 'image', url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1769988036.jpg?', caption: 'в Омане на спецоперации', width: 800, height: 1067, loading: 'lazy' },
    { type: 'image', url: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1769988070.jpg?', caption: 'ну когда уже пройдут эти сопли', width: 800, height: 1067, loading: 'lazy' }
  ], [])

  const artists = useMemo(() => [
    {
      name: 'FreshFact ака Ромчик',
      image: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770044416.jpg?',
      loading: 'lazy'
    },
    {
      name: '9Mice',
      image: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770044350.jpg?',
      loading: 'lazy'
    },
    {
      name: 'Lildrughill',
      image: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770044435.jpg?',
      loading: 'lazy'
    },
    {
      name: 'ASAP Rocky',
      image: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770044537.jpg?',
      loading: 'lazy'
    },
    {
      name: 'Playboy Carti',
      image: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770044385.jpg?',
      loading: 'lazy'
    }
  ], [])

  const essenceItems = useMemo(() => [
    'Амбассадор снюса в Праге',
    'Самый возбуждающий пупок',
    'Магнолия',
    'Leather pants power',
    'Matcha Latte сип',
    'Дракон на спине',
    'Гнущиеся пальцы',
    'Состоит в сообществе «Вайперы Оболони»',
    'Roblox and TikTok is life'
  ], [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mediaItems.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [mediaItems.length])

  return (
    <div className="min-h-screen bg-black overflow-x-hidden noise-bg scanlines">
      {/* Floating Decorations */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <Star
            key={`star-${i}`}
            className="absolute text-acid-pink star-decoration"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${12 + Math.random() * 20}px`,
              height: `${12 + Math.random() * 20}px`,
              animationDelay: `${Math.random() * 2}s`,
              filter: 'drop-shadow(0 0 8px #FF10F0)',
            }}
          />
        ))}
        {[...Array(3)].map((_, i) => (
          <Heart
            key={`heart-${i}`}
            className="absolute text-cyber-pink heart-beat"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${10 + Math.random() * 16}px`,
              height: `${10 + Math.random() * 16}px`,
              animationDelay: `${Math.random() * 1.5}s`,
              filter: 'drop-shadow(0 0 6px #FF1493)',
            }}
          />
        ))}
        {[...Array(2)].map((_, i) => (
          <Zap
            key={`zap-${i}`}
            className="absolute text-neon-pink float-brutal"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${14 + Math.random() * 18}px`,
              height: `${14 + Math.random() * 18}px`,
              animationDelay: `${Math.random() * 3}s`,
              filter: 'drop-shadow(0 0 10px #FF00FF)',
            }}
          />
        ))}
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-acid-pink/20 to-black" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-acid-pink via-neon-pink to-acid-pink animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-acid-pink via-neon-pink to-acid-pink animate-pulse" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center"
        >
          {/* Profile Photo Circle */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 flex justify-center"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <div className="absolute inset-0 rounded-full pixel-border-brutal neon-pulse-brutal" />
              <img
                src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1769987641.jpg?"
                alt="Katya Golubenko"
                width="384"
                height="384"
                loading="lazy"
                className="w-full h-full object-cover rounded-full border-8 border-black relative z-10"
              />
              <Star className="absolute -top-6 -right-6 w-16 h-16 text-acid-pink star-decoration" style={{ filter: 'drop-shadow(0 0 15px #FF10F0)' }} />
              <Heart className="absolute -bottom-6 -left-6 w-14 h-14 text-cyber-pink heart-beat" style={{ filter: 'drop-shadow(0 0 12px #FF1493)' }} />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl sm:text-8xl md:text-9xl font-black text-soft-neon mb-8 glitch-brutal tracking-tighter leading-none"
          >
            ★ KATYA ★
            <br />
            GOLUBENKO
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <p className="text-3xl sm:text-5xl font-black text-chrome mb-2">
              VIPER OF OBOLON
            </p>
            <p className="text-xl sm:text-3xl font-bold text-hot-pink glitch-brutal">
              PRAGUE SNUS AMBASSADOR
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="mt-16"
            >
              <Award className="w-16 h-16 text-acid-pink mx-auto float-brutal" style={{ filter: 'drop-shadow(0 0 25px #FF10F0)' }} />
              <p className="text-acid-pink text-sm mt-6 font-pixel tracking-wider">★ SCROLL DOWN ★</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Ticker */}
      <div className="relative bg-acid-pink py-4 overflow-hidden border-y-4 border-black">
        <div className="flex whitespace-nowrap marquee">
          <span className="text-2xl sm:text-4xl font-black text-black mx-8">★ VIPER OF OBOLON ★</span>
          <span className="text-2xl sm:text-4xl font-black text-black mx-8">♥ LEATHER PANTS POWER ♥</span>
          <span className="text-2xl sm:text-4xl font-black text-black mx-8">★ TECHNO 24/7 ★</span>
          <span className="text-2xl sm:text-4xl font-black text-black mx-8">♥ MATCHA LATTE SIP ♥</span>
          <span className="text-2xl sm:text-4xl font-black text-black mx-8">★ VIPER OF OBOLON ★</span>
          <span className="text-2xl sm:text-4xl font-black text-black mx-8">♥ LEATHER PANTS POWER ♥</span>
          <span className="text-2xl sm:text-4xl font-black text-black mx-8">★ TECHNO 24/7 ★</span>
          <span className="text-2xl sm:text-4xl font-black text-black mx-8">♥ MATCHA LATTE SIP ♥</span>
        </div>
      </div>

      {/* THE ESSENCE */}
      <section
        ref={essenceRef}
        className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-acid-pink via-cyber-pink to-black"
      >
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <motion.h2
            initial={{ opacity: 0, x: -100 }}
            animate={isEssenceInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-7xl font-black text-white mb-16 text-center glitch-brutal"
            style={{
              textShadow: '0 0 20px #FF10F0, 0 0 40px #FF10F0, 0 0 60px #FF00FF',
            }}
          >
            ★ HIGHLIGHTS & QUOTES ★
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {essenceItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isEssenceInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="pixel-border-brutal bg-black p-8 rounded-none transform hover:scale-105 transition-transform relative"
              >
                <Star className="absolute -top-3 -right-3 w-8 h-8 text-acid-pink star-decoration" />
                <p className="text-xl sm:text-2xl font-black text-acid-pink text-center leading-tight uppercase">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLAYLIST */}
      <section ref={playlistRef} className="relative py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isPlaylistInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-7xl font-black text-center mb-6 text-mega-neon glitch-brutal"
          >
            ♪ PLAYLIST ♪
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isPlaylistInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center text-chrome mb-16 text-2xl font-black tracking-wider"
          >
            THE SOUND
          </motion.p>

          <div className="space-y-6">
            {artists.map((artist, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -100 }}
                animate={isPlaylistInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="pixel-border-brutal bg-gradient-to-r from-black via-acid-pink/20 to-black p-8 rounded-none transform hover:scale-105 transition-transform relative"
              >
                <Music className="absolute -top-4 -right-4 w-10 h-10 text-acid-pink star-decoration bg-black p-2 rounded-full" style={{ filter: 'drop-shadow(0 0 10px #FF10F0)' }} />
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-none overflow-hidden border-4 border-acid-pink neon-pulse-brutal">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      width="128"
                      height="128"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-white flex-1 uppercase glitch-brutal">
                    {artist.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MY PASSION - TECHNO */}
      <section ref={technoRef} className="relative py-20 px-4">
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute text-green-400 font-mono text-lg font-bold"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `fall ${2 + Math.random() * 3}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  textShadow: '0 0 10px #00ff00',
                }}
              >
                {Math.random().toString(36).substring(2, 8).toUpperCase()}
              </div>
            ))}
          </div>
          <div className="text-center relative z-10">
            <motion.h3
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isTechnoInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="text-6xl sm:text-8xl font-black text-green-400 mb-12 tracking-tighter matrix-glitch-brutal font-mono uppercase"
              style={{
                textShadow: '0 0 30px #00ff00, 0 0 60px #00ff00',
              }}
            >
              ★ TECHNO ★
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isTechnoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-5xl text-acid-pink font-black glitch-brutal uppercase"
            >
              Raves 24/7. Harder. Faster. Pinker.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isTechnoInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Zap className="w-20 h-20 text-acid-pink mx-auto mt-12 float-brutal" style={{ filter: 'drop-shadow(0 0 20px #FF10F0)' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE ARCHIVE */}
      <section ref={archiveRef} className="relative py-20 px-4 bg-gradient-to-b from-black to-acid-pink/20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={isArchiveInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-7xl font-black text-center mb-20 text-mega-neon glitch-brutal"
          >
            ★ THE ARCHIVE ★
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isArchiveInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="relative w-full">
                  <div className="pixel-border-brutal bg-black p-8 sm:p-12 rounded-none relative">
                    <Star className="absolute -top-6 -left-6 w-16 h-16 text-acid-pink star-decoration" style={{ filter: 'drop-shadow(0 0 15px #FF10F0)' }} />
                    <Heart className="absolute -top-6 -right-6 w-14 h-14 text-cyber-pink heart-beat" style={{ filter: 'drop-shadow(0 0 12px #FF1493)' }} />
                    <div className="w-full relative" style={{ paddingBottom: '133.375%' }}>
                      <img
                        src={mediaItems[currentSlide].url}
                        alt={mediaItems[currentSlide].caption}
                        width={mediaItems[currentSlide].width}
                        height={mediaItems[currentSlide].height}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-contain rounded-none border-4 border-acid-pink"
                      />
                    </div>
                    <p className="text-2xl sm:text-4xl font-black text-acid-pink mt-8 text-center font-pixel text-sm sm:text-base uppercase"
                      style={{
                        textShadow: '0 0 15px #FF10F0',
                      }}
                    >
                      ★ {mediaItems[currentSlide].caption} ★
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="flex justify-center gap-4 mt-12">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all ${
                  index === currentSlide
                    ? 'w-12 h-4 bg-acid-pink neon-pulse-brutal'
                    : 'w-4 h-4 bg-gray-600 hover:bg-gray-400'
                }`}
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section ref={footerRef} className="relative py-20 px-4 bg-gradient-to-b from-acid-pink/20 to-black border-t-4 border-acid-pink">
        <div className="max-w-2xl mx-auto text-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isFooterInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-acid-pink text-black text-4xl sm:text-6xl font-black py-12 sm:py-16 rounded-none mb-16 neon-pulse-brutal transition-all uppercase border-8 border-black relative overflow-hidden btn-press"
          >
            <Star className="absolute top-4 left-4 w-12 h-12 text-black star-decoration" />
            <Star className="absolute top-4 right-4 w-12 h-12 text-black star-decoration" />
            <Heart className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 text-black heart-beat" />
            ★ HIT ME UP ★
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFooterInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center gap-8 sm:gap-16"
          >
            <a
              href="https://www.instagram.com/whoatemypopcorn?igsh=MTJ4NjlpNmllZHh2eg=="
              target="_blank"
              rel="noopener noreferrer"
              className="transform hover:scale-110 transition-transform"
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-acid-pink to-cyber-pink rounded-none flex items-center justify-center neon-pulse-brutal border-4 border-black btn-press">
                <Instagram className="w-10 h-10 sm:w-14 sm:h-14 text-black" />
              </div>
            </a>

            <a
              href="https://t.me/er11ka"
              target="_blank"
              rel="noopener noreferrer"
              className="transform hover:scale-110 transition-transform"
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-acid-pink to-cyber-pink rounded-none flex items-center justify-center neon-pulse-brutal border-4 border-black btn-press">
                <Send className="w-10 h-10 sm:w-14 sm:h-14 text-black" />
              </div>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isFooterInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-acid-pink mt-16 font-pixel text-xs sm:text-sm tracking-wider"
            style={{
              textShadow: '0 0 10px #FF10F0',
            }}
          >
            ★ © 2024 VIPER OF OBOLON ★
          </motion.p>
        </div>
      </section>
    </div>
  )
}

export default App