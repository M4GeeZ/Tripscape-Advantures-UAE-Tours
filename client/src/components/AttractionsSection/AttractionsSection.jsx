import { attractions } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import ExperienceCardActions from '../ExperienceCardActions/ExperienceCardActions'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
import './AttractionsSection.css'

export default function AttractionsSection() {
  return (
    <section className="section cream-section attractions-section">
      <div className="container">
        <SectionHeading eyebrow="Tickets & attractions" title="UAE icons. Skip the queue." copy="Instant e-tickets to Dubai's must-see attractions — confirmed in seconds." />
        <div className="attractions-grid">
          {attractions.map((item) => {
            const detailHref = getTourDetailHref('Attractions', item.title)
            const points = getCardPoints('Attractions', item.title, '', 5)

            return (
              <article className="attraction-card" key={item.title} data-reveal>
                <a href={detailHref} className="attraction-image" aria-label={`View ${item.title}`}>
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="badge-row"><span>⚡ Skip line</span><span>🎟 E-ticket</span></div>
                </a>
                <div className="attraction-body">
                  <h3><a href={detailHref}>{item.title}</a></h3>
                  <span>From</span>
                  <div className="attraction-price"><strong>{item.price}</strong></div>
                  <ul className="experience-card-points">
                    {points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  <ExperienceCardActions title={item.title} detailHref={detailHref} />
                </div>
              </article>
            )
          })}
        </div>
        <div className="center-action"><a className="button button-gold" href="/tours?category=Attractions">View all attractions</a></div>
      </div>
    </section>
  )
}
