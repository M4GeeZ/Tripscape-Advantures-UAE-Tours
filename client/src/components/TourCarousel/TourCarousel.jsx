import { useEffect, useMemo, useState } from 'react'
import { Clock, Star } from 'lucide-react'
import { tours, tourCatalog } from '../../data'
import { images } from '../../generatedImages'
import SectionHeading from '../SectionHeading/SectionHeading'
import ExperienceCardActions from '../ExperienceCardActions/ExperienceCardActions'
import { ExperiencePriceRow } from '../ExperienceCard/ExperienceCard'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
import './TourCarousel.css'
import { apiUrl } from '../../utils/apiBaseUrl'
import { applyTourPricing } from '../../utils/tourPricing'
import { getTourImages, useTourImageIndex } from '../../utils/tourImages'

const fallbackTour = {
  image: images.adventureEvening,
  tag: 'Desert adventure',
  meta: 'Family',
  title: 'Family Desert Safari & Quad Experience',
  price: ''
}

const featuredImagesByTitle = {
  'Morning Desert Safari with Quad Bike': '/images/top-experiences/morning-desert-safari-quad-bike.webp',
  'Evening Desert Safari with BBQ Dinner': '/images/top-experiences/evening-desert-safari-bbq-dinner.webp',
  'VIP Desert Safari with Private Seating': '/images/top-experiences/vip-desert-safari-private-seating.webp',
  'VIP Premium Desert Safari with BBQ Dinner': '/images/top-experiences/vip-premium-desert-safari-bbq-dinner.webp',
  'Sunrise Camel Trekking': '/images/top-experiences/sunrise-camel-trekking.webp',
  'Desert Safari with Dinner at Caravanserai': '/images/top-experiences/desert-safari-dinner-caravanserai.webp'
}

// Fixed order of the "Top-rated tours" cards on the home page.
const HOME_TOUR_ORDER = [
  'Morning Desert Safari with Quad Bike',
  'VIP Premium Desert Safari with BBQ Dinner',
  'Evening Desert Safari with BBQ Dinner',
  'Hummer Desert Safari',
  'The Desert Dreamscape',
  'Sunrise Camel Trekking',
  'Desert Safari with Dinner at Caravanserai',
  'Desert Safari with VIP Setup',
  'Noble Camp Private Desert Safari',
  'Private Dune Buggy Tour',
  'Sunset Dune Buggy Ride',
  'Morning Dune Buggy Tour',
]

const tourKey = (item) => String(item?.sourceTitle || item?.title || '').trim().toLowerCase()

// Cards in HOME_TOUR_ORDER first (admin data wins over static data for the same tour),
// then any other featured admin tours in their admin sort order.
function orderHomeTours(dynamicTours = []) {
  const byKey = new Map()
  for (const item of [...tourCatalog, ...tours]) {
    if (tourKey(item)) byKey.set(tourKey(item), item)
  }
  for (const item of dynamicTours) {
    if (tourKey(item)) byKey.set(tourKey(item), { ...byKey.get(tourKey(item)), ...item })
  }

  const ordered = HOME_TOUR_ORDER.map((title) => byKey.get(title.toLowerCase())).filter(Boolean)
  const listed = new Set(HOME_TOUR_ORDER.map((title) => title.toLowerCase()))
  const extras = dynamicTours.filter((item) => !listed.has(tourKey(item)))
  const result = [...ordered, ...extras]
  return result.length ? result : [fallbackTour]
}

export default function TourCarousel() {
  const [dynamicTours, setDynamicTours] = useState([])
  const [dynamicLoaded, setDynamicLoaded] = useState(false)
  const tourImageIndex = useTourImageIndex()

  useEffect(() => {
    fetch(apiUrl('/api/tours'))
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        setDynamicTours(Array.isArray(items) ? items.filter((item) => item?.published !== false && item?.featured) : [])
        setDynamicLoaded(true)
      })
      .catch(() => setDynamicLoaded(true))
  }, [])

  const displayedTours = useMemo(() => {
    const source = orderHomeTours(dynamicLoaded ? dynamicTours : [])

    return source.map((rawTour) => {
      const tour = applyTourPricing(rawTour)
      const sourceTitle = tour.sourceTitle || tour.title
      const detailHref = tour.href || (tour.slug && tour.categorySlug
        ? `/tours/${tour.categorySlug}/${tour.slug}`
        : getTourDetailHref(tour.category || 'Desert Safari', sourceTitle))
      const points = tour.points?.length
        ? tour.points.slice(0, 5)
        : tour.included?.length
          ? tour.included.slice(0, 5)
          : getCardPoints(tour.category || 'Desert Safari', sourceTitle, tour.description || '', 5)
      const isDreamscape = tour.title === 'The Desert Dreamscape'

      return {
        ...tour,
        detailHref,
        points,
        // Image 1 from the admin panel first, then the built-in card image.
        image: (getTourImages(tour.title, tour.slug) || getTourImages(sourceTitle))?.[0] || tour.featuredImage || featuredImagesByTitle[sourceTitle] || tour.image,
        displayTitle: isDreamscape ? 'The Desert Dreamscape Ultra Romantic Private Setup' : tour.title,
        isDreamscape,
      }
    })
  }, [dynamicLoaded, dynamicTours, tourImageIndex])

  return (
    <section id="tours" className="section white-section">
      <div className="container">
        <div className="heading-row">
          <SectionHeading
            eyebrow="Top experiences"
            title="Top-rated tours, hand-picked."
            copy="Our most-booked experiences this month — verified guides, instant confirmations, free WhatsApp re-scheduling."
          />
        </div>

        <div className="tour-grid">
          {displayedTours.map((tour, index) => (
            <article className="tour-card" key={`${tour._id || tour.id || tour.title}-${index}`} data-reveal>
              <a href={tour.detailHref} className="tour-image-link" aria-label={`View ${tour.title}`}>
                <div className="tour-image-wrap">
                  <img
                    className={[
                      tour.imageFit === 'contain' && tour.title !== 'Hummer Desert Safari' ? 'tour-image-contain' : '',
                      tour.title === 'Hummer Desert Safari' ? 'tour-image-hummer' : ''
                    ].filter(Boolean).join(' ')}
                    src={tour.image}
                    alt={tour.title}
                    loading="lazy"
                  />
                  {!tour.hideTag && <span className="card-tag">{tour.tag || tour.category || 'Tour'}</span>}
                  {tour.meta && !tour.isDreamscape && <span className="card-meta"><Clock size={15} />{tour.meta}</span>}
                  {!tour.meta && tour.duration && !tour.isDreamscape && <span className="card-meta"><Clock size={15} />{tour.duration}</span>}
                </div>
              </a>

              <div className="tour-card-body">
                <div className="rating"><Star size={16} fill="currentColor" /> {tour.rating || '4.9'} · {tour.reviews ?? 0} reviews</div>
                <h3><a href={tour.detailHref}>{tour.displayTitle || tour.title}</a></h3>
                <ul className="experience-card-points">
                  {tour.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
                <ExperiencePriceRow price={tour.price} priceNote={tour.unit} />
                <ExperienceCardActions title={tour.title} detailHref={tour.detailHref} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

