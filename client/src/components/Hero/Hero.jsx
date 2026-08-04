import { ArrowRight, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { heroSlides } from '../../data'
import './Hero.css'

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActive((current) => (current + 1) % heroSlides.length),
      6000
    )
    return () => clearInterval(timer);
  }, [])

  return (
    <section id="top" className="hero">
      {heroSlides.map((slide, index) => (
        <div
          className={`hero-bg ${index === active ? "is-active" : ""}`}
          key={slide.title}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="eyebrow-pill">
          <i />
          {heroSlides[active].eyebrow}
        </span>
        <h1 key={heroSlides[active].title}>{heroSlides[active].title}</h1>
        <p>{heroSlides[active].copy}</p>
        <span className="hero-divider" aria-hidden="true" />

        <div className="hero-actions">
          <a href="#tours" className="button button-gold hero-primary-btn">
            <span>Explore tours</span>
            <ArrowRight className="hero-btn-arrow" size={18} />
          </a>

          <a href="tel:+971549930684" className="button button-outline hero-phone-btn">
            <Phone className="hero-phone-icon" size={18} />
            <span>+971 54 993 0684</span>
          </a>
        </div>

        <div className="rating-line">
          <span>★★★★★</span>
          <strong>4.9 / 5</strong>
          <span>· 356 verified reviews</span>
        </div>
      </div>

      <div className="hero-dots">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={index === active ? "active" : ""}
            onClick={() => setActive(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

