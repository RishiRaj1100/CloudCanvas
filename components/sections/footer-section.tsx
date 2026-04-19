"use client"

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Github, Linkedin, Mail, Cloud, ExternalLink,
  Code2, Layers, Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const techStack = [
  { name: 'Java Spring Boot', category: 'Backend' },
  { name: 'React', category: 'Frontend' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'AWS EC2', category: 'Compute' },
  { name: 'AWS Lambda', category: 'Serverless' },
  { name: 'AWS S3', category: 'Storage' },
  { name: 'AWS RDS', category: 'Database' },
  { name: 'AWS CloudFront', category: 'CDN' },
]

const links = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@example.com' },
]

export function FooterSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <footer ref={ref} className="relative py-24 overflow-hidden border-t border-border/30">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", damping: 10, delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <Cloud className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Built by One Developer. <span className="text-gradient">Running for Free.</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            This project demonstrates that enterprise-grade cloud architecture is accessible to anyone 
            willing to learn. No team required. No budget required. Just understanding.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Experience Again
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-border/50"
            >
              <Github className="w-5 h-5 mr-2" />
              View Source Code
            </Button>
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Code2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-mono text-muted-foreground">BUILT WITH</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                className="px-4 py-2 rounded-full border border-border/50 bg-card/30 text-sm"
              >
                {tech.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* About section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-primary">ABOUT THIS PROJECT</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">SecurePay</h3>
            <p className="text-muted-foreground leading-relaxed">
              A fully functional digital payment platform built over 10 days as a learning project. 
              Features include user authentication, real-time transactions, fraud detection, 
              and automated receipt generation — all running on enterprise-grade AWS infrastructure.
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-4 h-4 text-accent" />
              <span className="text-sm font-mono text-accent">ABOUT CLOUDCANVAS</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">The Experience</h3>
            <p className="text-muted-foreground leading-relaxed">
              CloudCanvas exists because architecture diagrams do not teach. 
              They show what exists, not why it exists. This interactive experience 
              lets you build, watch, and understand — transforming abstract infrastructure 
              into tangible knowledge.
            </p>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="pt-8 border-t border-border/30"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">CloudCanvas</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">Built with understanding</span>
            </div>

            <div className="flex items-center gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Made with curiosity and determination. 
              <a 
                href="#" 
                className="inline-flex items-center gap-1 ml-2 text-primary hover:underline"
              >
                View the full documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
