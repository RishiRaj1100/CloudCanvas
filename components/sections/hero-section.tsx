"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { value: '500M+', label: 'Daily UPI Transactions' },
  { value: '₹200T', label: 'Yearly Transaction Value' },
  { value: '100K', label: 'Peak TPS During Diwali' },
]

const floatingParticles = Array.from({ length: 20 }, (_, i) => {
  const baseX = ((i * 97) % 1000) + 24
  const baseY = ((i * 71) % 800) + 16
  const yTravel = -120 - (i % 6) * 24
  const duration = 5 + (i % 5)
  const delay = (i % 6) * 0.7

  return {
    key: i,
    x: baseX,
    y: baseY,
    yTravel,
    duration,
    delay
  }
})

export function HeroSection() {
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100])

  const fullText = "What if you could actually feel how cloud architecture works?"
  
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 40)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  const scrollToNext = () => {
    const nextSection = document.getElementById('problem-section')
    nextSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.key}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            initial={{
              x: particle.x,
              y: particle.y
            }}
            animate={{
              y: [null, particle.yTravel],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay
            }}
          />
        ))}
      </div>

      <motion.div 
        style={{ opacity, y }}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
      >
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono text-muted-foreground">CloudCanvas</span>
          </div>
        </motion.div>

        {/* Main headline with typing effect */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8"
        >
          <span className="text-foreground">
            {displayedText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-primary`}>|</span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Not diagrams. Not documentation. An <span className="text-foreground font-medium">experience</span>. 
          Watch a real ₹500 payment flow through enterprise AWS infrastructure — 
          built by one developer, running entirely on the <span className="text-primary font-medium">free tier</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button 
            size="lg" 
            onClick={scrollToNext}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-medium group"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Start the Experience
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => document.getElementById('architecture-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-border/50 hover:bg-card px-8 py-6 text-lg"
          >
            Jump to Architecture
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 3.2 + index * 0.1 }}
              className="relative p-6 rounded-lg border border-border/30 bg-card/30 backdrop-blur-sm"
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.button
          onClick={scrollToNext}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-xs font-mono tracking-wider">SCROLL TO EXPLORE</span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  )
}
