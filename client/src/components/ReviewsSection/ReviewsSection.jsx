import { useEffect, useMemo, useState } from 'react'
import SectionHeading from '../SectionHeading/SectionHeading'
import { apiUrl } from '../../utils/apiBaseUrl'
import './ReviewsSection.css'
import { GOOGLE_REVIEWS_URL, googleReviews } from '../../data/googleReviews'

function Stars({ count = 5 }) {
  return <span className="google-review-stars" aria-label={`${count} out of 5 stars`}>{'★'.repeat(count)}</span>
}

export default function ReviewsSection() {
  const [manualReviews, setManualReviews] = useState([])

  useEffect(() => {
    let active = true
    fetch(apiUrl('/api/reviews'), { credentials: 'include' })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (active && Array.isArray(data)) setManualReviews(data)
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const displayReviews = useMemo(() => {
    const editable = manualReviews.map((review) => ({
      id: review.id || review._id,
      name: review.name,
      stars: Number(review.rating) || 5,
      text: review.text,
      source: review.source || 'Customer review',
      sourceUrl: review.sourceUrl || '',
    }))
    return [...editable, ...googleReviews].slice(0, 6)
  }, [manualReviews])

  return (
    <section className="section white-section google-reviews-section">
      <div className="container">
        <SectionHeading
          centered
          eyebrow="What travellers say"
          title="Real reviews. Real travellers. Real moments."
          copy="4.9 ★ Google rating across 391 public reviews."
        />

        <div className="google-review-summary" aria-label="Google review summary">
          <span className="google-review-badge">G</span>
          <strong>4.9</strong>
          <span className="google-summary-stars">★★★★★</span>
          <span>391 Google reviews</span>
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer">View on Google ↗</a>
        </div>

        <div className="reviews-grid">
          {displayReviews.map((review) => {
            const isGoogle = review.source === 'Google review' || review.source === 'Google'
            const sourceUrl = review.sourceUrl || (isGoogle ? GOOGLE_REVIEWS_URL : '')
            return (
              <article className="review-card google-review-card" key={review.id || review.name} data-reveal>
                <div className="google-review-card__top">
                  <span className="google-review-avatar" aria-hidden="true">{review.name?.charAt(0) || 'T'}</span>
                  <div>
                    <b>{review.name}</b>
                    <small>{isGoogle ? 'Google review' : review.source}</small>
                  </div>
                  <span className={`google-review-source ${isGoogle ? '' : 'is-customer'}`} title={review.source}>{isGoogle ? 'G' : '✓'}</span>
                </div>
                <Stars count={review.stars} />
                <p>{review.text}</p>
                {sourceUrl && <a className="google-review-card__link" href={sourceUrl} target="_blank" rel="noreferrer">View source ↗</a>}
              </article>
            )
          })}
        </div>

        <div className="google-reviews-footer">
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer">See all Google reviews ↗</a>
        </div>
      </div>
    </section>
  )
}
