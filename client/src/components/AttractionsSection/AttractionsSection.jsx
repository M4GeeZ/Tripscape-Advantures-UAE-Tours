import { ArrowRight } from 'lucide-react'
import { attractions } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import './AttractionsSection.css'

export default function AttractionsSection() {
  return (
    <section className="section cream-section attractions-section">
      <div className="container">
        <SectionHeading eyebrow="Tickets & attractions" title="UAE icons. Skip the queue." copy="Instant e-tickets to Dubai's must-see attractions — confirmed in seconds." />
        <div className="attractions-grid">
          {attractions.map((item) => (
            <article className="attraction-card" key={item.title} data-reveal>
              <div className="attraction-image"><img src={item.image} alt={item.title} loading="lazy" /><div className="badge-row"><span>⚡ Skip line</span><span>🎟 E-ticket</span></div></div>
              <div className="attraction-body"><h3>{item.title}</h3><span>From</span><div><strong>{item.price}</strong><a href="#contact">Book <ArrowRight size={15} /></a></div></div>
            </article>
          ))}
        </div>
        <div className="center-action"><a className="button button-gold" href="#tours">View all attractions</a></div>
      </div>
    </section>
  )
}
