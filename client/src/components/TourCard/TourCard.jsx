import { MapPin, Star } from 'lucide-react'
import ExperienceCardActions from '../ExperienceCardActions/ExperienceCardActions'
import { ExperiencePriceRow } from '../ExperienceCard/ExperienceCard'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
import './TourCard.css'
import { applyTourPricing } from '../../utils/tourPricing'
import { useTourCardImage } from '../../utils/tourImages'

export default function TourCard({ tour: rawTour }) {
  const tour = applyTourPricing(rawTour)
  const cardImage = useTourCardImage(tour.title, tour.image, tour.slug)
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
          <img src={cardImage} alt={tour.title} className="tour-card-image" loading="lazy" />
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

        <ExperiencePriceRow price={tour.price} priceNote={tour.unit} />

        <ExperienceCardActions title={tour.title} detailHref={detailHref} />
      </div>
    </article>
  )
}
