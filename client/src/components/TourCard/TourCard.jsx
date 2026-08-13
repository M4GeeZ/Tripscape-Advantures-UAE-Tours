import { ArrowRight, MapPin, Star } from 'lucide-react'
import { getTourDetailHref } from '../../tourDetails'
import './TourCard.css'

export default function TourCard({ tour }) {
  const hasFixedPrice = tour.price !== 'Contact for price'
  const detailHref = getTourDetailHref(tour.category || 'Tours', tour.title)

  return (
    <a
      className="tour-card-reference tour-card-reference--link"
      data-reveal
      href={detailHref}
      aria-label={`View ${tour.title}`}
    >
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

          <span className="tour-card-reference__action">
            View <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </a>
  )
}
