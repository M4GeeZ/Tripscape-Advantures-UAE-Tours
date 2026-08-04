import { Clock } from 'lucide-react'
import { cities } from '../data'
import SectionHeading from './SectionHeading'

export default function CityTours() {
  return (
    <section className="section cream-section" id="services">
      <div className="container">
        <SectionHeading centered eyebrow="Explore the UAE" title="Guided city tours across the emirates." copy="From the skyline of Dubai to the mosques of Abu Dhabi — pick where your story begins." />
        <div className="city-grid">
          {cities.map((city) => (
            <article className="city-card" key={city.title} data-reveal>
              <img src={city.image} alt={city.title} loading="lazy" />
              <div className="city-overlay" />
              <div className="city-content"><span><Clock size={16} /> Guided tour</span><h3>{city.title}</h3><p>{city.price}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
