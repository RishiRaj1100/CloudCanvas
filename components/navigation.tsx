"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Cloud } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Problem', href: '#problem-section' },
  { label: 'Architecture', href: '#architecture-section' },
  { label: 'Simulation', href: '#payment-section' },
  { label: 'Evidence', href: '#evidence-section' },
  { label: 'Cost', href: '#cost-section' },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.slice(1))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 200) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isScrolled 
            ? 'bg-background/80 backdrop-blur-md border-b border-border/50' 
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Cloud className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">CloudCanvas</span>
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-lg transition-colors
                    ${activeSection === item.href.slice(1)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {item.label}
                  {activeSection === item.href.slice(1) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-muted rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:block">
              <Button
                size="sm"
                onClick={() => scrollToSection('#architecture-section')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Start Experience
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-background/95 backdrop-blur-md border-b border-border p-4">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`
                      px-4 py-3 text-left rounded-lg transition-colors
                      ${activeSection === item.href.slice(1)
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                ))}
                <Button
                  onClick={() => scrollToSection('#architecture-section')}
                  className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Start Experience
                </Button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
