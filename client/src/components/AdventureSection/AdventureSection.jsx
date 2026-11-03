import { adventures } from '../../data'
import { applyTourPricing } from '../../utils/tourPricing'
import SectionHeading from '../SectionHeading/SectionHeading'
import ExperienceCard from '../ExperienceCard/ExperienceCard'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
import './AdventureSection.css'

export default function AdventureSection() {
  return (
    <section className="section dark-section">
      <div className="container">
        <SectionHeading light eyebrow="Adrenaline · Desert" title="Adventures that get your heart racing." copy="From dune bashing to hot-air ballooning at sunrise — choose your level of thrill." />
        <div className="adventure-grid">
          {adventures.map(applyTourPricing).map((item) => (
            <ExperienceCard
              key={item.title}
              data-reveal
              image={item.image}
              href={getTourDetailHref('Desert Adventures', item.title)}
              badge="Adventure"
              badgeTone="gold"
              eyebrow="Desert adventure"
              title={item.title}
              points={getCardPoints('Desert Adventures', item.title, '', 4)}
              price={item.price}
              priceNote={item.unit || 'per person'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
