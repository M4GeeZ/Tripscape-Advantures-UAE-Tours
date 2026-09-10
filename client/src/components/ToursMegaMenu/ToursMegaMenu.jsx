import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { tourCategories } from '../../data'
import { tourCategoryPaths } from '../../tourCategoryPages'
import './ToursMegaMenu.css'

const featuredTourCards = {
  quadBike: {
    name: 'Dubai Quad Bike',
    description: 'Desert riding, safety support & safari packages',
    image: '/images/adv-double.webp',
    href: '/tours/quad-bike',
    eyebrow: 'Desert Adventure'
  },
  eJet: {
    name: 'Desert E-Jet Water Go Kart Dubai',
    description: 'Water go-kart racing on a desert lagoon · From AED 250',
    image: '/images/desert-ejet/ejet-track-1.jpg',
    href: '/tours/desert-adventures/desert-e-jet-water-go-kart-dubai',
    eyebrow: 'Featured Adventure',
    price: 'From AED 250'
  },
  privateSafari: {
    name: 'Private Desert Safari',
    description: 'VIP desert setups for couples, families & private groups',
    image: '/images/top-experiences/vip-desert-safari-private-seating.png',
    href: '/tours/private-desert-setup',
    eyebrow: 'Premium Experience'
  }
}

export default function ToursMegaMenu({ open, onMouseEnter, onMouseLeave, onClose }) {
  return (
    <div
      className={`tours-mega-menu ${open ? 'is-open' : ''}`}
      aria-hidden={!open}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container tours-mega-inner">
        <button
          type="button"
          className="tours-mega-mobile-back"
          onClick={onClose}
          aria-label="Back to mobile navigation"
        >
          <ArrowLeft size={18} />
          <span>Back to menu</span>
        </button>

        <div className="tours-mega-heading">
          <div>
            <span>Explore the UAE</span>
            <h2>Choose your experience</h2>
          </div>
          <a href="/tours" className="tours-mega-all">
            View all tours <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="tours-mega-grid">
          {tourCategories.map((category) => (
            <a
              key={category.name}
              href={tourCategoryPaths[category.name] || '/tours'}
              className="tours-mega-card"
              style={{ backgroundImage: `url(${category.image})` }}
            >
              <span className="tours-mega-card-overlay" />
              <span className="tours-mega-card-content">
                <strong>{category.name}</strong>
                <small>{category.description}</small>
              </span>
              <ArrowUpRight className="tours-mega-card-arrow" size={18} />
            </a>
          ))}

        </div>

        <div className="tours-mega-featured-row">
          <a
            href={featuredTourCards.quadBike.href}
            className="tours-mega-card tours-mega-promo-card tours-mega-promo-card--side"
            style={{ backgroundImage: `url(${featuredTourCards.quadBike.image})` }}
          >
            <span className="tours-mega-card-overlay tours-mega-card-overlay--promo" />
            <span className="tours-mega-promo-eyebrow">{featuredTourCards.quadBike.eyebrow}</span>
            <span className="tours-mega-card-content tours-mega-card-content--promo">
              <strong>{featuredTourCards.quadBike.name}</strong>
              <small>{featuredTourCards.quadBike.description}</small>
            </span>
            <ArrowUpRight className="tours-mega-card-arrow" size={18} />
          </a>

          <a
            href={featuredTourCards.eJet.href}
            className="tours-mega-card tours-mega-promo-card tours-mega-promo-card--featured"
            style={{ backgroundImage: `url(${featuredTourCards.eJet.image})` }}
          >
            <span className="tours-mega-card-overlay tours-mega-card-overlay--featured" />
            <span className="tours-mega-featured-label">{featuredTourCards.eJet.eyebrow}</span>
            <span className="tours-mega-card-content tours-mega-card-content--featured">
              <strong>{featuredTourCards.eJet.name}</strong>
              <small>{featuredTourCards.eJet.description}</small>
            </span>
            <span className="tours-mega-featured-price">{featuredTourCards.eJet.price}</span>
            <ArrowUpRight className="tours-mega-card-arrow" size={18} />
          </a>

          <a
            href={featuredTourCards.privateSafari.href}
            className="tours-mega-card tours-mega-promo-card tours-mega-promo-card--side"
            style={{ backgroundImage: `url(${featuredTourCards.privateSafari.image})` }}
          >
            <span className="tours-mega-card-overlay tours-mega-card-overlay--promo" />
            <span className="tours-mega-promo-eyebrow">{featuredTourCards.privateSafari.eyebrow}</span>
            <span className="tours-mega-card-content tours-mega-card-content--promo">
              <strong>{featuredTourCards.privateSafari.name}</strong>
              <small>{featuredTourCards.privateSafari.description}</small>
            </span>
            <ArrowUpRight className="tours-mega-card-arrow" size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}
