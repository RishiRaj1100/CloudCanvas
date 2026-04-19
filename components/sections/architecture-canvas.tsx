'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Play, Code, HelpCircle, Lightbulb } from 'lucide-react'
import { SERVICES, type ServiceData } from '@/lib/services-data'
import { cn } from '@/lib/utils'

type Tab = 'what' | 'why' | 'code'

// Canvas positions for each service (percentage based)
const CANVAS_POSITIONS: Record<string, { x: number; y: number }> = {
  'cloudfront': { x: 20, y: 12 },
  'elb': { x: 20, y: 32 },
  'ec2': { x: 50, y: 50 },
  'rds': { x: 25, y: 75 },
  's3': { x: 75, y: 75 },
  'lambda': { x: 75, y: 32 },
  'api-gateway': { x: 75, y: 12 },
  'vpc': { x: 50, y: 90 },
  'iam': { x: 50, y: 10 },
  'cloudwatch': { x: 50, y: 90 },
}

// Connection definitions
const CONNECTIONS = [
  { from: 'cloudfront', to: 'elb' },
  { from: 'elb', to: 'ec2' },
  { from: 'ec2', to: 'rds' },
  { from: 'ec2', to: 's3' },
  { from: 'ec2', to: 'lambda' },
  { from: 'lambda', to: 'api-gateway' },
]

export function ArchitectureCanvas() {
  const [placedServices, setPlacedServices] = useState<string[]>([])
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('what')
  const [isComplete, setIsComplete] = useState(false)
  const [animatingService, setAnimatingService] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const unlockedIndex = placedServices.length

  const handlePlaceService = (service: ServiceData, index: number) => {
    if (index !== unlockedIndex || animatingService) return

    setAnimatingService(service.id)
    setSelectedService(service)
    setActiveTab('what')

    // Animate placement
    setTimeout(() => {
      setPlacedServices(prev => [...prev, service.id])
      setAnimatingService(null)

      // Check completion
      if (placedServices.length + 1 === SERVICES.length) {
        setTimeout(() => setIsComplete(true), 500)
      }
    }, 800)
  }

  const getConnectionPath = (fromId: string, toId: string) => {
    const from = CANVAS_POSITIONS[fromId]
    const to = CANVAS_POSITIONS[toId]
    if (!from || !to) return ''

    const midX = (from.x + to.x) / 2
    const midY = (from.y + to.y) / 2

    return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`
  }

  const scrollToNext = () => {
    const nextSection = document.getElementById('journey')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="architecture"
      className="relative min-h-screen py-16 px-4"
      style={{ backgroundColor: '#070714' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Build the Architecture
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto">
            Place each AWS service in order. Click to learn what it does and why SecurePay needs it.
          </p>
          <div className="mt-4 text-sm text-[#6366F1] font-mono">
            {placedServices.length} / {SERVICES.length} services placed
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Service Drawer */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-[#0a0a12] rounded-lg border border-[#1a1a2e] p-4">
              <h3 className="text-sm font-medium text-[#94A3B8] mb-4 uppercase tracking-wider">
                Services
              </h3>
              <div className="space-y-2">
                {SERVICES.map((service, index) => {
                  const isPlaced = placedServices.includes(service.id)
                  const isUnlocked = index === unlockedIndex
                  const isLocked = index > unlockedIndex
                  const Icon = service.icon

                  return (
                    <motion.button
                      key={service.id}
                      onClick={() => handlePlaceService(service, index)}
                      disabled={isPlaced || isLocked || !!animatingService}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
                        isPlaced && 'bg-[#0f0f1a] border-[#1a1a2e] opacity-50',
                        isUnlocked && !animatingService && 'border-[#6366F1] bg-[#6366F1]/10 hover:bg-[#6366F1]/20 cursor-pointer',
                        isLocked && 'border-[#1a1a2e] bg-[#0a0a12] opacity-40 cursor-not-allowed'
                      )}
                      style={{
                        boxShadow: isUnlocked && !animatingService ? `0 0 20px ${service.color}40` : 'none'
                      }}
                      whileHover={isUnlocked && !animatingService ? { scale: 1.02, y: -2 } : {}}
                      whileTap={isUnlocked && !animatingService ? { scale: 0.98 } : {}}
                      animate={isUnlocked && !animatingService ? {
                        boxShadow: [
                          `0 0 20px ${service.color}40`,
                          `0 0 30px ${service.color}60`,
                          `0 0 20px ${service.color}40`
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div 
                        className="w-8 h-8 rounded flex items-center justify-center"
                        style={{ backgroundColor: isLocked ? '#1a1a2e' : `${service.color}20` }}
                      >
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-[#94A3B8]" />
                        ) : (
                          <Icon className="w-4 h-4" style={{ color: service.color }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          'text-sm font-medium truncate',
                          isLocked ? 'text-[#94A3B8]' : 'text-white'
                        )}>
                          {service.shortName}
                        </div>
                        {isUnlocked && !animatingService && (
                          <div className="text-xs text-[#6366F1]">Click to place</div>
                        )}
                        {isPlaced && (
                          <div className="text-xs text-[#22C55E]">Placed</div>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 min-h-[500px] lg:min-h-[600px]">
            <div 
              ref={canvasRef}
              className="relative w-full h-full min-h-[500px] lg:min-h-[600px] bg-[#050508] rounded-lg border border-[#1a1a2e] overflow-hidden"
            >
              {/* Dot grid */}
              <div 
                className="absolute inset-0 dot-grid"
                style={{
                  backgroundImage: 'radial-gradient(circle, #6366F1 0.5px, transparent 0.5px)',
                  backgroundSize: '24px 24px',
                  opacity: 0.1
                }}
              />

              {/* SVG for connections */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {CONNECTIONS.map((conn) => {
                  const fromPlaced = placedServices.includes(conn.from)
                  const toPlaced = placedServices.includes(conn.to)
                  if (!fromPlaced || !toPlaced) return null

                  const path = getConnectionPath(conn.from, conn.to)
                  return (
                    <motion.path
                      key={`${conn.from}-${conn.to}`}
                      d={path}
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="0.3"
                      strokeOpacity={0.5}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                    />
                  )
                })}
              </svg>

              {/* Placed services */}
              {SERVICES.map((service) => {
                if (!placedServices.includes(service.id)) return null
                const pos = CANVAS_POSITIONS[service.id]
                const Icon = service.icon

                return (
                  <motion.div
                    key={service.id}
                    className="absolute flex flex-col items-center cursor-pointer group"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    onClick={() => {
                      setSelectedService(service)
                      setActiveTab('what')
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${service.color}20`,
                        border: `1px solid ${service.color}40`
                      }}
                      animate={selectedService?.id === service.id ? {
                        boxShadow: [
                          `0 0 20px ${service.color}`,
                          `0 0 40px ${service.color}`,
                          `0 0 20px ${service.color}`
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: service.color }} />
                    </motion.div>
                    <span className="mt-1 text-xs text-[#94A3B8] font-medium">
                      {service.shortName}
                    </span>
                  </motion.div>
                )
              })}

              {/* Completion overlay */}
              <AnimatePresence>
                {isComplete && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508]/90 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center px-4"
                    >
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        You just built the infrastructure that handles<br />
                        <span className="text-[#6366F1]">10,000 payments per second.</span>
                      </h3>
                      <p className="text-[#94A3B8] mb-8">
                        Now watch it actually process one.
                      </p>
                      <motion.button
                        onClick={scrollToNext}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#5558E8] transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(99, 102, 241, 0.5)',
                            '0 0 40px rgba(99, 102, 241, 0.8)',
                            '0 0 20px rgba(99, 102, 241, 0.5)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Play className="w-4 h-4" />
                        Run a payment through this architecture
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-[#0a0a12] rounded-lg border border-[#1a1a2e] overflow-hidden sticky top-24">
              <AnimatePresence mode="wait">
                {selectedService ? (
                  <motion.div
                    key={selectedService.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Service header */}
                    <div 
                      className="p-4 border-b border-[#1a1a2e]"
                      style={{ backgroundColor: `${selectedService.color}10` }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${selectedService.color}20` }}
                        >
                          <selectedService.icon className="w-5 h-5" style={{ color: selectedService.color }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{selectedService.name}</h4>
                          <p className="text-xs text-[#94A3B8]">AWS Service</p>
                        </div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-[#1a1a2e]">
                      {(['what', 'why', 'code'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={cn(
                            'flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5',
                            activeTab === tab 
                              ? 'text-[#6366F1] border-b-2 border-[#6366F1]' 
                              : 'text-[#94A3B8] hover:text-white'
                          )}
                        >
                          {tab === 'what' && <HelpCircle className="w-3.5 h-3.5" />}
                          {tab === 'why' && <Lightbulb className="w-3.5 h-3.5" />}
                          {tab === 'code' && <Code className="w-3.5 h-3.5" />}
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Tab content */}
                    <div className="p-4 max-h-[400px] overflow-y-auto">
                      <AnimatePresence mode="wait">
                        {activeTab === 'what' && (
                          <motion.div
                            key="what"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <h5 className="text-sm font-medium text-white mb-2">What It Is</h5>
                            <p className="text-sm text-[#94A3B8] leading-relaxed">
                              {selectedService.what}
                            </p>
                          </motion.div>
                        )}
                        {activeTab === 'why' && (
                          <motion.div
                            key="why"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <h5 className="text-sm font-medium text-white mb-2">Why SecurePay Needs It</h5>
                            <p className="text-sm text-[#94A3B8] leading-relaxed">
                              {selectedService.why}
                            </p>
                          </motion.div>
                        )}
                        {activeTab === 'code' && (
                          <motion.div
                            key="code"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <h5 className="text-sm font-medium text-white mb-2">The Actual Code</h5>
                            <pre className="text-xs bg-[#050508] p-3 rounded-lg overflow-x-auto border border-[#1a1a2e]">
                              <code className="text-[#94A3B8] font-mono whitespace-pre">
                                {selectedService.code}
                              </code>
                            </pre>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1a1a2e] flex items-center justify-center mx-auto mb-4">
                      <HelpCircle className="w-6 h-6 text-[#94A3B8]" />
                    </div>
                    <p className="text-sm text-[#94A3B8]">
                      Click a service to learn about it
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
