import { useRef } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { images } from '../../generatedImages'
import './About.css'

const values = [
  'Expertise and Passion',
  'Personalized Attention',
  'Uncompromising Quality',
  'Seamless Planning and Support',
  'Customer Satisfaction'
]

const pillars = [
  { title: 'Tailor-Made Travel Experiences', copy: 'Personalized itineraries designed around your specific interests and needs.' },
  { title: 'Adventure Tourism', copy: 'Adventure tourism options that promise excitement, exploration, and unforgettable moments.' },
  { title: 'Cultural Immersion', copy: 'Historical landmarks, local communities, traditional ceremonies, and authentic cuisines.' },
  { title: 'Luxury Travel', copy: 'High-end travel experiences, private transportation, curated dining, and VIP access.' }
]

export default function About({ menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  useLuxuryReveal(pageRef)

  return (
    <div className="about-page" ref={pageRef}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="light" showTopBar />
      <main>
        <section className="about-hero-lux">
          <div className="about-hero-noise" />
          <div className="container about-hero-grid">
            <div className="about-visual" data-hero-reveal>
              <div className="about-visual-main">
                <img src={images.aboutPrimary} alt="Tripscape travel experiences" />
              </div>
              <div className="about-visual-secondary">
                <img src={images.aboutSecondary} alt="UAE destination" />
              </div>
              <div className="about-visual-card">
                <span>Tripscape</span>
                <strong>Adventures</strong>
                <p>Creating unforgettable travel experiences for adventurers around the world.</p>
              </div>
              <span className="about-visual-ring" aria-hidden="true" />
            </div>

            <div className="about-copy">
              <span className="about-kicker" data-hero-reveal>About Tripscape</span>
              <h1 data-hero-reveal>Your trusted partner for remarkable journeys.</h1>
              <p data-hero-reveal>
                Tripscape Adventures Tourism is a premier travel company dedicated to providing exceptional travel experiences and creating unforgettable memories for our valued clients. With a passion for exploration and a commitment to excellence, we strive to be your trusted partner in curating remarkable journeys across the globe.
              </p>
              <p data-hero-reveal>
                Our mission is to deliver unparalleled travel experiences that inspire and captivate our clients. We aim to create customized itineraries, incorporating unique destinations, authentic cultural encounters, and thrilling adventures, while ensuring the highest standards of service and customer satisfaction.
              </p>

              <div className="about-values" data-hero-reveal>
                {values.map((value) => <span key={value}><CheckCircle2 size={15} /> {value}</span>)}
              </div>

              <div className="about-pillar-grid">
                {pillars.map((pillar, index) => (
                  <article key={pillar.title} data-lux-reveal data-reveal-delay={(index % 2) * .08}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.copy}</p>
                  </article>
                ))}
              </div>

              <a className="button button-gold about-cta" href="/tours" data-lux-reveal>
                Explore Our Tours <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
