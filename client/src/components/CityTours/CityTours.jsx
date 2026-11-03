import { cities } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import ExperienceCard from '../ExperienceCard/ExperienceCard'
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
          {cities.map((city) => (
            <ExperienceCard
              key={city.title}
              data-reveal
              image={city.image}
              href={getTourDetailHref('City Tours', city.title)}
              badge="Guided tour"
              eyebrow="City tour experience"
              title={city.title}
              points={getCardPoints('City Tours', city.title, '', 4)}
              price={city.price}
              priceNote="per person"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
