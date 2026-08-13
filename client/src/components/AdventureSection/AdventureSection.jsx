import { ArrowRight } from 'lucide-react'
import { adventures } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import { getTourDetailHref } from '../../tourDetails'
import './AdventureSection.css'

export default function AdventureSection() {
  return (
    <section className="section dark-section">
      <div className="container">
        <SectionHeading light eyebrow="Adrenaline · Desert" title="Adventures that get your heart racing." copy="From dune bashing to hot-air ballooning at sunrise — choose your level of thrill." />
        <div className="adventure-grid">
          {adventures.map((item) => (
            <a
              className="adventure-card adventure-card-link"
              key={item.title}
              data-reveal
              href={getTourDetailHref('Desert Adventures', item.title)}
              aria-label={`View ${item.title}`}
              style={{ '--adventure-image': `url(${item.image})` }}
            >
              <div className="adventure-image-shell">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="adventure-shade" />
              <div className="adventure-content"><h3>{item.title}</h3><span>{item.price} <ArrowRight size={17} /></span></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
