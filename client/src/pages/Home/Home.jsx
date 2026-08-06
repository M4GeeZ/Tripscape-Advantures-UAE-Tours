import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero'
import SearchBar from '../../components/SearchBar/SearchBar'
import TrustStrip from '../../components/TrustStrip/TrustStrip'
import TourCarousel from '../../components/TourCarousel/TourCarousel'
import CityTours from '../../components/CityTours/CityTours'
import AdventureSection from '../../components/AdventureSection/AdventureSection'
import HelicopterSection from '../../components/HelicopterSection/HelicopterSection'
import AttractionsSection from '../../components/AttractionsSection/AttractionsSection'
import PromoBanner from '../../components/PromoBanner/PromoBanner'
import AboutSection from '../../components/AboutSection/AboutSection'
import ReviewsSection from '../../components/ReviewsSection/ReviewsSection'
import BlogSection from '../../components/BlogSection/BlogSection'
import SupportCta from '../../components/SupportCta/SupportCta'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import './Home.css'

export default function Home({ menuOpen, setMenuOpen }) {
  return (
    <div className="home-page">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="overlay" />
      <main>
        <Hero />
        <SearchBar />
        <TrustStrip />
        <TourCarousel />
        <CityTours />
        <AdventureSection />
        <HelicopterSection />
        <AttractionsSection />
        <PromoBanner />
        <AboutSection />
        <ReviewsSection />
        <BlogSection />
        <SupportCta />
      </main>
      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
