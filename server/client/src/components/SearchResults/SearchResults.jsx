import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react'
import { searchSiteContent } from '../../utils/siteSearch'
import './SearchResults.css'

export default function SearchResults({
  results,
  query,
  activeIndex = -1,
  onActiveIndexChange,
  onResultClick,
  className = ''
}) {
  const safeResults = results.length
    ? results
    : searchSiteContent('', { limit: 8 }).map((item) => ({ ...item, searchMode: 'recommended' }))

  const recommended = safeResults.some((item) => item.searchMode === 'recommended')
  const cleanQuery = query.trim()

  const heading = cleanQuery
    ? recommended
      ? `Recommended for “${cleanQuery}”`
      : `Suggestions for “${cleanQuery}”`
    : recommended
      ? 'Recommended experiences'
      : 'Popular experiences'

  return (
    <div className={`site-search-results ${className}`} role="listbox" aria-label="Search suggestions">
      <div className="site-search-results__header">
        <span className="site-search-results__title">
          {recommended && <Sparkles size={13} />}
          {heading}
        </span>
        <small>{safeResults.length} option{safeResults.length === 1 ? '' : 's'}</small>
      </div>

      {recommended && (
        <div className="site-search-results__notice">
          We have selected the closest relevant experiences so there is always something useful to explore.
        </div>
      )}

      <div className="site-search-results__grid">
        {safeResults.map((item, index) => (
          <a
            key={item.id}
            href={item.href}
            className={`site-search-result ${activeIndex === index ? 'is-active' : ''}`}
            role="option"
            aria-selected={activeIndex === index}
            onMouseEnter={() => onActiveIndexChange?.(index)}
            onClick={() => onResultClick?.(item)}
          >
            <span className="site-search-result__image">
              <img src={item.image} alt="" loading="lazy" />
            </span>

            <span className="site-search-result__content">
              <span className="site-search-result__meta">
                <em>{item.searchMode === 'recommended' ? 'Recommended' : item.kind}</em>
                <span><MapPin size={12} /> {item.destination}</span>
              </span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
              <span className="site-search-result__bottom">
                <b>{item.price || item.category}</b>
                <ArrowUpRight size={16} />
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
