'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cloud, 
  Split, 
  Server, 
  Zap, 
  Database, 
  FolderOpen, 
  Activity,
  ChevronRight,
  ChevronDown,
  Check,
  ArrowRight
} from 'lucide-react'

const SERVICES = [
  { id: 'cloudfront', name: 'CloudFront', icon: Cloud, color: '#14B8A6', x: 15, y: 15 },
  { id: 'elb', name: 'ELB', icon: Split, color: '#6366F1', x: 15, y: 35 },
  { id: 'ec2', name: 'EC2', icon: Server, color: '#F59E0B', x: 50, y: 50 },
  { id: 'lambda', name: 'Lambda', icon: Zap, color: '#F59E0B', x: 85, y: 35 },
  { id: 'rds', name: 'RDS', icon: Database, color: '#3B82F6', x: 30, y: 75 },
  { id: 's3', name: 'S3', icon: FolderOpen, color: '#22C55E', x: 70, y: 75 },
  { id: 'cloudwatch', name: 'CloudWatch', icon: Activity, color: '#EC4899', x: 50, y: 90 },
]

const CHAPTERS = [
  {
    id: 1,
    title: 'The Customer',
    activeServices: [],
    phone: {
      balance: '12,450',
      input: '9876543210',
      recipient: 'Rahul Gupta',
      amount: '500',
      status: 'ready'
    },
    caption: 'A payment just began its journey through 10 AWS services in the next 200 milliseconds.'
  },
  {
    id: 2,
    title: 'CloudFront + ELB',
    activeServices: ['cloudfront', 'elb'],
    phone: {
      balance: '12,450',
      input: '9876543210',
      recipient: 'Rahul Gupta',
      amount: '500',
      status: 'sending'
    },
    caption: 'CloudFront receives Priya\'s request at the nearest edge location — Mumbai. Zero latency for Indian users. The load balancer decides which EC2 server has capacity and routes the request there.'
  },
  {
    id: 3,
    title: 'EC2 + Spring Boot',
    activeServices: ['cloudfront', 'elb', 'ec2'],
    phone: {
      balance: '12,450',
      input: '9876543210',
      recipient: 'Rahul Gupta',
      amount: '500',
      status: 'processing'
    },
    caption: 'The Spring Boot application receives Priya\'s transfer request. It validates her JWT token, checks her balance (Rs 12,450 >= Rs 500), and prepares to process the transaction.',
    code: `@PostMapping("/transfer")
public Response transfer(@RequestBody TransferRequest req) {
    User sender = authService.validate(req.getToken());
    if (sender.getBalance() >= req.getAmount()) {
        // Proceed to fraud check...
    }
}`
  },
  {
    id: 4,
    title: 'Lambda Fraud Check',
    activeServices: ['cloudfront', 'elb', 'ec2', 'lambda'],
    phone: {
      balance: '12,450',
      input: '9876543210',
      recipient: 'Rahul Gupta',
      amount: '500',
      status: 'checking'
    },
    caption: 'AWS Lambda checked this transaction against fraud rules in 47ms. Risk score: 12 out of 100. Approved.',
    fraudCheck: {
      request: {
        transactionId: 'TXN_8f3a2c1d',
        amount: 500,
        userId: 'USR_priya_01',
        transactionCount24h: 3,
        riskScore: 12
      },
      response: {
        status: 'APPROVE',
        reason: 'Low risk transaction'
      }
    }
  },
  {
    id: 5,
    title: 'RDS Database',
    activeServices: ['cloudfront', 'elb', 'ec2', 'lambda', 'rds'],
    phone: {
      balance: '12,450',
      input: '9876543210',
      recipient: 'Rahul Gupta',
      amount: '500',
      status: 'updating'
    },
    caption: 'The database atomically debits Priya\'s wallet by Rs 500 and credits Rahul\'s wallet by Rs 500 in a single transaction. If anything fails here, both operations reverse automatically. No money is ever lost.',
    dbUpdate: {
      priya: { before: '12,450', after: '11,950' },
      rahul: { before: '8,200', after: '8,700' }
    }
  },
  {
    id: 6,
    title: 'S3 + CloudWatch',
    activeServices: ['cloudfront', 'elb', 'ec2', 'lambda', 'rds', 's3', 'cloudwatch'],
    phone: {
      balance: '11,950',
      input: '',
      recipient: '',
      amount: '',
      status: 'complete'
    },
    caption: 'A receipt PDF is generated and stored permanently in Amazon S3. CloudWatch logs the metric. The engineering dashboard updates. The system knows this payment succeeded.',
    metric: 'payment.transfer.success +1'
  }
]

export function LivePaymentJourney() {
  const [currentChapter, setCurrentChapter] = useState(0)
  const chapter = CHAPTERS[currentChapter]

  const nextChapter = () => {
    if (currentChapter < CHAPTERS.length - 1) {
      setCurrentChapter(prev => prev + 1)
    }
  }

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1)
    }
  }

  const scrollToNext = () => {
    const nextSection = document.getElementById('evidence')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="journey"
      className="relative min-h-screen py-16 px-4"
      style={{ backgroundColor: '#050508' }}
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
            Watch a Live Payment
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto">
            Follow Priya&apos;s Rs 500 payment to Rahul through every AWS service in real-time.
          </p>
        </motion.div>

        {/* Chapter indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {CHAPTERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentChapter(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentChapter 
                  ? 'w-8 bg-[#6366F1]' 
                  : idx < currentChapter
                    ? 'bg-[#22C55E]'
                    : 'bg-[#1a1a2e]'
              }`}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Phone Mockup */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Phone frame */}
              <div className="relative w-[280px] h-[580px] bg-[#0a0a12] rounded-[40px] border-4 border-[#1a1a2e] overflow-hidden shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#050508] rounded-b-2xl z-10" />
                
                {/* Screen */}
                <div className="h-full pt-8 pb-4 px-4 flex flex-col">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="text-[#6366F1] font-bold text-lg">SecurePay</div>
                    <div className="text-[#94A3B8] text-xs">Priya Sharma</div>
                  </div>

                  {/* Balance */}
                  <motion.div 
                    className="bg-[#6366F1]/10 rounded-xl p-4 mb-6 border border-[#6366F1]/20"
                    key={chapter.phone.balance}
                  >
                    <div className="text-xs text-[#94A3B8] mb-1">Available Balance</div>
                    <motion.div 
                      className="text-2xl font-bold text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Rs {chapter.phone.balance}
                    </motion.div>
                  </motion.div>

                  {/* Transfer form or success */}
                  <AnimatePresence mode="wait">
                    {chapter.phone.status === 'complete' ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center"
                      >
                        <motion.div
                          className="w-16 h-16 rounded-full bg-[#22C55E] flex items-center justify-center mb-4"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: 0.2 }}
                        >
                          <Check className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="text-white font-medium text-lg">Rs 500 sent to Rahul Gupta</div>
                        <div className="text-[#22C55E] text-sm mt-1">Payment Successful</div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        {/* Recipient */}
                        <div>
                          <div className="text-xs text-[#94A3B8] mb-1">Send to</div>
                          <div className="bg-[#0f0f1a] rounded-lg p-3 border border-[#1a1a2e]">
                            {chapter.phone.input ? (
                              <div className="flex items-center justify-between">
                                <span className="text-white">{chapter.phone.input}</span>
                                {chapter.phone.recipient && (
                                  <span className="text-xs text-[#22C55E]">
                                    {chapter.phone.recipient}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[#94A3B8]">Enter phone number</span>
                            )}
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <div className="text-xs text-[#94A3B8] mb-1">Amount</div>
                          <div className="bg-[#0f0f1a] rounded-lg p-3 border border-[#1a1a2e]">
                            {chapter.phone.amount ? (
                              <span className="text-white text-xl font-bold">Rs {chapter.phone.amount}</span>
                            ) : (
                              <span className="text-[#94A3B8]">Rs 0</span>
                            )}
                          </div>
                        </div>

                        {/* Send button */}
                        <motion.button
                          className={`w-full py-3 rounded-lg font-medium transition-all ${
                            chapter.phone.status === 'ready'
                              ? 'bg-[#6366F1] text-white'
                              : 'bg-[#6366F1]/50 text-white/50'
                          }`}
                          animate={chapter.phone.status !== 'ready' ? {
                            opacity: [0.5, 1, 0.5]
                          } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          {chapter.phone.status === 'ready' && 'Send Money'}
                          {chapter.phone.status === 'sending' && 'Sending...'}
                          {chapter.phone.status === 'processing' && 'Processing...'}
                          {chapter.phone.status === 'checking' && 'Verifying...'}
                          {chapter.phone.status === 'updating' && 'Completing...'}
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Particle animation from phone to architecture */}
              {chapter.activeServices.length > 0 && currentChapter > 0 && (
                <motion.div
                  className="absolute top-1/2 right-0 w-4 h-4 rounded-full bg-white"
                  initial={{ x: 0, opacity: 1, scale: 1 }}
                  animate={{ x: 100, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
                  style={{ filter: 'blur(1px)' }}
                />
              )}
            </div>
          </div>

          {/* Architecture Diagram */}
          <div className="flex flex-col">
            {/* Mini architecture */}
            <div className="relative bg-[#0a0a12] rounded-lg border border-[#1a1a2e] p-4 h-[350px]">
              {/* Services */}
              {SERVICES.map((service) => {
                const isActive = chapter.activeServices.includes(service.id)
                const Icon = service.icon

                return (
                  <motion.div
                    key={service.id}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${service.x}%`,
                      top: `${service.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    animate={{
                      opacity: isActive ? 1 : 0.3,
                      scale: isActive ? 1 : 0.9
                    }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: isActive ? `${service.color}30` : '#1a1a2e',
                        border: `1px solid ${isActive ? service.color : '#1a1a2e'}`
                      }}
                      animate={isActive ? {
                        boxShadow: [
                          `0 0 10px ${service.color}`,
                          `0 0 30px ${service.color}`,
                          `0 0 10px ${service.color}`
                        ]
                      } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Icon 
                        className="w-5 h-5" 
                        style={{ color: isActive ? service.color : '#94A3B8' }} 
                      />
                    </motion.div>
                    <span className={`mt-1 text-xs font-medium ${isActive ? 'text-white' : 'text-[#94A3B8]'}`}>
                      {service.name}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Chapter content */}
            <div className="mt-6 bg-[#0a0a12] rounded-lg border border-[#1a1a2e] p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium text-[#6366F1] bg-[#6366F1]/10 px-2 py-1 rounded">
                  Chapter {chapter.id}
                </span>
                <span className="text-white font-medium">{chapter.title}</span>
              </div>

              <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
                {chapter.caption}
              </p>

              {/* Chapter-specific content */}
              {chapter.code && (
                <pre className="text-xs bg-[#050508] p-3 rounded-lg border border-[#1a1a2e] overflow-x-auto mb-4">
                  <code className="text-[#94A3B8] font-mono">{chapter.code}</code>
                </pre>
              )}

              {chapter.fraudCheck && (
                <div className="space-y-2 mb-4">
                  <div className="bg-[#050508] rounded-lg p-3 border border-[#1a1a2e]">
                    <div className="text-xs text-[#94A3B8] mb-1">Request</div>
                    <pre className="text-xs text-[#F59E0B] font-mono">
                      {JSON.stringify(chapter.fraudCheck.request, null, 2)}
                    </pre>
                  </div>
                  <motion.div 
                    className="bg-[#050508] rounded-lg p-3 border border-[#22C55E]/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-xs text-[#22C55E] mb-1">Response</div>
                    <pre className="text-xs text-[#22C55E] font-mono">
                      {JSON.stringify(chapter.fraudCheck.response, null, 2)}
                    </pre>
                  </motion.div>
                </div>
              )}

              {chapter.dbUpdate && (
                <div className="bg-[#050508] rounded-lg p-3 border border-[#3B82F6]/30 mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[#94A3B8]">
                        <th className="text-left py-1">User</th>
                        <th className="text-right py-1">Before</th>
                        <th className="text-right py-1">After</th>
                      </tr>
                    </thead>
                    <tbody className="text-white font-mono">
                      <tr>
                        <td className="py-1">Priya Sharma</td>
                        <td className="text-right text-[#94A3B8]">Rs {chapter.dbUpdate.priya.before}</td>
                        <td className="text-right text-[#EF4444]">Rs {chapter.dbUpdate.priya.after}</td>
                      </tr>
                      <tr>
                        <td className="py-1">Rahul Gupta</td>
                        <td className="text-right text-[#94A3B8]">Rs {chapter.dbUpdate.rahul.before}</td>
                        <td className="text-right text-[#22C55E]">Rs {chapter.dbUpdate.rahul.after}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {chapter.metric && (
                <div className="inline-block bg-[#EC4899]/10 text-[#EC4899] px-3 py-1.5 rounded font-mono text-sm mb-4">
                  {chapter.metric}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1a1a2e]">
                <button
                  onClick={prevChapter}
                  disabled={currentChapter === 0}
                  className="text-[#94A3B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Previous
                </button>

                {currentChapter < CHAPTERS.length - 1 ? (
                  <button
                    onClick={nextChapter}
                    className="flex items-center gap-1 text-[#6366F1] hover:text-white transition-colors text-sm font-medium"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={scrollToNext}
                    className="flex items-center gap-1 text-[#22C55E] hover:text-white transition-colors text-sm font-medium"
                  >
                    See the proof <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Final state message */}
            <AnimatePresence>
              {currentChapter === CHAPTERS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <div className="text-2xl font-bold text-white mb-2">
                    200 milliseconds. 10 AWS services. 1 perfect payment.
                  </div>
                  <button
                    onClick={scrollToNext}
                    className="inline-flex items-center gap-2 text-[#6366F1] hover:text-white transition-colors mt-4"
                  >
                    See the proof <ChevronDown className="w-4 h-4 animate-bounce" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
