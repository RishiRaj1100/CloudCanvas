"use client"

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { 
  Monitor, Server, Database, Activity, Shield, FileText,
  ExternalLink, X, ChevronLeft, ChevronRight, CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EvidenceItem {
  id: string
  title: string
  description: string
  icon: React.ElementType
  service: string
  details: string[]
  color: string
}

const evidenceItems: EvidenceItem[] = [
  {
    id: 'ec2',
    title: 'EC2 Dashboard',
    description: 'Two t2.micro instances running Spring Boot',
    icon: Server,
    service: 'Amazon EC2',
    details: [
      'Instance Type: t2.micro (Free Tier eligible)',
      'Operating System: Amazon Linux 2023',
      'vCPUs: 1, Memory: 1 GB',
      'Auto Scaling Group: 2 instances',
      'Status: Running (green checks)',
    ],
    color: '#FF9900'
  },
  {
    id: 'rds',
    title: 'RDS Database',
    description: 'PostgreSQL with automated backups',
    icon: Database,
    service: 'Amazon RDS',
    details: [
      'Engine: PostgreSQL 15.4',
      'Instance: db.t2.micro (Free Tier)',
      'Storage: 20 GB SSD',
      'Multi-AZ: Enabled',
      'Automated Backups: 7-day retention',
    ],
    color: '#3B48CC'
  },
  {
    id: 'cloudwatch',
    title: 'CloudWatch Metrics',
    description: 'Real-time monitoring and alerting',
    icon: Activity,
    service: 'Amazon CloudWatch',
    details: [
      'Custom Dashboards: Transaction metrics',
      'Alarms: CPU > 80%, Error rate > 1%',
      'Log Groups: Application, Access logs',
      'Metrics: Latency, Throughput, Error count',
      'Retention: 30 days',
    ],
    color: '#FF4F8B'
  },
  {
    id: 'lambda',
    title: 'Lambda Functions',
    description: 'Fraud detection with ML inference',
    icon: Shield,
    service: 'AWS Lambda',
    details: [
      'Runtime: Python 3.11',
      'Memory: 256 MB',
      'Timeout: 30 seconds',
      'Invocations: ~1000/day during testing',
      'Average Duration: 200ms',
    ],
    color: '#FF9900'
  },
  {
    id: 's3',
    title: 'S3 Storage',
    description: 'Transaction receipts and documents',
    icon: FileText,
    service: 'Amazon S3',
    details: [
      'Bucket: securepay-receipts',
      'Storage Class: Standard',
      'Encryption: AES-256 server-side',
      'Versioning: Enabled',
      'Objects: ~500 test receipts',
    ],
    color: '#569A31'
  },
  {
    id: 'console',
    title: 'AWS Console',
    description: 'Unified management dashboard',
    icon: Monitor,
    service: 'AWS Management Console',
    details: [
      'Region: ap-south-1 (Mumbai)',
      'IAM Users: 1 admin, 1 service account',
      'VPC: Custom with 2 subnets',
      'Security Groups: 3 configured',
      'All services in Free Tier limits',
    ],
    color: '#232F3E'
  },
]

interface EvidenceCardProps {
  item: EvidenceItem
  onClick: () => void
  index: number
}

function EvidenceCard({ item, onClick, index }: EvidenceCardProps) {
  const Icon = item.icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative h-full p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/50">
        {/* Decorative gradient */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
          style={{ backgroundColor: item.color }}
        />
        
        {/* Mock window chrome */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
          <span className="ml-2 text-xs font-mono text-muted-foreground">{item.service}</span>
        </div>
        
        {/* Content */}
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${item.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: item.color }} />
          </div>
          <div>
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>
        
        {/* View button */}
        <div className="flex items-center gap-2 mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View Details</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  )
}

interface EvidenceModalProps {
  item: EvidenceItem | null
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  currentIndex: number
  total: number
}

function EvidenceModal({ item, onClose, onNext, onPrev, currentIndex, total }: EvidenceModalProps) {
  if (!item) return null
  
  const Icon = item.icon
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-card rounded-2xl border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <Icon className="w-6 h-6" style={{ color: item.color }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.service}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Mock screenshot area */}
          <div className="relative rounded-xl border border-border bg-muted/30 p-8 mb-6">
            <div className="grid-pattern absolute inset-0 opacity-30" />
            <div className="relative text-center">
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon className="w-10 h-10" style={{ color: item.color }} />
              </div>
              <p className="text-muted-foreground text-sm">
                Actual AWS Console screenshot would appear here
              </p>
            </div>
          </div>
          
          {/* Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Configuration Details
            </h4>
            {item.details.map((detail, index) => (
              <motion.div
                key={detail}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
              >
                <CheckCircle2 className="w-4 h-4 text-destructive shrink-0" />
                <span className="text-sm font-mono">{detail}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onPrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {total}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNext}
            disabled={currentIndex === total - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function EvidenceGallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < evidenceItems.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  return (
    <section id="evidence-section" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-destructive/30 bg-destructive/5 mb-6">
            <CheckCircle2 className="w-4 h-4 text-destructive" />
            <span className="text-sm font-mono text-destructive">PROOF OF DEPLOYMENT</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            This <span className="text-gradient">Actually Exists</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Not a mockup. Not a concept. Real AWS services, running real code, 
            processing real test transactions. Here&apos;s the evidence.
          </p>
        </motion.div>

        {/* Evidence grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evidenceItems.map((item, index) => (
            <EvidenceCard
              key={item.id}
              item={item}
              index={index}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
        
        {/* Modal */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <EvidenceModal
              item={evidenceItems[selectedIndex]}
              onClose={() => setSelectedIndex(null)}
              onNext={handleNext}
              onPrev={handlePrev}
              currentIndex={selectedIndex}
              total={evidenceItems.length}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
