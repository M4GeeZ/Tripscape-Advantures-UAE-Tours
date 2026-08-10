import { helicopters } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import './HelicopterSection.css'

export default function HelicopterSection() {
  return (
    <section className="section cream-section">
      <div className="container">
        <SectionHeading eyebrow="Helicopter packages" title="A proper package grid with clear pricing and premium visuals." copy="Standard packages stay separate from the premium safari options so customers can compare quickly without confusion." />
        <div className="helicopter-grid">
          {helicopters.map((item, index) => (
            <article className={`heli-card ${index > 2 ? 'premium' : ''}`} key={item.title} data-reveal>
              <div className="heli-image">
                <img src={item.image} alt={item.title} loading="lazy" />
                <span>{item.tier}</span>
              </div>
              <div className="heli-body">
                <span className="mini-eyebrow">Helicopter package</span>
                <div className="heli-title-row"><div><h3>{item.title}</h3><p>{item.duration}</p></div><div className="heli-price"><strong>{item.price}</strong><span>{item.unit}</span></div></div>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
