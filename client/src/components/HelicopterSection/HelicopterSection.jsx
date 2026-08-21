import { helicopters } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import ExperienceCardActions from '../ExperienceCardActions/ExperienceCardActions'
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
          {helicopters.map((item, index) => {
            const detailHref = getTourDetailHref('Aerial Experiences', item.title)
            const points = getCardPoints('Aerial Experiences', item.title, item.copy, 5)

            return (
              <article className={`heli-card ${index > 2 ? 'premium' : ''}`} key={item.title} data-reveal>
                <a href={detailHref} className="heli-image" aria-label={`View ${item.title}`}>
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span>{item.tier}</span>
                </a>

                <div className="heli-body">
                  <span className="mini-eyebrow">Helicopter package</span>
                  <div className="heli-title-row">
                    <div className="heli-title-copy">
                      <h3><a href={detailHref}>{item.title}</a></h3>
                      <p>{item.duration}</p>
                    </div>
                    <div className="heli-price"><strong>{item.price}</strong><span>{item.unit}</span></div>
                  </div>
                  <ul className={`experience-card-points ${index > 2 ? '' : 'experience-card-points--light'}`}>
                    {points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  <ExperienceCardActions title={item.title} detailHref={detailHref} />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
