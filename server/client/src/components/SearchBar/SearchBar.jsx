import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, Search } from 'lucide-react'
import { tourFilterNames } from '../../data'
import SearchResults from '../SearchResults/SearchResults'
import { buildToursSearchUrl, destinationOptions, searchSiteContent } from '../../utils/siteSearch'
import './SearchBar.css'

export default function SearchBar() {
  const shellRef = useRef(null)
  const [query, setQuery] = useState('')
  const [destination, setDestination] = useState('Dubai')
  const [category, setCategory] = useState('All')
  const [date, setDate] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const results = useMemo(
    () => searchSiteContent(query, { category, destination, limit: 8 }),
    [query, category, destination]
  )

  useEffect(() => {
    const handleOutside = (event) => {
      if (!shellRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => setActiveIndex(-1), [query, destination, category])

  const submitSearch = (event) => {
    event?.preventDefault()
    window.location.href = buildToursSearchUrl({ query, category, destination, date })
  }

  const handleKeyDown = (event) => {
    if (!open || !results.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % results.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1))
    }
    if (event.key === 'Escape') setOpen(false)
    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      window.location.href = results[activeIndex].href
    }
  }

  return (
    <div className="search-lift" ref={shellRef}>
      <form className="tour-search" onSubmit={submitSearch}>
        <label className="search-field wide">
          <span>Search</span>
          <div>
            <Search size={20} />
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Burj Khalifa"
              autoComplete="off"
              aria-label="Search tours and services"
              aria-expanded={open}
            />
          </div>
        </label>

        <label className="search-field search-select-field">
          <span>Destination</span>
          <div>
            <select value={destination} onChange={(event) => { setDestination(event.target.value); setOpen(true) }}>
              {destinationOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <ChevronDown size={18} />
          </div>
        </label>

        <label className="search-field search-select-field">
          <span>Category</span>
          <div>
            <select value={category} onChange={(event) => { setCategory(event.target.value); setOpen(true) }}>
              {tourFilterNames.map((option) => <option key={option}>{option}</option>)}
            </select>
            <ChevronDown size={18} />
          </div>
        </label>

        <label className="search-field">
          <span>Date</span>
          <div>
            <input value={date} onChange={(event) => setDate(event.target.value)} type="date" />
            <CalendarDays size={19} />
          </div>
        </label>

        <button className="button button-gold search-submit" type="submit">Search</button>
      </form>

      {open && (
        <SearchResults
          className="home-search-results"
          results={results}
          query={query}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          onResultClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}
