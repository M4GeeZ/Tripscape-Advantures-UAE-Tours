import { ArrowRight, MapPin, Star } from 'lucide-react'
import './TourCard.css'

export default function TourCard({ tour }) {
  const hasFixedPrice = tour.price !== 'Contact for price'

  return (
    <article className="tour-card-reference" data-reveal>
      <div className="tour-card-image-wrap">
        <img src={tour.image} alt={tour.title} className="tour-card-image" loading="lazy" />
      </div>

      <div className="tour-card-body">
        <div className="tour-card-rating">
          <Star size={15} fill="currentColor" />
          <span>{tour.rating} · {tour.reviews} reviews</span>
        </div>

        <h3>{tour.title}</h3>

        <div className="tour-card-location">
          <MapPin size={14} />
          <span>{tour.location}</span>
        </div>

        <div className="tour-card-divider" />

        <div className="tour-card-footer">
          <div className={`tour-card-price ${hasFixedPrice ? 'fixed-price' : 'contact-price'}`}>
            {hasFixedPrice && <small>FROM</small>}
            <div>
              <strong>{tour.price}</strong>
              {hasFixedPrice && tour.unit && <span>{tour.unit}</span>}
            </div>
          </div>

          <a href="/contact" aria-label={`Book ${tour.title}`}>
            Book <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </article>
  )
}
