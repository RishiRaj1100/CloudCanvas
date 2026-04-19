'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Shield, 
  Network, 
  Server, 
  Database, 
  FolderOpen, 
  Zap, 
  Globe, 
  Cloud, 
  Split, 
  TrendingUp,
  Activity,
  GitBranch,
  ExternalLink,
  Terminal,
  Upload,
  X,
  ImageIcon
} from 'lucide-react'

const EVIDENCE_CARDS = [
  {
    id: 1,
    service: 'IAM',
    icon: Shield,
    color: '#EF4444',
    label: 'securepay-ec2-role with S3, Lambda, CloudWatch permissions attached',
    description: 'Zero hardcoded credentials. EC2 instance assumes this role automatically.'
  },
  {
    id: 2,
    service: 'VPC',
    icon: Network,
    color: '#8B5CF6',
    label: 'Public and private subnets across 2 availability zones in Mumbai',
    description: 'Database lives in private subnet — completely invisible to the internet.'
  },
  {
    id: 3,
    service: 'EC2',
    icon: Server,
    color: '#F59E0B',
    label: '/actuator/health returning UP on all 4 Spring Boot microservice ports',
    description: 'Auth, Payment, Merchant, and Gateway services all running.'
  },
  {
    id: 4,
    service: 'RDS',
    icon: Database,
    color: '#3B82F6',
    label: 'PostgreSQL db.t2.micro running in private subnet — zero public access',
    description: 'Only EC2 can connect. Automatic backups enabled.'
  },
  {
    id: 5,
    service: 'S3',
    icon: FolderOpen,
    color: '#22C55E',
    label: 'securepay-receipts bucket containing real transaction receipt PDFs',
    description: 'Every successful payment generates a downloadable receipt.'
  },
  {
    id: 6,
    service: 'Lambda',
    icon: Zap,
    color: '#F59E0B',
    label: 'securepay-fraud-detector test returning APPROVE for low-risk payload',
    description: 'Fraud detection executes in under 50ms, costs nothing when idle.'
  },
  {
    id: 7,
    service: 'API Gateway',
    icon: Globe,
    color: '#6366F1',
    label: 'POST /fraud-check endpoint deployed to prod stage',
    description: 'Public REST endpoint for Lambda invocation with rate limiting.'
  },
  {
    id: 8,
    service: 'CloudFront',
    icon: Cloud,
    color: '#14B8A6',
    label: 'Distribution serving React build at *.cloudfront.net',
    description: 'Global CDN with automatic HTTPS. Zero configuration SSL.'
  },
  {
    id: 9,
    service: 'ELB',
    icon: Split,
    color: '#6366F1',
    label: 'Application Load Balancer with healthy EC2 targets — status: healthy',
    description: 'Health checks every 30 seconds. Automatic failover ready.'
  },
  {
    id: 10,
    service: 'Auto Scaling',
    icon: TrendingUp,
    color: '#22C55E',
    label: 'Target tracking policy: CPU 60%, min 1, max 2 instances',
    description: 'Automatically scales to handle traffic spikes.'
  },
  {
    id: 11,
    service: 'CloudWatch',
    icon: Activity,
    color: '#EC4899',
    label: 'Live dashboard: EC2 CPU, Lambda invocations, payment.transfer.success',
    description: 'Real-time metrics and billing alarm at $1 threshold.'
  },
  {
    id: 12,
    service: 'CodePipeline',
    icon: GitBranch,
    color: '#6366F1',
    label: 'All 3 stages green: Source → Build → Deploy',
    description: 'Automatic deployments on every GitHub push.'
  }
]

export function EvidenceWall() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [uploadedImages, setUploadedImages] = useState<Record<number, string>>({})
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const handleImageUpload = useCallback((cardId: number, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImages(prev => ({
          ...prev,
          [cardId]: e.target!.result as string
        }))
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const handleRemoveImage = useCallback((cardId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setUploadedImages(prev => {
      const newImages = { ...prev }
      delete newImages[cardId]
      return newImages
    })
  }, [])

  return (
    <section 
      id="evidence"
      ref={ref}
      className="relative min-h-screen py-16 px-4"
      style={{ backgroundColor: '#050508' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              This is not theoretical.
            </h2>
            <p className="text-[#94A3B8] max-w-xl">
              Every service shown running. Total infrastructure cost: zero.
              Click any card to upload your deployment screenshot.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="mt-4 md:mt-0"
          >
            <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] px-4 py-2 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]"></span>
              </span>
              LIVE DEPLOYMENT
            </div>
          </motion.div>
        </div>

        {/* Evidence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EVIDENCE_CARDS.map((card, index) => {
            const Icon = card.icon
            // Stagger with slight variation in row
            const row = Math.floor(index / 4)
            const col = index % 4
            const delay = (row * 0.1) + (col * 0.08)

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay, duration: 0.5 }}
                className="group relative"
              >
                <div 
                  className="relative bg-[#0a0a12] rounded-lg border border-[#1a1a2e] overflow-hidden transition-all duration-300 hover:border-opacity-50 hover:-translate-y-1 cursor-pointer"
                  style={{ 
                    borderColor: `${card.color}30`,
                  }}
                  onClick={() => fileInputRefs.current[card.id]?.click()}
                >
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => { fileInputRefs.current[card.id] = el }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(card.id, file)
                    }}
                  />

                  {/* Screenshot area */}
                  <div 
                    className="aspect-video flex flex-col items-center justify-center p-4 relative overflow-hidden"
                    style={{ backgroundColor: `${card.color}08` }}
                  >
                    {uploadedImages[card.id] ? (
                      <>
                        <img 
                          src={uploadedImages[card.id]} 
                          alt={`${card.service} screenshot`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => handleRemoveImage(card.id, e)}
                          className="absolute top-2 right-2 z-20 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-2 left-2 z-10 bg-black/70 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {card.service}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Glow effect */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: `radial-gradient(circle at center, ${card.color}20 0%, transparent 70%)`
                          }}
                        />
                        
                        <Icon 
                          className="w-8 h-8 mb-2 relative z-10 transition-transform group-hover:scale-110" 
                          style={{ color: card.color }} 
                        />
                        <span 
                          className="text-sm font-medium relative z-10"
                          style={{ color: card.color }}
                        >
                          {card.service}
                        </span>
                        <div className="absolute bottom-2 flex items-center gap-1 text-xs text-[#94A3B8]/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="w-3 h-3" />
                          Click to upload
                        </div>
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-sm text-[#94A3B8] leading-relaxed line-clamp-2">
                      {card.label}
                    </p>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#050508]/95 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon className="w-8 h-8 mb-3" style={{ color: card.color }} />
                    <p className="text-sm text-white text-center mb-3">{card.label}</p>
                    <p className="text-xs text-[#94A3B8] text-center">{card.description}</p>
                    <button 
                      className="mt-4 text-xs flex items-center gap-1 transition-colors hover:text-white"
                      style={{ color: card.color }}
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#6366F1] text-[#6366F1] rounded-lg hover:bg-[#6366F1]/10 transition-colors"
          >
            <GitBranch className="w-4 h-4" />
            View GitHub Repository
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#94A3B8] text-[#94A3B8] rounded-lg hover:bg-white/5 transition-colors"
          >
            <Terminal className="w-4 h-4" />
            View Spring Boot Source
          </a>
        </motion.div>

        {/* Deployment info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-xs font-mono text-[#94A3B8]/60">
            Deployed: April 2026 | Region: ap-south-1 (Mumbai) | Duration: 3 hours | Cost: Rs 0.00
          </p>
        </motion.div>
      </div>
    </section>
  )
}
