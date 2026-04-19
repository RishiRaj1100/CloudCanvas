'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Major Indian cities with approximate positions (percentage based)
const CITIES = [
  { name: 'Mumbai', x: 25, y: 55 },
  { name: 'Delhi', x: 35, y: 28 },
  { name: 'Bengaluru', x: 35, y: 75 },
  { name: 'Hyderabad', x: 38, y: 62 },
  { name: 'Chennai', x: 45, y: 78 },
  { name: 'Kolkata', x: 60, y: 48 },
  { name: 'Pune', x: 28, y: 58 },
  { name: 'Ahmedabad', x: 22, y: 45 },
  { name: 'Jaipur', x: 28, y: 35 },
  { name: 'Lucknow', x: 45, y: 35 },
]

// Simplified India map path (stylized outline)
const INDIA_PATH = `
  M 30 15 
  L 45 12 
  L 55 18 
  L 65 25 
  L 70 35 
  L 68 50 
  L 60 55 
  L 55 65 
  L 50 80 
  L 42 88 
  L 35 85 
  L 30 75 
  L 25 65 
  L 20 55 
  L 18 45 
  L 20 35 
  L 25 25 
  Z
`

interface Particle {
  id: number
  fromCity: number
  toCity: number
  progress: number
}

export function CinematicOpener() {
  const [phase, setPhase] = useState<'drawing' | 'transactions' | 'failure' | 'recovery'>('drawing')
  const [transactionCount, setTransactionCount] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const [mapDrawn, setMapDrawn] = useState(false)
  const particleIdRef = useRef(0)
  const animationRef = useRef<number>()

  // Phase timing
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    // Drawing phase - map appears
    timers.push(setTimeout(() => setMapDrawn(true), 500))
    
    // Transactions phase starts
    timers.push(setTimeout(() => setPhase('transactions'), 2500))
    
    // Failure phase
    timers.push(setTimeout(() => setPhase('failure'), 10000))
    
    // Recovery phase
    timers.push(setTimeout(() => setPhase('recovery'), 14000))
    
    return () => timers.forEach(clearTimeout)
  }, [])

  // Transaction counter and particle spawning
  useEffect(() => {
    if (phase !== 'transactions') return

    const countInterval = setInterval(() => {
      setTransactionCount(prev => {
        const increment = Math.floor(Math.random() * 150) + 50
        return Math.min(prev + increment, 8459)
      })
    }, 100)

    const particleInterval = setInterval(() => {
      const fromCity = Math.floor(Math.random() * CITIES.length)
      let toCity = Math.floor(Math.random() * CITIES.length)
      while (toCity === fromCity) {
        toCity = Math.floor(Math.random() * CITIES.length)
      }
      
      setParticles(prev => {
        const newParticles = [...prev, {
          id: particleIdRef.current++,
          fromCity,
          toCity,
          progress: 0
        }]
        // Keep only last 50 particles
        return newParticles.slice(-50)
      })
    }, 80)

    return () => {
      clearInterval(countInterval)
      clearInterval(particleInterval)
    }
  }, [phase])

  // Animate particles
  const animateParticles = useCallback(() => {
    setParticles(prev => 
      prev
        .map(p => ({ ...p, progress: p.progress + 0.02 }))
        .filter(p => p.progress < 1)
    )
    animationRef.current = requestAnimationFrame(animateParticles)
  }, [])

  useEffect(() => {
    if (phase === 'transactions') {
      animationRef.current = requestAnimationFrame(animateParticles)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [phase, animateParticles])

  const scrollToNext = () => {
    const nextSection = document.getElementById('architecture')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="intro"
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#050508' }}
    >
      {/* India Map SVG */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          className="w-[80vmin] h-[80vmin] max-w-[600px] max-h-[600px]"
          style={{ transform: 'translateY(-5%)' }}
        >
          {/* Map outline */}
          <motion.path
            d={INDIA_PATH}
            fill="none"
            stroke="#6366F1"
            strokeWidth="0.3"
            strokeOpacity={0.15}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: mapDrawn ? 1 : 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          
          {/* City dots */}
          {CITIES.map((city, i) => (
            <motion.g key={city.name}>
              {/* Outer glow */}
              <motion.circle
                cx={city.x}
                cy={city.y}
                r={1.5}
                fill="#6366F1"
                opacity={0.3}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: mapDrawn ? [1, 1.5, 1] : 0,
                  opacity: phase === 'failure' ? 0 : 0.3
                }}
                transition={{ 
                  delay: 1.5 + i * 0.1,
                  duration: 2,
                  repeat: phase === 'transactions' ? Infinity : 0,
                  repeatType: 'loop'
                }}
              />
              {/* Core dot */}
              <motion.circle
                cx={city.x}
                cy={city.y}
                r={0.8}
                fill="#6366F1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: mapDrawn ? 1 : 0, 
                  opacity: phase === 'failure' ? 0 : 1 
                }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
              />
            </motion.g>
          ))}

          {/* Transaction particles */}
          {phase === 'transactions' && particles.map(particle => {
            const from = CITIES[particle.fromCity]
            const to = CITIES[particle.toCity]
            const x = from.x + (to.x - from.x) * particle.progress
            const y = from.y + (to.y - from.y) * particle.progress
            
            return (
              <circle
                key={particle.id}
                cx={x}
                cy={y}
                r={0.4}
                fill="#FFFFFF"
                opacity={1 - particle.progress * 0.5}
              />
            )
          })}
        </svg>
      </div>

      {/* Transaction counter */}
      <AnimatePresence>
        {(phase === 'transactions' || phase === 'failure') && (
          <motion.div
            className="absolute top-8 right-8 font-mono text-white text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-xs text-[#94A3B8] mb-1">transactions/sec</div>
            <div className="text-3xl md:text-4xl font-bold tabular-nums">
              {phase === 'failure' ? '0' : transactionCount.toLocaleString()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Failure */}
      <AnimatePresence>
        {phase === 'failure' && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Red pulse */}
            <motion.div
              className="absolute inset-0 bg-[#EF4444]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 0.8 }}
            />
            
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white tracking-widest mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              SYSTEM FAILURE
            </motion.h1>
            
            <motion.div
              className="space-y-2 text-center text-[#94A3B8]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-[#EF4444]">47,000 transactions lost in 3 seconds</p>
              <p>Merchants unable to accept payments</p>
              <p>Rs 2.3 crore in revenue, gone</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recovery */}
      <AnimatePresence>
        {phase === 'recovery' && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Indigo glow returning */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            />
            
            <motion.h2
              className="text-2xl md:text-4xl lg:text-5xl font-light text-white text-center mb-8 max-w-3xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              What if the infrastructure never failed?
            </motion.h2>
            
            <motion.p
              className="text-lg md:text-xl text-[#94A3B8] text-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              This is SecurePay. And this is how it was built.
            </motion.p>
            
            <motion.button
              onClick={scrollToNext}
              className="flex flex-col items-center gap-2 text-[#6366F1] hover:text-white transition-colors group cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <span className="text-sm text-[#94A3B8] group-hover:text-[#6366F1] transition-colors">
                Scroll to build the architecture
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
