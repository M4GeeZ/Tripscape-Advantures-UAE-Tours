import { ArrowLeft, ArrowRight, Clock, Star } from 'lucide-react'
import { useRef } from 'react'
import { tours } from '../data'
import SectionHeading from './SectionHeading'

export default function TourCarousel() {
  const trackRef = useRef(null)
  const scroll = (direction) => trackRef.current?.scrollBy({ left: direction * 420, behavior: 'smooth' })

  return (
    <section id="tours" className="section white-section overflow-hidden">
      <div className="container">
        <div className="heading-row">
          <SectionHeading eyebrow="Top experiences" title="Top-rated tours, hand-picked." copy="Our most-booked experiences this month — verified guides, instant confirmations, free WhatsApp re-scheduling." />
          <div className="round-controls">
            <button onClick={() => scroll(-1)}><ArrowLeft /></button>
            <button onClick={() => scroll(1)}><ArrowRight /></button>
          </div>
        </div>
      </div>
      <div ref={trackRef} className="horizontal-track tour-track">
        {tours.map((tour) => (
          <article className="tour-card" key={tour.title} data-reveal>
            <div className="tour-image-wrap">
              <img src={tour.image} alt={tour.title} loading="lazy" />
              <span className="card-tag">{tour.tag}</span>
              <span className="card-meta"><Clock size={15} />{tour.meta}</span>
            </div>
            <div className="tour-card-body">
              <div className="rating"><Star size={16} fill="currentColor" /> 4.9 · 0 reviews</div>
              <h3>{tour.title}</h3>
              <div className="tour-card-footer"><strong>{tour.price}</strong><a href="#contact">View <ArrowRight size={16} /></a></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
