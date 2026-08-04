import { ArrowRight } from 'lucide-react'
import { images } from '../../generatedImages'
import './PromoBanner.css'

export default function PromoBanner() {
  return (
    <section className="section promo-section">
      <div className="container">
        <div className="promo-card" data-reveal>
          <img src={images.promo} alt="Desert safari camp" />
          <div className="promo-overlay" />
          <div className="promo-copy"><span className="eyebrow-pill">✧ Limited offer</span><h2>Desert Safari packages — <em>up to 30% off</em> this season.</h2><p>Evening, premium and VIP overnight safaris. Free pickup from anywhere in Dubai.</p></div>
          <div className="promo-price"><span>Starting from</span><div><strong>99</strong><b>AED</b><s>149</s></div><a href="#contact" className="button button-gold">Book Now <ArrowRight size={18} /></a><small>Free cancellation up to 24 hours before</small></div>
        </div>
      </div>
    </section>
  )
}
