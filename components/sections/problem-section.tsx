"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { AlertTriangle, TrendingUp, Zap, Users, Server, XCircle } from 'lucide-react'

const problems = [
  {
    icon: Users,
    title: '500 Million Daily',
    description: 'UPI processes half a billion transactions every single day in India. During Diwali, this spikes 5x.',
    color: 'text-primary'
  },
  {
    icon: TrendingUp,
    title: 'Exponential Growth',
    description: 'Transaction volume doubles every 18 months. Infrastructure that works today will fail tomorrow.',
    color: 'text-accent'
  },
  {
    icon: Zap,
    title: 'Sub-Second Expectations',
    description: 'Users expect instant transfers. A 3-second delay feels like a lifetime. A timeout means lost trust.',
    color: 'text-primary'
  }
]

const failureScenarios = [
  { label: 'Single Server', icon: Server, status: 'crashed', message: '503 Service Unavailable' },
  { label: 'No Load Balancing', icon: XCircle, status: 'overloaded', message: 'Connection Timeout' },
  { label: 'No Monitoring', icon: AlertTriangle, status: 'blind', message: 'Unknown Error State' },
]

export function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="problem-section" ref={ref} className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-destructive/30 bg-destructive/5 mb-6">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-mono text-destructive">THE PROBLEM</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Digital Payments at <span className="text-gradient">India Scale</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Before we build the solution, feel the problem. Understand why infrastructure matters 
            when real money is on the line.
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="group relative p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-lg bg-background/50 ${problem.color} mb-4`}>
                <problem.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Failure simulation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">What Happens Without Proper Architecture?</h3>
            <p className="text-muted-foreground">
              Imagine Diwali night. 100,000 transactions per second. Here&apos;s what fails:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {failureScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.15 }}
                className="relative overflow-hidden"
              >
                <div className="p-6 rounded-xl border border-destructive/30 bg-destructive/5">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-destructive/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-muted" />
                    <span className="ml-2 text-xs font-mono text-muted-foreground">{scenario.label}</span>
                  </div>
                  
                  {/* Error content */}
                  <div className="font-mono text-sm">
                    <div className="flex items-center gap-2 text-destructive mb-2">
                      <scenario.icon className="w-4 h-4" />
                      <span>ERROR</span>
                    </div>
                    <div className="text-muted-foreground bg-background/50 rounded px-3 py-2">
                      {scenario.message}
                    </div>
                  </div>

                  {/* Pulsing indicator */}
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 rounded-full bg-destructive"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Transition text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-20"
        >
          <p className="text-xl text-muted-foreground mb-4">
            This is why cloud architecture exists.
          </p>
          <p className="text-2xl md:text-3xl font-semibold">
            Now, let&apos;s <span className="text-primary">build the solution</span> — together.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
