import EnhancedHero from '../components/enhanced-hero'
import { FAQ } from '../components/faq'
import { FeatureSection } from '../components/feature-section'
import { Footer } from '../components/footer'
import { NavBar } from '../components/nav-bar'
import { Pricing } from '../components/pricing'
import { Testimonials } from '../components/testimonials'
import '../styles/animations.css'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main>
        <EnhancedHero />
        <FeatureSection />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
