import { MapPin, Star } from 'lucide-react'
import ExperienceCardActions from '../ExperienceCardActions/ExperienceCardActions'
import { getTourDetailHref } from '../../tourDetails'
import { getCardDescription } from '../../utils/cardContent'
import './TourCard.css'

export default function TourCard({ tour }) {
  const hasFixedPrice = tour.price !== 'Contact for price'
  const category = tour.category || 'Tours'
  const detailHref = getTourDetailHref(category, tour.title)
  const description = getCardDescription(category, tour.title, tour.description)

  return (
    <article className="tour-card-reference" data-reveal>
      <a className="tour-card-image-link" href={detailHref} aria-label={`View ${tour.title}`}>
        <div className="tour-card-image-wrap">
          <img src={tour.image} alt={tour.title} className="tour-card-image" loading="lazy" />
        </div>
      </a>

      <div className="tour-card-body">
        <div className="tour-card-rating">
          <Star size={15} fill="currentColor" />
          <span>{tour.rating} · {tour.reviews} reviews</span>
        </div>

        <h3><a href={detailHref}>{tour.title}</a></h3>

        <div className="tour-card-location">
          <MapPin size={14} />
          <span>{tour.location}</span>
        </div>

        <p className="experience-card-description">{description}</p>

        <div className="tour-card-divider" />

        <div className="tour-card-price-row">
          <div className={`tour-card-price ${hasFixedPrice ? 'fixed-price' : 'contact-price'}`}>
            {hasFixedPrice && <small>FROM</small>}
            <div>
              <strong>{tour.price}</strong>
              {hasFixedPrice && tour.unit && <span>{tour.unit}</span>}
            </div>
          </div>
        </div>

        <ExperienceCardActions title={tour.title} detailHref={detailHref} />
      </div>
    </article>
  )
}
