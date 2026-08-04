import { ArrowUpRight, Clock3, MapPin, Star } from 'lucide-react'
import './TourCard.css'

export default function TourCard({ tour }) {
  const handlePointerMove = (event) => {
    if (window.matchMedia('(hover: none)').matches) return
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    card.style.setProperty('--ry', `${(x - .5) * 8}deg`)
    card.style.setProperty('--rx', `${(.5 - y) * 7}deg`)
    card.style.setProperty('--mx', `${x * 100}%`)
    card.style.setProperty('--my', `${y * 100}%`)
  }

  const resetTilt = (event) => {
    const card = event.currentTarget
    card.style.setProperty('--ry', '0deg')
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--mx', '50%')
    card.style.setProperty('--my', '50%')
  }

  return (
    <article
      className="tour-card-3d"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      data-reveal
    >
      <div className="tour-card-image-wrap">
        <img src={tour.image} alt={tour.title} className="tour-card-image" loading="lazy" />
        <div className="tour-card-image-shade" />
        <span className="tour-card-category">{tour.category}</span>
        {tour.featured && <span className="tour-card-featured">Popular</span>}
      </div>

      <div className="tour-card-body">
        <div className="tour-card-rating">
          <Star size={14} fill="currentColor" />
          <strong>{tour.rating}</strong>
          <span>({tour.reviews} reviews)</span>
        </div>

        <h3>{tour.title}</h3>
        <p>{tour.description}</p>

        <div className="tour-card-meta">
          <span><Clock3 size={14} />{tour.duration}</span>
          <span><MapPin size={14} />{tour.location}</span>
        </div>

        <div className="tour-card-footer">
          <div>
            <small>From</small>
            <strong>{tour.price}</strong>
          </div>
          <a href="#contact" aria-label={`View ${tour.title}`}>
            View tour <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
      <span className="tour-card-glow" aria-hidden="true" />
    </article>
  )
}
