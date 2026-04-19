'use client'

import { useCallback, useMemo, useState } from 'react'
import { demoSteps } from '@/src/data/demoSteps'

interface UseDemoPlayerResult {
  currentStep: number
  highlightedServices: string[]
  nextStep: () => void
  prevStep: () => void
  isLastStep: boolean
}

export function useDemoPlayer(): UseDemoPlayerResult {
  const [currentStep, setCurrentStep] = useState<number>(0)

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, demoSteps.length - 1))
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const highlightedServices = useMemo(() => {
    return demoSteps[currentStep]?.highlightedServices ?? []
  }, [currentStep])

  const isLastStep = useMemo(() => {
    return currentStep === demoSteps.length - 1
  }, [currentStep])

  return {
    currentStep,
    highlightedServices,
    nextStep,
    prevStep,
    isLastStep
  }
}
