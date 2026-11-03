import { useEffect, useMemo, useState } from 'react'
import { Clock3 } from 'lucide-react'
import { apiUrl, mediaUrl } from '../../utils/apiBaseUrl'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
import ExperienceCard from '../ExperienceCard/ExperienceCard'
import './CmsTourPlacements.css'

const normalizePath = (value = '') => {
  const clean = String(value).split('?')[0].split('#')[0]
  return clean.replace(/\/+$/, '') || '/'
}

// Tours added in the admin CMS and assigned to the current page.
export default function CmsTourPlacements({ path }) {
  const [tours, setTours] = useState([])

  useEffect(() => {
    fetch(apiUrl('/api/tours'))
      .then((res) => (res.ok ? res.json() : []))
      .then((items) => {
        const current = normalizePath(path || window.location.pathname)
        setTours(Array.isArray(items) ? items.filter((tour) => (
          tour?._id &&
          tour?.published !== false &&
          ((current === '/services' && Boolean(tour?.placements?.services)) ||
            (Array.isArray(tour?.placements?.paths) && tour.placements.paths.some((item) => normalizePath(item) === current)))
        )) : [])
      })
      .catch(() => setTours([]))
  }, [path])

  const unique = useMemo(() => {
    const seen = new Set()
    return tours.filter((tour) => {
      const key = String(tour._id || tour.id || tour.title).toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [tours])

  if (!unique.length) return null

  return (
    <section className="cms-placement-section">
      <div className="container">
        <div className="cms-placement-section__head">
          <span>MORE TO EXPLORE</span>
          <h2>More packages for this page</h2>
        </div>
        <div className="cms-placement-grid">
          {unique.map((tour) => {
            const category = tour.category || 'Desert Safari'
            const href = tour.href || (tour.slug && tour.categorySlug ? `/tours/${tour.categorySlug}/${tour.slug}` : getTourDetailHref(category, tour.title))
            const included = (tour.included || []).filter(Boolean).slice(0, 4)

            return (
              <ExperienceCard
                key={tour._id || tour.id || tour.title}
                image={mediaUrl(tour.image)}
                href={href}
                badge={category}
                meta={tour.duration && <><Clock3 size={12} /> {tour.duration}</>}
                eyebrow={`${tour.rating || '4.9'} · ${tour.reviews ?? 0} reviews`}
                title={tour.title}
                points={included.length ? included : getCardPoints(category, tour.title, tour.description || '', 4)}
                price={tour.price}
                priceNote={tour.unit}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
