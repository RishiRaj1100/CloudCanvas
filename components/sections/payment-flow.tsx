"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  Globe, Split, Server, Zap, Database, FolderOpen, Activity,
  Play, RotateCcw, CheckCircle2, Clock, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { awsServices, paymentFlowSteps } from '@/lib/aws-services'

const iconMap: Record<string, React.ElementType> = {
  globe: Globe,
  split: Split,
  server: Server,
  zap: Zap,
  database: Database,
  folder: FolderOpen,
  activity: Activity,
}

const CONNECTIONS = [
  { id: 'cf-alb', from: 'cloudfront', to: 'alb' },
  { id: 'alb-ec2', from: 'alb', to: 'ec2-1' },
  { id: 'ec2-lambda', from: 'ec2-1', to: 'lambda' },
  { id: 'ec2-rds', from: 'ec2-1', to: 'rds' },
  { id: 'ec2-s3', from: 'ec2-1', to: 's3' },
  { id: 'lambda-cw', from: 'lambda', to: 'cloudwatch' },
  { id: 'rds-cw', from: 'rds', to: 'cloudwatch' },
]

const STEP_TO_CONNECTION: Record<string, string> = {
  'cloudfront': 'cf-alb',
  'alb': 'alb-ec2',
  'ec2-1': 'ec2-lambda',
  'lambda': 'ec2-rds',
  'rds': 'ec2-s3',
  's3': 'lambda-cw',
  'cloudwatch': 'rds-cw',
}

interface FlowNodeProps {
  service: typeof awsServices[0]
  isActive: boolean
  isCompleted: boolean
  currentStep: typeof paymentFlowSteps[0] | null
}

function FlowNode({ service, isActive, isCompleted, currentStep }: FlowNodeProps) {
  const Icon = iconMap[service.icon]
  
  return (
    <motion.div
      className="relative"
      style={{
        position: 'absolute',
        left: service.position.x,
        top: service.position.y,
      }}
    >
      {/* Pulse effect when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 -m-4 rounded-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.3, opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ backgroundColor: service.color }}
        />
      )}
      
      <motion.div
        animate={{
          scale: isActive ? 1.1 : 1,
          boxShadow: isActive 
            ? `0 0 30px ${service.color}60, 0 0 60px ${service.color}30` 
            : 'none'
        }}
        transition={{ duration: 0.3 }}
        className={`
          relative flex flex-col items-center p-4 rounded-xl
          border-2 transition-all duration-300
          ${isActive 
            ? 'border-primary bg-card' 
            : isCompleted 
              ? 'border-destructive/50 bg-card/80' 
              : 'border-border/30 bg-card/50'
          }
        `}
      >
        {/* Completion indicator */}
        {isCompleted && !isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive flex items-center justify-center"
          >
            <CheckCircle2 className="w-3 h-3 text-destructive-foreground" />
          </motion.div>
        )}
        
        {/* Icon */}
        <motion.div 
          animate={{ 
            scale: isActive ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
          style={{ backgroundColor: `${service.color}${isActive ? '40' : '20'}` }}
        >
          <Icon className="w-6 h-6" style={{ color: service.color }} />
        </motion.div>
        
        {/* Name */}
        <span className="text-xs font-medium text-center whitespace-nowrap">
          {service.shortName}
        </span>
      </motion.div>
      
      {/* Info tooltip when active */}
      {isActive && currentStep && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute left-full ml-4 top-0 w-64 z-30"
        >
          <div className="p-4 rounded-xl bg-card border border-primary/50 shadow-lg">
            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2">
              <Clock className="w-4 h-4" />
              {currentStep.title}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{currentStep.description}</p>
            <div className="text-xs font-mono text-muted-foreground/80 p-2 rounded bg-muted/50">
              {currentStep.detail}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function AnimatedConnection({ 
  from, 
  to, 
  isFlowing, 
  delay = 0 
}: { 
  from: { x: number; y: number }
  to: { x: number; y: number }
  isFlowing: boolean
  delay?: number
}) {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const offset = 20
  const path = `M ${from.x + 60} ${from.y + 40} Q ${midX} ${midY - offset} ${to.x + 60} ${to.y + 40}`
  
  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background line */}
      <path
        d={path}
        fill="none"
        stroke="var(--border)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      
      {/* Animated flowing line */}
      {isFlowing && (
        <>
          <motion.path
            d={path}
            fill="none"
            stroke="url(#flowGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay }}
          />
          
          {/* Data packet */}
          <motion.circle
            r="6"
            fill="var(--primary)"
            filter="url(#glow)"
          >
            <animateMotion
              dur="0.5s"
              begin={`${delay}s`}
              fill="freeze"
              path={path}
            />
          </motion.circle>
        </>
      )}
    </svg>
  )
}

export function PaymentFlow() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [flowingConnections, setFlowingConnections] = useState<string[]>([])

  const runSimulation = useCallback(() => {
    setIsPlaying(true)
    setCurrentStepIndex(0)
    setCompletedSteps([])
    setFlowingConnections([])
  }, [])

  const resetSimulation = () => {
    setIsPlaying(false)
    setCurrentStepIndex(-1)
    setCompletedSteps([])
    setFlowingConnections([])
  }

  useEffect(() => {
    if (!isPlaying || currentStepIndex < 0) return
    
    const currentStep = paymentFlowSteps[currentStepIndex]
    if (!currentStep) {
      setIsPlaying(false)
      return
    }

    // Add the connection for current step
    const connectionId = STEP_TO_CONNECTION[currentStep.service]
    if (connectionId && !flowingConnections.includes(connectionId)) {
      setFlowingConnections(prev => [...prev, connectionId])
    }

    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStepIndex])
      
      if (currentStepIndex < paymentFlowSteps.length - 1) {
        setCurrentStepIndex(prev => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }, currentStep.duration)

    return () => clearTimeout(timer)
  }, [currentStepIndex, isPlaying, flowingConnections])

  const currentStep = currentStepIndex >= 0 ? paymentFlowSteps[currentStepIndex] : null
  const isComplete = completedSteps.length === paymentFlowSteps.length

  return (
    <section id="payment-section" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-mono text-accent">LIVE SIMULATION</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Watch a <span className="text-gradient">₹500 Payment</span> Flow
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rahul sends ₹500 to Priya. Watch each service activate in real-time 
            as the transaction flows through your architecture.
          </p>
        </motion.div>

        {/* Transaction card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-6 p-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold">R</div>
              <div>
                <div className="text-sm font-medium">Rahul</div>
                <div className="text-xs text-muted-foreground">Sender</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={isPlaying ? { x: [0, 10, 0] } : {}}
                transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
                className="text-2xl font-bold text-primary"
              >
                ₹500
              </motion.div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-lg font-bold">P</div>
              <div>
                <div className="text-sm font-medium">Priya</div>
                <div className="text-xs text-muted-foreground">Receiver</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Architecture visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative h-[500px] rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden mb-8"
        >
          <div className="absolute inset-0 grid-pattern opacity-20" />
          
          {/* Connections */}
          {CONNECTIONS.map((conn) => {
            const fromService = awsServices.find(s => s.id === conn.from)
            const toService = awsServices.find(s => s.id === conn.to)
            if (!fromService || !toService) return null
            
            return (
              <AnimatedConnection
                key={conn.id}
                from={fromService.position}
                to={toService.position}
                isFlowing={flowingConnections.includes(conn.id)}
              />
            )
          })}
          
          {/* Service nodes */}
          {awsServices.map((service) => {
            const stepIndex = paymentFlowSteps.findIndex(s => s.service === service.id)
            const isActive = currentStep?.service === service.id
            const isCompleted = stepIndex >= 0 && completedSteps.includes(stepIndex)
            
            return (
              <FlowNode
                key={service.id}
                service={service}
                isActive={isActive}
                isCompleted={isCompleted}
                currentStep={isActive ? currentStep : null}
              />
            )
          })}
          
          {/* Control overlay */}
          {!isPlaying && !isComplete && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm">
              <Button 
                size="lg" 
                onClick={runSimulation}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Payment
              </Button>
            </div>
          )}
          
          {/* Completion overlay */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-destructive" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Transaction Complete!</h3>
                <p className="text-muted-foreground mb-4">₹500 successfully transferred in 5.4 seconds</p>
                <Button 
                  variant="outline" 
                  onClick={resetSimulation}
                  className="border-border/50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Run Again
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Step timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-1 overflow-x-auto pb-4"
        >
          {paymentFlowSteps.map((step, index) => {
            const isActive = currentStepIndex === index
            const isCompleted = completedSteps.includes(index)
            
            return (
              <div key={step.service} className="flex items-center">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive 
                      ? 'var(--primary)' 
                      : isCompleted 
                        ? 'var(--destructive)' 
                        : 'var(--muted)'
                  }}
                  className="w-3 h-3 rounded-full"
                />
                {index < paymentFlowSteps.length - 1 && (
                  <div className={`w-8 h-0.5 ${isCompleted ? 'bg-destructive' : 'bg-muted'}`} />
                )}
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
