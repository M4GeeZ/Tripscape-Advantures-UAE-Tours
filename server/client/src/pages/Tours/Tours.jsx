import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import TourCard from '../../components/TourCard/TourCard'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import { tourCatalog, tourFilterNames } from '../../data'
import { searchTourCatalog } from '../../utils/siteSearch'
import './Tours.css'

const getSearchParams = () => new URLSearchParams(window.location.search)

const getInitialCategory = () => {
  const value = getSearchParams().get('category')
  return tourFilterNames.includes(value) ? value : 'All'
}

const getInitialQuery = () => getSearchParams().get('query') || ''
const getInitialDestination = () => getSearchParams().get('destination') || 'All'

export default function Tours({ menuOpen, setMenuOpen }) {
  const [activeCategory, setActiveCategory] = useState(getInitialCategory)
  const [query, setQuery] = useState(getInitialQuery)
  const [destination] = useState(getInitialDestination)

  const visibleTours = useMemo(
    () => searchTourCatalog(tourCatalog, query, {
      category: activeCategory,
      destination
    }),
    [activeCategory, query, destination]
  )

  const showingRecommendations = visibleTours.some((tour) => tour.searchMode === 'recommended')

  const selectCategory = (category) => {
    setActiveCategory(category)
    const url = new URL(window.location.href)
    if (category === 'All') url.searchParams.delete('category')
    else url.searchParams.set('category', category)
    window.history.replaceState({}, '', `${url.pathname}${url.search}`)
  }

  const updateQuery = (value) => {
    setQuery(value)
    const url = new URL(window.location.href)
    if (value.trim()) url.searchParams.set('query', value.trim())
    else url.searchParams.delete('query')
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
                onChange={(event) => updateQuery(event.target.value)}
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
                <span>
                  {showingRecommendations
                    ? 'Closest recommendations'
                    : activeCategory === 'All'
                      ? 'Every experience'
                      : activeCategory}
                </span>
                <h2>
                  {showingRecommendations
                    ? `Experiences selected for ${query.trim() ? `“${query.trim()}”` : 'your filters'}.`
                    : activeCategory === 'All'
                      ? 'Explore our hand-picked tours.'
                      : `Discover ${activeCategory.toLowerCase()}.`}
                </h2>
              </div>
              <p>
                {visibleTours.length} carefully selected experience{visibleTours.length === 1 ? '' : 's'}
                {destination !== 'All' && !showingRecommendations ? ` in ${destination}` : ''}
              </p>
            </div>

            <div className="tours-card-grid">
              {visibleTours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
