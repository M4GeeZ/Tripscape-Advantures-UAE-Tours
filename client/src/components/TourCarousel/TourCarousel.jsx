import { Clock, Star } from 'lucide-react'
import { tours } from '../../data'
import { images } from '../../generatedImages'
import SectionHeading from '../SectionHeading/SectionHeading'
import ExperienceCardActions from '../ExperienceCardActions/ExperienceCardActions'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
import './TourCarousel.css'

const fallbackTour = {
  image: images.adventureEvening,
  tag: 'Desert adventure',
  meta: 'Family',
  title: 'Family Desert Safari & Quad Experience',
  price: 'Contact for price'
}

const featuredImagesByTitle = {
  'Morning Desert Safari with Quad Bike': '/images/top-experiences/morning-desert-safari-quad-bike.png',
  'Evening Desert Safari with BBQ Dinner': '/images/top-experiences/evening-desert-safari-bbq-dinner.png',
  'VIP Desert Safari with Private Seating': '/images/top-experiences/vip-desert-safari-private-seating.png',
  'VIP Premium Desert Safari with BBQ Dinner': '/images/top-experiences/vip-premium-desert-safari-bbq-dinner.png',
  'Sunrise Camel Trekking': '/images/top-experiences/sunrise-camel-trekking.png',
  'Desert Safari with Dinner at Caravanserai': '/images/top-experiences/desert-safari-dinner-caravanserai.png'
}

export default function TourCarousel() {
  const baseTours = tours.length >= 8 ? tours.slice(0, 8) : [...tours, fallbackTour].slice(0, 8)

  const displayedTours = baseTours.map((tour) => ({
    ...tour,
    image:
      tour.featuredImage ||
      featuredImagesByTitle[tour.sourceTitle || tour.title] ||
      tour.image
  }))

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
          {displayedTours.map((tour, index) => {
            const sourceTitle = tour.sourceTitle || tour.title
            const detailHref = tour.href || getTourDetailHref('Desert Safari', sourceTitle)
            const points = tour.points || getCardPoints('Desert Safari', sourceTitle, '', 5)

            return (
              <article className="tour-card" key={`${tour.title}-${index}`} data-reveal>
                <a href={detailHref} className="tour-image-link" aria-label={`View ${tour.title}`}>
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
                    {!tour.hideTag && <span className="card-tag">{tour.tag}</span>}
                    {tour.meta && <span className="card-meta"><Clock size={15} />{tour.meta}</span>}
                  </div>
                </a>

                <div className="tour-card-body">
                  <div className="rating"><Star size={16} fill="currentColor" /> 4.9 · 0 reviews</div>
                  <h3><a href={detailHref}>{tour.title}</a></h3>
                  <ul className="experience-card-points">
                    {points.map((point) => <li key={point}>{point}</li>)}
                  </ul>

                  <div className="tour-card-price-line">
                    <strong>{tour.price}</strong>
                  </div>

                  <ExperienceCardActions title={tour.title} detailHref={detailHref} />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
