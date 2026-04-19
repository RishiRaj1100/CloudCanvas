'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, Heart, Sparkles } from 'lucide-react'

const footerParticles = Array.from({ length: 20 }, (_, i) => {
  const left = ((i * 43 + 11) % 100) + 0.25
  const top = ((i * 67 + 7) % 100) + 0.25
  const duration = 2 + (i % 4) * 0.5
  const delay = (i % 5) * 0.35

  return {
    key: i,
    left,
    top,
    duration,
    delay
  }
})

export function DeveloperFooter() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  }

  const name = "Rishi Raj"
  const nameLetters = name.split('')

  return (
    <footer 
      ref={ref}
      className="relative py-20 px-4 overflow-hidden"
      style={{ backgroundColor: '#030306' }}
    >
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {footerParticles.map((particle) => (
          <motion.div
            key={particle.key}
            className="absolute w-1 h-1 rounded-full bg-[#6366F1]"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Code brackets animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <motion.div
            animate={{ rotate: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Code2 className="w-6 h-6 text-[#6366F1]" />
          </motion.div>
          <span className="text-[#94A3B8] text-sm font-mono">crafted with precision</span>
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          </motion.div>
        </motion.div>

        {/* Main text */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#94A3B8] text-lg mb-4"
          >
            Developed by
          </motion.p>

          {/* Animated name */}
          <div className="flex items-center justify-center gap-1 perspective-1000">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="text-4xl md:text-6xl lg:text-7xl font-bold inline-block"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(99, 102, 241, 0.3)'
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </div>

          {/* Underline animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            className="h-1 w-48 mx-auto mt-4 rounded-full origin-left"
            style={{
              background: 'linear-gradient(90deg, transparent, #6366F1, #8B5CF6, #6366F1, transparent)'
            }}
          />

          {/* Subtitle with heart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 flex items-center justify-center gap-2"
          >
            <span className="text-[#94A3B8] text-sm">Built with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.div>
            <span className="text-[#94A3B8] text-sm">and countless cups of coffee</span>
          </motion.div>

          {/* Tech stack badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {['AWS', 'Spring Boot', 'React', 'PostgreSQL', 'Docker'].map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.3 + i * 0.1 }}
                className="px-3 py-1 text-xs font-mono bg-[#1a1a2e] text-[#94A3B8] rounded-full border border-[#2a2a3e]"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Bottom signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-xs font-mono text-[#94A3B8]/40">
            CloudCanvas v1.0 | April 2026
          </p>
          <p className="text-xs font-mono text-[#94A3B8]/30 mt-2">
            &copy; {new Date().getFullYear()} Rishi Raj. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #030306, transparent)'
        }}
      />
    </footer>
  )
}
