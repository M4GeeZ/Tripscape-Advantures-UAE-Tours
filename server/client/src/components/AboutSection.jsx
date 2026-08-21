import { BadgeCheck } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { images } from '../generatedImages'

export default function AboutSection() {
  const features = ['Expertise and Passion', 'Personalized Attention', 'Uncompromising Quality', 'Seamless Planning and Support', 'Customer Satisfaction']
  return (
    <section id="about" className="section cream-section about-section">
      <div className="container about-grid">
        <div className="about-collage" data-reveal>
          <img src={images.aboutPrimary} alt="Dubai experience" />
          <img src={images.aboutSecondary} alt="UAE landmark" />
          <div className="about-badge"><strong>Tripscape Adventures</strong><span>Creating unforgettable travel experiences.</span></div>
        </div>
        <div>
          <SectionHeading eyebrow="About Tripscape" title="Your trusted partner for remarkable journeys." copy="Tripscape Adventures Tourism is a premium travel company dedicated to providing exceptional travel experiences and creating unforgettable memories for valued clients." />
          <div className="about-list">
            {features.map((feature) => <span key={feature}><BadgeCheck size={17} />{feature}</span>)}
          </div>
          <div className="service-mini-grid">
            <article><h4>Tailor-Made Travel</h4><p>Personalized itineraries designed around your needs.</p></article>
            <article><h4>Adventure Tourism</h4><p>Authentic experiences that combine excitement and comfort.</p></article>
            <article><h4>Cultural Immersion</h4><p>Historical landmarks, local communities and cuisine.</p></article>
            <article><h4>Luxury Travel</h4><p>Private transfers, curated dining and VIP access.</p></article>
          </div>
          <a href="#contact" className="button button-gold compact">Our Story</a>
        </div>
      </div>
    </section>
  )
}
