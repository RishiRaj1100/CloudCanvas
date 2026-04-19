'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, CreditCard, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface SecurePayModalProps {
  open: boolean
  onClose: () => void
}

const THINGS_TO_TRY = [
  'Register as a customer or merchant',
  'Add money using test card 4111 1111 1111 1111',
  'Send money to another test account',
  'Watch the fraud detector flag a Rs 60,000 transfer',
  'Download a receipt from S3',
  'View the merchant analytics dashboard',
]

export function SecurePayModal({ open, onClose }: SecurePayModalProps) {
  const [copied, setCopied] = useState(false)

  const copyTestCard = () => {
    navigator.clipboard.writeText('4111 1111 1111 1111')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg bg-[#0a0a12] rounded-2xl border border-[#6366F1]/30 overflow-hidden"
              style={{ boxShadow: '0 0 60px rgba(99, 102, 241, 0.15)' }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#2a2a3e] transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="p-6">
                {/* Live Demo badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                  </span>
                  <span className="text-xs font-medium text-[#6366F1]">Live Demo</span>
                </div>

                {/* Heading */}
                <h2 className="text-2xl font-bold text-white mb-3">
                  You are entering SecurePay
                </h2>

                <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">
                  This is the actual SecurePay application running on AWS — EC2, RDS, Lambda, S3, 
                  and CloudFront all live. You can register a real test account and process a real 
                  test payment using Razorpay test mode. No real money moves.
                </p>

                {/* Things to try */}
                <div className="mb-6">
                  <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
                    Things to try
                  </h3>
                  <ul className="space-y-2">
                    {THINGS_TO_TRY.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-white">
                        <span className="text-[#6366F1] mt-0.5">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Test credentials */}
                <div className="bg-[#050508] rounded-lg border border-[#1a1a2e] p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#6366F1]" />
                      <span className="text-xs font-medium text-[#94A3B8]">Test Credentials</span>
                    </div>
                    <button
                      onClick={copyTestCard}
                      className="flex items-center gap-1 text-xs text-[#6366F1] hover:text-white transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy card
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-sm text-[#94A3B8] space-y-1">
                    <div>Test card: <span className="text-white">4111 1111 1111 1111</span></div>
                    <div>Expiry: <span className="text-white">Any future date</span></div>
                    <div>CVV: <span className="text-white">Any 3 digits</span></div>
                    <div>OTP: <span className="text-white">1234</span></div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#5558E8] transition-colors"
                  >
                    Enter SecurePay
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-[#1a1a2e] text-[#94A3B8] rounded-lg font-medium hover:bg-[#1a1a2e]/50 hover:text-white transition-colors"
                  >
                    Stay on CloudCanvas
                  </button>
                </div>

                {/* Footer note */}
                <p className="mt-4 text-center text-xs text-[#94A3B8]/60 font-mono">
                  SecurePay runs on AWS Free Tier — ap-south-1 (Mumbai)
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
