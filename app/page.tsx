import { NavBar } from '@/components/nav-bar'
import { CinematicOpener } from '@/components/sections/cinematic-opener'
import { ArchitectureCanvas } from '@/components/sections/architecture-canvas'
import { LivePaymentJourney } from '@/components/sections/live-payment-journey'
import { EvidenceWall } from '@/components/sections/evidence-wall'
import { CostReveal } from '@/components/sections/cost-reveal'
import { DeveloperFooter } from '@/components/sections/developer-footer'

export default function CloudCanvas() {
  return (
    <main className="relative">
      {/* Navigation */}
      <NavBar />
      
      {/* Section 1: Cinematic Opener */}
      <CinematicOpener />
      
      {/* Section 2: Architecture Canvas */}
      <ArchitectureCanvas />
      
      {/* Section 3: Live Payment Journey */}
      <LivePaymentJourney />
      
      {/* Section 4: Evidence Wall */}
      <EvidenceWall />
      
      {/* Section 5: Cost Reveal */}
      <CostReveal />
      
      {/* Footer: Developer Credit */}
      <DeveloperFooter />
    </main>
  )
}
