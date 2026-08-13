import { helicopters } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import { getTourDetailHref } from '../../tourDetails'
import './HelicopterSection.css'

const standardCopy = {
  'Iconic Tour': 'Quick scenic escape over Dubai’s iconic skyline — perfect for first-time helicopter flyers.',
  'Palm Tour': 'Fly above Palm Jumeirah, Atlantis and Dubai Marina with unforgettable coastal views.',
  'Vision Tour': 'A longer panoramic flight covering Dubai’s famous landmarks, coastline and city skyline.'
}

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
            <a
              className={`heli-card heli-card-link ${index > 2 ? 'premium' : ''}`}
              key={item.title}
              data-reveal
              href={getTourDetailHref('Aerial Experiences', item.title)}
              aria-label={`View ${item.title}`}
            >
              <div className="heli-image">
                <img src={item.image} alt={item.title} loading="lazy" />
                <span>{item.tier}</span>
              </div>

              <div className="heli-body">
                <span className="mini-eyebrow">Helicopter package</span>

                <div className="heli-title-row">
                  <div className="heli-title-copy">
                    <h3>{item.title}</h3>
                    <p>{item.duration}</p>
                  </div>

                  <div className="heli-price">
                    <strong>{item.price}</strong>
                    <span>{item.unit}</span>
                  </div>
                </div>

                <p className="heli-description">
                  {index < 3 ? standardCopy[item.title] : item.copy}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}