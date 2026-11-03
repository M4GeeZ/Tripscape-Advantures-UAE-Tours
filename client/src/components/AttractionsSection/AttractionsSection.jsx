import { attractions } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import ExperienceCard from '../ExperienceCard/ExperienceCard'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
import './AttractionsSection.css'

export default function AttractionsSection() {
  return (
    <section className="section cream-section attractions-section">
      <div className="container">
        <SectionHeading eyebrow="Tickets & attractions" title="UAE icons. Skip the queue." copy="Instant e-tickets to Dubai's must-see attractions — confirmed in seconds." />
        <div className="attractions-grid">
          {attractions.map((item) => (
            <ExperienceCard
              key={item.title}
              data-reveal
              image={item.image}
              href={getTourDetailHref('Attractions', item.title)}
              badge="Skip the line"
              meta="E-ticket"
              eyebrow="Attraction ticket"
              title={item.title}
              points={getCardPoints('Attractions', item.title, '', 4)}
              price={item.price}
              priceNote="per ticket"
            />
          ))}
        </div>
        <div className="center-action"><a className="button button-gold" href="/tours?category=Attractions">View all attractions</a></div>
      </div>
    </section>
  )
}
