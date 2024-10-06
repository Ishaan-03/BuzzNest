
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
const neonColors = ['#ff00ff', '#00ffff', '#ffff00', '#ff9900']

const FloatingElement: React.FC<{ delay: number }> = ({ delay }) => {
  const randomColor = neonColors[Math.floor(Math.random() * neonColors.length)]
  return (
    <motion.div
      className="absolute rounded-full mix-blend-screen"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.5, 1],
        x: ['-50%', '50%', '-50%'],
        y: ['-50%', '50%', '-50%'],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: delay,
      }}
      style={{
        width: `${Math.random() * 100 + 50}px`,
        height: `${Math.random() * 100 + 50}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        backgroundColor: randomColor,
        filter: 'blur(50px)',
      }}
    />
  )
}

const NeonText: React.FC<{ text: string; delay: number; color: string }> = ({ text, delay, color }) => {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{ color: color }}
    >
      {text}
    </motion.span>
  )
}

const LandingPage: React.FC = () => {
  const [showContent, setShowContent] = useState(false)
  const Navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleGetStarted = () => Navigate('/signup')
  const handleLearnMore = () => Navigate('/learnmore')

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Animated background elements */}
      {[...Array(10)].map((_, index) => (
        <FloatingElement key={index} delay={index * 0.5} />
      ))}

      {/* Main content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="relative z-10 flex flex-col items-center text-center space-y-8 p-6 max-w-4xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold space-y-2">
              <NeonText text="Welcome to" delay={0.2} color="#8A2BE2" />
              <br />
              <NeonText text="Buzz" delay={0.4} color="#00FF00" />
              <NeonText text="Nest" delay={0.6} color="#1E90FF" />
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Create your own hive of connections, share your story, and experience the buzz of life.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button
                onClick={handleGetStarted}
                className="py-3 px-6 bg-[#ff00ff] text-white rounded-full shadow-lg hover:bg-[#ff33ff] transition-all text-lg font-semibold"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px #ff00ff' }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
              <motion.button
                onClick={handleLearnMore}
                className="py-3 px-6 bg-[#00ffff] text-black rounded-full shadow-lg hover:bg-[#33ffff] transition-all text-lg font-semibold"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px #00ffff' }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>

            <motion.p
              className="text-sm md:text-lg text-gray-400 mt-12 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              &quot;Together we thrive. BuzzNest - Where your stories find their place.&quot;
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LandingPage