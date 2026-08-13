import { Clock } from 'lucide-react'
import { cities } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import { getTourDetailHref } from '../../tourDetails'
import './CityTours.css'

export default function CityTours() {
  return (
    <section className="section cream-section" id="services">
      <div className="container">
        <SectionHeading
          centered
          eyebrow="Explore the UAE"
          title="Guided city tours across the emirates."
          copy="From the skyline of Dubai to the mosques of Abu Dhabi — pick where your story begins."
        />

        <div className="city-grid">
          {cities.map((city) => (
            <a
              className="city-card city-card-link"
              key={city.title}
              data-reveal
              href={getTourDetailHref('City Tours', city.title)}
              aria-label={`View ${city.title}`}
              style={{ '--city-image': `url("${city.image}")` }}
            >
              <div className="city-image-shell">
                <img src={city.image} alt={city.title} loading="lazy" />
              </div>
              <div className="city-overlay" />
              <div className="city-content">
                <span><Clock size={16} /> Guided tour</span>
                <h3>{city.title}</h3>
                <p>{city.price}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
