import { reviews } from '../data'
import SectionHeading from './SectionHeading'

export default function ReviewsSection() {
  return (
    <section className="section white-section">
      <div className="container">
        <SectionHeading centered eyebrow="What travellers say" title="Real reviews. Real travellers. Real moments." copy="4.9 ★ average across 356 verified reviews and growing." />
        <div className="review-summary"><strong>4.9 ★★★★★</strong><span>5.0 · TripAdvisor</span><span>4.8 · Viator</span></div>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.name} data-reveal><span>★★★★★</span><p>“{review.text}”</p><div><b>{review.name}</b><small>{review.place}</small></div></article>
          ))}
        </div>
      </div>
    </section>
  )
}
