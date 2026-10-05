import { MapPin, Star } from 'lucide-react'
import ExperienceCardActions from '../ExperienceCardActions/ExperienceCardActions'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
import './TourCard.css'

export default function TourCard({ tour }) {
  const displayPrice = String(tour.price || '').trim()
  const showPrice = Boolean(displayPrice) && !/^contact for price$/i.test(displayPrice) && !/^from\s*aed\s*0$/i.test(displayPrice) && !/^aed\s*0$/i.test(displayPrice)
  const category = tour.category || 'Tours'
  const detailHref = tour.href || (tour.slug && tour.categorySlug
    ? `/tours/${tour.categorySlug}/${tour.slug}`
    : getTourDetailHref(category, tour.title))
  const points = tour.included?.length
    ? tour.included.slice(0, 7)
    : getCardPoints(category, tour.title, tour.description, 7)

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

        <ul className="experience-card-points">
          {points.map((point) => <li key={point}>{point}</li>)}
        </ul>

        <div className="tour-card-divider" />

        {showPrice && (
          <div className="tour-card-price-row">
            <div className="tour-card-price fixed-price">
              <small>FROM</small>
              <div>
                <strong>{displayPrice}</strong>
                {tour.unit && <span>{tour.unit}</span>}
              </div>
            </div>
          </div>
        )}

        <ExperienceCardActions title={tour.title} detailHref={detailHref} />
      </div>
    </article>
  )
}
