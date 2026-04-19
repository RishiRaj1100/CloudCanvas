'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Share2 } from 'lucide-react'

const METRICS = [
  { label: 'Services deployed', value: 10 },
  { label: 'Transactions processed', value: 47 },
  { label: 'Fraud checks executed', value: 47 },
  { label: 'Receipts stored in S3', value: 43 },
  { label: 'EC2 uptime during session', value: 100, suffix: '%' },
  { label: 'Lambda cold starts', value: 0 },
]

function CountUp({ target, duration = 1.5, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [isInView, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

function Particle({ delay, color }: { delay: number; color: string }) {
  const angle = Math.random() * 360
  const distance = 100 + Math.random() * 200
  const x = Math.cos(angle * Math.PI / 180) * distance
  const y = Math.sin(angle * Math.PI / 180) * distance

  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full"
      style={{ backgroundColor: color }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    />
  )
}

export function CostReveal() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-200px' })
  const [showReveal, setShowReveal] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [metricsDimmed, setMetricsDimmed] = useState(false)

  useEffect(() => {
    if (!isInView) return

    // Metrics appear, then dim
    const dimTimer = setTimeout(() => setMetricsDimmed(true), 4000)
    // Big reveal
    const revealTimer = setTimeout(() => {
      setShowReveal(true)
      setShowParticles(true)
      // Undim metrics after reveal
      setTimeout(() => setMetricsDimmed(false), 500)
    }, 5200)

    return () => {
      clearTimeout(dimTimer)
      clearTimeout(revealTimer)
    }
  }, [isInView])

  return (
    <section 
      id="cost"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center py-16 px-4"
      style={{ backgroundColor: '#050508' }}
    >
      {/* Opening line */}
      <motion.div
        className="absolute top-1/3 left-0 right-0 h-px bg-[#6366F1]"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{ opacity: isInView && !showReveal ? 0.5 : 0 }}
      />

      {/* Metrics */}
      <div 
        className={`grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-20 transition-opacity duration-500 ${
          metricsDimmed ? 'opacity-30' : 'opacity-100'
        }`}
      >
        {METRICS.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 + index * 0.15, duration: 0.5 }}
          >
            <div className="text-xs text-[#94A3B8] mb-1 uppercase tracking-wider">
              {metric.label}
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white font-mono">
              <CountUp target={metric.value} suffix={metric.suffix || ''} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* AWS Bill text */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={isInView && metricsDimmed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-[#94A3B8] text-lg">AWS bill for this month:</span>
      </motion.div>

      {/* The Big Reveal */}
      <AnimatePresence>
        {showReveal && (
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
          >
            {/* Particles */}
            {showParticles && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <Particle 
                    key={i} 
                    delay={i * 0.02} 
                    color={i % 2 === 0 ? '#6366F1' : '#FFFFFF'} 
                  />
                ))}
              </div>
            )}

            {/* The number */}
            <motion.div
              className="text-7xl md:text-9xl font-bold text-[#6366F1] font-mono tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Rs 0.00
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote */}
      <motion.div
        className="mt-16 max-w-2xl text-center"
        initial={{ opacity: 0 }}
        animate={showReveal ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
      >
        <blockquote className="text-lg md:text-xl text-white italic leading-relaxed">
          &ldquo;Enterprise-grade cloud infrastructure is not expensive. It is not inaccessible. 
          It requires only one thing: understanding how the pieces fit together.&rdquo;
        </blockquote>
        <cite className="block mt-4 text-[#94A3B8] not-italic">
          — SecurePay Architecture, April 2026
        </cite>
      </motion.div>

      {/* CTAs */}
      <motion.div
        className="mt-12 flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={showReveal ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.3 }}
      >
        <a
          href="#"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#6366F1] text-white rounded-lg hover:bg-[#5558E8] transition-colors font-medium"
        >
          <Github className="w-4 h-4" />
          Explore the GitHub Repository
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-2 px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium"
        >
          <Linkedin className="w-4 h-4" />
          Connect on LinkedIn
        </a>
        <button
          className="inline-flex items-center gap-2 px-6 py-3 text-[#94A3B8] hover:text-white transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share CloudCanvas
        </button>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-8 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={showReveal ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        <div className="text-xs font-mono text-[#94A3B8]/60 space-y-1">
          <p>&copy; 2026 CloudCanvas. All rights reserved.</p>
          <p>Designed and developed by Rishi Raj.</p>
          <p>Built to teach AWS architecture through real-world implementation.</p>
          <p>SecurePay — INT 330: Managing Cloud Solutions, April 2026.</p>
        </div>
      </motion.footer>
    </section>
  )
}
