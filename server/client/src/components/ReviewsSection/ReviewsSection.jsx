import { reviews } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import './ReviewsSection.css'

export default function ReviewsSection({
  copy = '4.9 ★ average across 356 verified reviews and growing.'
}) {
  return (
    <section className="section white-section">
      <div className="container">
        <SectionHeading centered eyebrow="What travellers say" title="Real reviews. Real travellers. Real moments." copy={copy} />
        <div className="review-summary"><strong>4.9 ★★★★★</strong><span><b>5.0 ★</b> TripAdvisor</span><span><b>4.8 ★</b> Viator</span></div>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.name} data-reveal>
              <span>★★★★★</span>
              <p>“{review.text}”</p>
              <div>
                <b>{review.name}</b>
                <small>{review.place}{review.source ? ` · ${review.source}` : ''}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
