import { helicopters } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import ExperienceCard from '../ExperienceCard/ExperienceCard'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
import './HelicopterSection.css'

export default function HelicopterSection() {
  return (
    <section className="section cream-section">
      <div className="container">
        <SectionHeading
          eyebrow="Helicopter packages"
          title="A proper package grid with clear pricing and premium visuals."
          copy="Standard packages stay separate from the premium safari options so customers can compare quickly without confusion."
        />

        <div className="helicopter-grid">
          {helicopters.map((item, index) => (
            <ExperienceCard
              key={item.title}
              data-reveal
              image={item.image}
              href={getTourDetailHref('Aerial Experiences', item.title)}
              badge={item.tier}
              badgeTone={index > 2 ? 'gold' : 'dark'}
              meta={item.duration}
              eyebrow="Helicopter experience"
              title={item.title}
              description={item.copy}
              points={getCardPoints('Aerial Experiences', item.title, item.copy, 4)}
              price={item.price}
              priceNote={item.unit?.toLowerCase()}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
