import { ArrowRight } from 'lucide-react'
import { adventures } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import './AdventureSection.css'

export default function AdventureSection() {
  return (
    <section className="section dark-section">
      <div className="container">
        <SectionHeading light eyebrow="Adrenaline · Desert" title="Adventures that get your heart racing." copy="From dune bashing to hot-air ballooning at sunrise — choose your level of thrill." />
        <div className="adventure-grid">
          {adventures.map((item) => (
            <article
              className="adventure-card"
              key={item.title}
              data-reveal
              style={{ '--adventure-image': `url(${item.image})` }}
            >
              <div className="adventure-image-shell">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="adventure-shade" />
              <div className="adventure-content"><h3>{item.title}</h3><a href="#contact">{item.price} <ArrowRight size={17} /></a></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
