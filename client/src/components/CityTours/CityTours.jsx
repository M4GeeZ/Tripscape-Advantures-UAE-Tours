import { Clock } from 'lucide-react'
import { cities } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import ExperienceCardActions from '../ExperienceCardActions/ExperienceCardActions'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
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
          {cities.map((city) => {
            const detailHref = getTourDetailHref('City Tours', city.title)
            const points = getCardPoints('City Tours', city.title, '', 5)

            return (
              <article className="city-card" key={city.title} data-reveal style={{ '--city-image': `url("${city.image}")` }}>
                <a href={detailHref} className="city-image-shell" aria-label={`View ${city.title}`}>
                  <img src={city.image} alt={city.title} loading="lazy" />
                </a>
                <div className="city-overlay" />
                <div className="city-content">
                  <span><Clock size={16} /> Guided tour</span>
                  <h3><a href={detailHref}>{city.title}</a></h3>
                  <p className="city-price">{city.price}</p>
                  <ul className="experience-card-points experience-card-points--light">
                    {points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  <ExperienceCardActions title={city.title} detailHref={detailHref} />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
