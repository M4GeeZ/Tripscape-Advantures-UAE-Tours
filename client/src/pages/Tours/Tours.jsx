import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import TourCard from '../../components/TourCard/TourCard'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import { tourCatalog, tourFilterNames } from '../../data'
import './Tours.css'

const getInitialCategory = () => {
  const value = new URLSearchParams(window.location.search).get('category')
  return tourFilterNames.includes(value) ? value : 'All'
}

export default function Tours({ menuOpen, setMenuOpen }) {
  const [activeCategory, setActiveCategory] = useState(getInitialCategory)
  const [query, setQuery] = useState('')

  const visibleTours = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return tourCatalog.filter((tour) => {
      const categoryMatch = activeCategory === 'All' || tour.category === activeCategory
      const searchMatch = !normalized || [tour.title, tour.category, tour.location, tour.description]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
      return categoryMatch && searchMatch
    })
  }, [activeCategory, query])

  const selectCategory = (category) => {
    setActiveCategory(category)
    const url = new URL(window.location.href)
    if (category === 'All') url.searchParams.delete('category')
    else url.searchParams.set('category', category)
    window.history.replaceState({}, '', `${url.pathname}${url.search}`)
  }

  return (
    <div className="tours-page">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="light" showTopBar />

      <main>
        <section className="tours-hero">
          <div className="tours-hero-orb tours-hero-orb-one" />
          <div className="tours-hero-orb tours-hero-orb-two" />
          <div className="container tours-hero-inner">
            <span className="tours-page-kicker"><Sparkles size={13} /> All tours</span>
            <h1>Find the UAE experience<br />that feels made for you.</h1>
            <p>Licensed desert, city, water and aerial experiences across all seven emirates.</p>

            <label className="tours-search-box">
              <Search size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tours, destinations or experiences..."
                aria-label="Search tours"
              />
              <span><SlidersHorizontal size={16} /> {visibleTours.length} tours</span>
            </label>
          </div>
        </section>

        <section className="tours-catalog-section">
          <div className="tours-filter-bar-wrap">
            <div className="container tours-filter-bar" role="tablist" aria-label="Tour categories">
              {tourFilterNames.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category}
                  className={activeCategory === category ? 'active' : ''}
                  onClick={() => selectCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="container tours-catalog-inner">
            <div className="tours-results-heading">
              <div>
                <span>{activeCategory === 'All' ? 'Every experience' : activeCategory}</span>
                <h2>{activeCategory === 'All' ? 'Explore our hand-picked tours.' : `Discover ${activeCategory.toLowerCase()}.`}</h2>
              </div>
              <p>{visibleTours.length} carefully selected experience{visibleTours.length === 1 ? '' : 's'}</p>
            </div>

            {visibleTours.length > 0 ? (
              <div className="tours-card-grid">
                {visibleTours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
              </div>
            ) : (
              <div className="tours-empty-state">
                <Search size={30} />
                <h3>No tours matched your search.</h3>
                <p>Try another keyword or choose a different category.</p>
                <button type="button" className="button button-gold compact" onClick={() => { setQuery(''); selectCategory('All') }}>
                  Show all tours
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
