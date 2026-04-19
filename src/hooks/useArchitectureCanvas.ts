'use client'

import { useCallback, useMemo, useState } from 'react'
import { awsServiceMap, awsServices, type AWSService } from '@/src/data/services'

type ActiveTab = 'what' | 'why' | 'how'

interface UseArchitectureCanvasResult {
  placedServices: string[]
  selectedService: AWSService | null
  activeTab: ActiveTab
  placeService: (id: string) => void
  selectService: (id: string) => void
  setActiveTab: (tab: ActiveTab) => void
  isComplete: boolean
  progressPercent: number
}

export function useArchitectureCanvas(): UseArchitectureCanvasResult {
  const [placedServices, setPlacedServices] = useState<string[]>([])
  const [selectedService, setSelectedService] = useState<AWSService | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('what')

  const placeService = useCallback((id: string) => {
    if (!awsServiceMap.has(id)) {
      return
    }

    setPlacedServices((prev) => {
      if (prev.includes(id)) {
        return prev
      }

      return [...prev, id]
    })
  }, [])

  const selectService = useCallback((id: string) => {
    const service = awsServiceMap.get(id) ?? null
    setSelectedService(service)
  }, [])

  const isComplete = useMemo(() => {
    return placedServices.length === awsServices.length
  }, [placedServices.length])

  const progressPercent = useMemo(() => {
    return Math.round((placedServices.length / awsServices.length) * 100)
  }, [placedServices.length])

  return {
    placedServices,
    selectedService,
    activeTab,
    placeService,
    selectService,
    setActiveTab,
    isComplete,
    progressPercent
  }
}
