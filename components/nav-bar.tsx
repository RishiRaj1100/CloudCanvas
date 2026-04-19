'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layers, ExternalLink } from 'lucide-react'
import { SecurePayModal } from './securepay-modal'

const SECTIONS = [
  { id: 'intro', label: 'Intro' },
  { id: 'architecture', label: 'Build' },
  { id: 'journey', label: 'Journey' },
  { id: 'evidence', label: 'Proof' },
  { id: 'cost', label: 'Cost' },
]

export function NavBar() {
  const [activeSection, setActiveSection] = useState('intro')
  const [scrolled, setScrolled] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    // IntersectionObserver for section tracking
    const observers: IntersectionObserver[] = []
    
    SECTIONS.forEach(section => {
      const element = document.getElementById(section.id)
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                setActiveSection(section.id)
              }
            })
          },
          { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
        )
        observer.observe(element)
        observers.push(observer)
      }
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observers.forEach(obs => obs.disconnect())
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'backdrop-blur-xl bg-[#050508]/60' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#6366F1]/20 flex items-center justify-center">
                <Layers className="w-4 h-4 text-[#6366F1]" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">CloudCanvas</div>
                <div className="text-[8px] text-[#94A3B8] -mt-0.5">SecurePay AWS Architecture</div>
              </div>
            </div>

            {/* Section indicators */}
            <div className="hidden md:flex items-center gap-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="relative px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                >
                  {/* Background fill for active */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#6366F1]"
                    initial={false}
                    animate={{
                      opacity: activeSection === section.id ? 1 : 0,
                      scale: activeSection === section.id ? 1 : 0.8
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  
                  {/* Border for inactive */}
                  <div 
                    className={`absolute inset-0 rounded-full border transition-colors ${
                      activeSection === section.id 
                        ? 'border-transparent' 
                        : 'border-[#1a1a2e] hover:border-[#6366F1]/50'
                    }`}
                  />
                  
                  <span className={`relative z-10 transition-colors ${
                    activeSection === section.id 
                      ? 'text-white' 
                      : 'text-[#94A3B8] hover:text-white'
                  }`}>
                    {section.label}
                  </span>
                </button>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#6366F1] text-[#6366F1] text-sm font-medium hover:bg-[#6366F1]/10 transition-colors"
            >
              SecurePay Demo
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-[#6366F1]"
          style={{
            width: `${(SECTIONS.findIndex(s => s.id === activeSection) + 1) / SECTIONS.length * 100}%`
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.nav>

      <SecurePayModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
