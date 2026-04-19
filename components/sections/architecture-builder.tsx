"use client"

import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  Globe, Split, Server, Zap, Database, FolderOpen, Activity,
  ChevronRight, Check, Info, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { awsServices, type AWSService } from '@/lib/aws-services'

const iconMap: Record<string, React.ElementType> = {
  globe: Globe,
  split: Split,
  server: Server,
  zap: Zap,
  database: Database,
  folder: FolderOpen,
  activity: Activity,
}

interface ServiceNodeProps {
  service: AWSService
  isActive: boolean
  isPlaced: boolean
  onClick: () => void
}

function ServiceNode({ service, isActive, isPlaced, onClick }: ServiceNodeProps) {
  const Icon = iconMap[service.icon]
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isPlaced ? 1 : 0.3, 
        scale: isPlaced ? 1 : 0.9,
      }}
      className={`
        relative cursor-pointer transition-all duration-300
        ${isActive ? 'z-20' : 'z-10'}
      `}
      onClick={onClick}
      style={{
        position: 'absolute',
        left: service.position.x,
        top: service.position.y,
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative flex flex-col items-center p-4 rounded-xl
          border-2 transition-all duration-300
          ${isActive 
            ? 'border-primary bg-card shadow-lg glow-primary' 
            : isPlaced 
              ? 'border-border/50 bg-card/80 hover:border-primary/50' 
              : 'border-dashed border-border/30 bg-card/20'
          }
        `}
      >
        {/* Status indicator */}
        {isPlaced && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-destructive-foreground" />
          </motion.div>
        )}
        
        {/* Icon */}
        <div 
          className={`
            w-12 h-12 rounded-lg flex items-center justify-center mb-2
            transition-colors duration-300
          `}
          style={{ backgroundColor: `${service.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: service.color }} />
        </div>
        
        {/* Name */}
        <span className="text-xs font-medium text-foreground text-center whitespace-nowrap">
          {service.shortName}
        </span>
        
        {/* Pulse ring when active */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-primary"
            animate={{ scale: [1, 1.1, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

interface ConnectionLineProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  isAnimated: boolean
  delay?: number
}

function ConnectionLine({ from, to, isAnimated, delay = 0 }: ConnectionLineProps) {
  const pathLength = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))
  
  // Calculate control points for curved line
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const offset = 20
  
  const path = `M ${from.x + 60} ${from.y + 40} Q ${midX} ${midY - offset} ${to.x + 60} ${to.y + 40}`
  
  return (
    <motion.svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Background line */}
      <motion.path
        d={path}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isAnimated ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay, ease: "easeInOut" }}
        strokeDasharray={pathLength}
      />
      
      {/* Animated flow particle */}
      {isAnimated && (
        <motion.circle
          r="4"
          fill="var(--primary)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2, delay: delay + 0.8, repeat: Infinity }}
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            begin={`${delay + 0.8}s`}
            path={path}
          />
        </motion.circle>
      )}
    </motion.svg>
  )
}

interface ServiceDetailProps {
  service: AWSService | null
  onClose: () => void
}

function ServiceDetail({ service, onClose }: ServiceDetailProps) {
  if (!service) return null
  
  const Icon = iconMap[service.icon]
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur-md border-l border-border p-6 overflow-y-auto"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${service.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: service.color }} />
        </div>
        <div>
          <h3 className="font-semibold">{service.name}</h3>
          <span className="text-sm text-muted-foreground">{service.description}</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
            <Info className="w-4 h-4" />
            Why do we need this?
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{service.whyNeeded}</p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-accent mb-2">
            <Zap className="w-4 h-4" />
            What does it do?
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{service.whatItDoes}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
          <div className="text-xs font-mono text-muted-foreground mb-1">ANALOGY</div>
          <p className="text-sm italic">&ldquo;{service.analogy}&rdquo;</p>
        </div>
      </div>
    </motion.div>
  )
}

export function ArchitectureBuilder() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [placedServices, setPlacedServices] = useState<string[]>([])
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [selectedService, setSelectedService] = useState<AWSService | null>(null)
  const [isBuilding, setIsBuilding] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handlePlaceService = useCallback(() => {
    if (currentServiceIndex >= awsServices.length) return
    
    const service = awsServices[currentServiceIndex]
    setPlacedServices(prev => [...prev, service.id])
    setSelectedService(service)
    
    if (currentServiceIndex < awsServices.length - 1) {
      setCurrentServiceIndex(prev => prev + 1)
    } else {
      setIsComplete(true)
    }
  }, [currentServiceIndex])

  const handleStartBuilding = () => {
    setIsBuilding(true)
    handlePlaceService()
  }

  const handleServiceClick = (service: AWSService) => {
    if (placedServices.includes(service.id)) {
      setSelectedService(service)
    }
  }

  const currentService = awsServices[currentServiceIndex]

  const connections = [
    { fromId: 'cloudfront', toId: 'alb' },
    { fromId: 'alb', toId: 'ec2-1' },
    { fromId: 'alb', toId: 'ec2-2' },
    { fromId: 'ec2-1', toId: 'lambda' },
    { fromId: 'ec2-1', toId: 'rds' },
    { fromId: 'ec2-1', toId: 's3' },
    { fromId: 'ec2-2', toId: 'lambda' },
    { fromId: 'ec2-2', toId: 'rds' },
    { fromId: 'lambda', toId: 'cloudwatch' },
    { fromId: 'rds', toId: 'cloudwatch' },
  ]

  return (
    <section id="architecture-section" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono text-primary">BUILD THE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Place Each Service. <span className="text-gradient">Understand Why.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Click to add each AWS service to the canvas. Watch how they connect. 
            Learn what each one does as you build.
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Architecture Canvas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 relative"
          >
            <div className="relative h-[500px] rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
              {/* Canvas grid */}
              <div className="absolute inset-0 grid-pattern opacity-30" />
              
              {/* Connection lines */}
              {connections.map((conn, index) => {
                const fromService = awsServices.find(s => s.id === conn.fromId)
                const toService = awsServices.find(s => s.id === conn.toId)
                const isConnected = placedServices.includes(conn.fromId) && placedServices.includes(conn.toId)
                
                if (!fromService || !toService) return null
                
                return (
                  <ConnectionLine
                    key={`${conn.fromId}-${conn.toId}`}
                    from={fromService.position}
                    to={toService.position}
                    isAnimated={isConnected}
                    delay={index * 0.1}
                  />
                )
              })}
              
              {/* Service nodes */}
              {awsServices.map((service) => (
                <ServiceNode
                  key={service.id}
                  service={service}
                  isActive={selectedService?.id === service.id}
                  isPlaced={placedServices.includes(service.id)}
                  onClick={() => handleServiceClick(service)}
                />
              ))}
              
              {/* Service detail panel */}
              <AnimatePresence>
                {selectedService && (
                  <ServiceDetail 
                    service={selectedService} 
                    onClose={() => setSelectedService(null)} 
                  />
                )}
              </AnimatePresence>
              
              {/* Empty state overlay */}
              {!isBuilding && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">Ready to Build?</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      We&apos;ll add each AWS service one by one. You&apos;ll understand why each piece exists 
                      before moving to the next.
                    </p>
                    <Button 
                      size="lg" 
                      onClick={handleStartBuilding}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Start Building
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Service Queue */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-80 flex-shrink-0"
          >
            <div className="sticky top-8">
              <h3 className="text-sm font-mono text-muted-foreground mb-4">
                SERVICES TO PLACE ({placedServices.length}/{awsServices.length})
              </h3>
              
              <div className="space-y-3">
                {awsServices.map((service, index) => {
                  const Icon = iconMap[service.icon]
                  const isPlaced = placedServices.includes(service.id)
                  const isCurrent = index === currentServiceIndex && isBuilding && !isComplete
                  
                  return (
                    <motion.div
                      key={service.id}
                      layout
                      className={`
                        relative p-4 rounded-xl border transition-all duration-300
                        ${isCurrent 
                          ? 'border-primary bg-primary/10' 
                          : isPlaced 
                            ? 'border-destructive/30 bg-destructive/5' 
                            : 'border-border/30 bg-card/30'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`
                            w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                            ${isPlaced ? '' : 'opacity-50'}
                          `}
                          style={{ backgroundColor: `${service.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: service.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{service.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{service.description}</div>
                        </div>
                        {isPlaced && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-destructive-foreground" />
                          </motion.div>
                        )}
                      </div>
                      
                      {isCurrent && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-primary/20"
                        >
                          <Button 
                            size="sm" 
                            onClick={handlePlaceService}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Place {service.shortName}
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
              
              {/* Completion state */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl border border-destructive/30 bg-destructive/5"
                >
                  <div className="flex items-center gap-2 text-destructive mb-2">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Architecture Complete!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All services are in place. Now watch a real payment flow through.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full mt-4 border-destructive/30 hover:bg-destructive/10"
                  >
                    Watch Payment Flow
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
