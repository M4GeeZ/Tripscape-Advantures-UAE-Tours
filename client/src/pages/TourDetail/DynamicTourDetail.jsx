import { useEffect, useState } from 'react'
import TourDetail from './TourDetail'
import { apiUrl } from '../../utils/apiBaseUrl'

export default function DynamicTourDetail({ categorySlug, tourSlug, ...pageProps }) {
  const [state, setState] = useState({ loading: true, tour: null })

  useEffect(() => {
    let active = true
    setState({ loading: true, tour: null })
    fetch(apiUrl(`/api/tours/${encodeURIComponent(categorySlug)}/${encodeURIComponent(tourSlug)}`))
      .then((response) => response.ok ? response.json() : null)
      .then((tour) => active && setState({ loading: false, tour }))
      .catch(() => active && setState({ loading: false, tour: null }))
    return () => { active = false }
  }, [categorySlug, tourSlug])

  if (state.loading) return <div className="tour-detail-loading">Loading tour...</div>
  if (!state.tour) return <div className="tour-detail-loading">Tour not found.</div>
  return <TourDetail {...pageProps} categorySlug={categorySlug} tourSlug={tourSlug} tourOverride={state.tour} />
}
