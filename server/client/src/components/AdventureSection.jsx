import { ArrowRight } from 'lucide-react'
import { adventures } from '../data'
import SectionHeading from './SectionHeading'

export default function AdventureSection() {
  return (
    <section className="section dark-section">
      <div className="container">
        <SectionHeading light eyebrow="Adrenaline · Desert" title="Adventures that get your heart racing." copy="From dune bashing to hot-air ballooning at sunrise — choose your level of thrill." />
        <div className="adventure-grid">
          {adventures.map((item) => (
            <article className="adventure-card" key={item.title} data-reveal>
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="adventure-shade" />
              <div className="adventure-content"><h3>{item.title}</h3><a href="#contact">{item.price} <ArrowRight size={17} /></a></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
