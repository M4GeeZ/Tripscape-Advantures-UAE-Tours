import { adventures } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import ExperienceCardActions from '../ExperienceCardActions/ExperienceCardActions'
import { getTourDetailHref } from '../../tourDetails'
import { getCardDescription } from '../../utils/cardContent'
import './AdventureSection.css'

export default function AdventureSection() {
  return (
    <section className="section dark-section">
      <div className="container">
        <SectionHeading light eyebrow="Adrenaline · Desert" title="Adventures that get your heart racing." copy="From dune bashing to hot-air ballooning at sunrise — choose your level of thrill." />
        <div className="adventure-grid">
          {adventures.map((item) => {
            const detailHref = getTourDetailHref('Desert Adventures', item.title)
            const description = getCardDescription('Desert Adventures', item.title)

            return (
              <article className="adventure-card" key={item.title} data-reveal style={{ '--adventure-image': `url(${item.image})` }}>
                <a href={detailHref} className="adventure-image-shell" aria-label={`View ${item.title}`}>
                  <img src={item.image} alt={item.title} loading="lazy" />
                </a>
                <div className="adventure-shade" />
                <div className="adventure-content">
                  <h3><a href={detailHref}>{item.title}</a></h3>
                  <span className="adventure-price">{item.price}</span>
                  <p className="experience-card-description experience-card-description--light">{description}</p>
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
