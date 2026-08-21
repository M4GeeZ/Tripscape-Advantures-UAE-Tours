import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { tourCategories } from '../../data'
import { tourCategoryPaths } from '../../tourCategoryPages'
import './ToursMegaMenu.css'

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
      </div>
    </div>
  )
}
