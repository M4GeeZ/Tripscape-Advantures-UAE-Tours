import { ArrowRight, Check, Clock, Star } from 'lucide-react'
import { tours } from '../../data'
import { images } from '../../generatedImages'
import SectionHeading from '../SectionHeading/SectionHeading'
import { getTourDetailHref } from '../../tourDetails'
import './TourCarousel.css'

const fallbackTour = {
  image: images.adventureEvening,
  tag: 'Desert adventure',
  meta: 'Family',
  title: 'Family Desert Safari & Quad Experience',
  price: 'Contact for price'
}

const featuredImages = [
  '/images/top-experiences/morning-desert-safari-quad-bike.png',
  '/images/top-experiences/evening-desert-safari-bbq-dinner.png',
  '/images/top-experiences/desert-safari-vip-setup.png',
  '/images/top-experiences/vip-desert-safari-private-seating.png',
  '/images/top-experiences/vip-premium-desert-safari-bbq-dinner.png',
  '/images/top-experiences/sunrise-camel-trekking.png',
  '/images/top-experiences/desert-safari-dinner-caravanserai.png',
  '/images/top-experiences/family-desert-safari-quad-experience.png'
]

function getTourServices(title = '', index = 0) {
  const value = title.toLowerCase()

  if (index === 0 || value.includes('morning')) {
    return [
      'Morning hotel pickup',
      'Dune bashing and photo stop',
      'Guided quad bike experience'
    ]
  }

  if (index === 1 || value.includes('evening') || value.includes('bbq')) {
    return [
      'Sunset dune drive',
      'BBQ buffet dinner',
      'Live cultural entertainment'
    ]
  }

  if (index === 2 || value.includes('vip setup')) {
    return [
      'Reserved VIP seating',
      'Premium table service',
      'Priority camp experience'
    ]
  }

  if (index === 3 || value.includes('private seating')) {
    return [
      'Private majlis seating',
      'Dedicated service team',
      'Premium dinner experience'
    ]
  }

  if (value.includes('camel')) {
    return [
      'Guided camel experience',
      'Scenic desert photo stops',
      'Professional tour support'
    ]
  }

  if (value.includes('dinner') || value.includes('caravan')) {
    return [
      'Desert dinner experience',
      'Evening entertainment',
      'Convenient return transfer'
    ]
  }

  if (value.includes('quad') || value.includes('buggy')) {
    return [
      'Guided desert adventure',
      'Safety briefing included',
      'Professional support team'
    ]
  }

  return [
    'Licensed local guides',
    'Hotel pickup options',
    'Instant booking support'
  ]
}

export default function TourCarousel() {
  const baseTours =
    tours.length >= 8
      ? tours.slice(0, 8)
      : [...tours, fallbackTour].slice(0, 8)

  const displayedTours = baseTours.map((tour, index) => ({
    ...tour,
    image: index < featuredImages.length ? featuredImages[index] : tour.image,
    services: getTourServices(tour.title, index)
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
          {displayedTours.map((tour, index) => (
            <a
              className="tour-card tour-card-link"
              key={`${tour.title}-${index}`}
              data-reveal
              href={getTourDetailHref('Desert Safari', tour.title)}
              aria-label={`View ${tour.title}`}
            >
              <div className="tour-image-wrap">
                <img src={tour.image} alt={tour.title} loading="lazy" />

                <span className="card-tag">{tour.tag}</span>

                <span className="card-meta">
                  <Clock size={15} />
                  {tour.meta}
                </span>
              </div>

              <div className="tour-card-body">
                <div className="rating">
                  <Star size={16} fill="currentColor" />
                  4.9 · 0 reviews
                </div>

                <h3>{tour.title}</h3>

                <ul className="tour-service-points" aria-label={`${tour.title} highlights`}>
                  {tour.services.map((service) => (
                    <li key={service}>
                      <Check size={14} strokeWidth={2.4} />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>

                <div className="tour-card-footer">
                  <strong>{tour.price}</strong>

                  <span className="tour-card-view">
                    View
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
