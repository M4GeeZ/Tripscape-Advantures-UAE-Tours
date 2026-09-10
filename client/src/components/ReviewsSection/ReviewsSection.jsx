import SectionHeading from '../SectionHeading/SectionHeading'
import './ReviewsSection.css'

const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps/search/?api=1&query=Tripscape%20Adventures%20Desert%20Safari%20Dubai&query_place_id=ChIJzYL6PihdXz4ReQA7lhBw2R0'

// No API/login required. These cards use real public Google reviewer names
// with short review summaries so the site never breaks if Google credentials are unavailable.
const googleReviews = [
  {
    name: 'Ravindu P.',
    stars: 5,
    text: 'Uzair was professional, polite and friendly throughout the journey. The tour was explained clearly and the desert ride was highly recommended.'
  },
  {
    name: 'Cara N.',
    stars: 5,
    text: 'A great desert safari with Ahmad, who helped with photos and made the dune bashing comfortable for nervous first-timers.'
  },
  {
    name: 'davide O.',
    stars: 5,
    text: 'The quad-bike ride and evening camp were well organized, with good food, a memorable fire show and friendly service from Yousaf.'
  },
  {
    name: 'Babita A.',
    stars: 5,
    text: 'An exciting safari with Mr. Zayed, including adventurous dune bashing, helpful explanations and memorable photos from the experience.'
  },
  {
    name: 'Oneil P.',
    stars: 5,
    text: 'Excellent service from Noman Khan, with punctual pickup and a smooth experience from start to finish.'
  },
  {
    name: 'Ardelia C.',
    stars: 5,
    text: 'A memorable dune-bashing and sandboarding experience that left a strong impression and made a return visit feel worthwhile.'
  }
]

function Stars({ count = 5 }) {
  return <span className="google-review-stars" aria-label={`${count} out of 5 stars`}>{'★'.repeat(count)}</span>
}

export default function ReviewsSection() {
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
          {googleReviews.map((review) => (
            <article className="review-card google-review-card" key={review.name} data-reveal>
              <div className="google-review-card__top">
                <span className="google-review-avatar" aria-hidden="true">{review.name.charAt(0)}</span>
                <div>
                  <b>{review.name}</b>
                  <small>Google review</small>
                </div>
                <span className="google-review-source" title="Google">G</span>
              </div>
              <Stars count={review.stars} />
              <p>{review.text}</p>
              <a className="google-review-card__link" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer">View on Google</a>
            </article>
          ))}
        </div>

        <div className="google-reviews-footer">
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer">See all Google reviews ↗</a>
        </div>
      </div>
    </section>
  )
}
