import { useEffect, useRef } from 'react'
import { ArrowRight, Clock3, Star } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import ReviewsSection from '../../components/ReviewsSection/ReviewsSection'
import SupportCta from '../../components/SupportCta/SupportCta'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { tourCategoryPages } from '../../tourCategoryPages'
import { getTourDetailHref } from '../../tourDetails'
import './TourCategory.css'

function CategoryTourCard({ tour, category }) {
  const hasFixedPrice = tour.price && tour.price !== 'Contact for price'

  return (
    <a
      className="category-tour-card category-tour-card--link"
      data-lux-reveal
      href={getTourDetailHref(category, tour.title)}
      aria-label={`View ${tour.title}`}
    >
      <div className="category-tour-card__image">
        <img src={tour.image} alt={tour.title} loading="lazy" />
        <div className="category-tour-card__badges">
          <span className="category-tour-card__category">{category}</span>
          {tour.duration && (
            <span className="category-tour-card__duration">
              <Clock3 size={13} /> {tour.duration}
            </span>
          )}
        </div>
      </div>

      <div className="category-tour-card__body">
        <div className="category-tour-card__rating">
          <Star size={14} fill="currentColor" />
          <span>{tour.rating || '4.9'} · {tour.reviews ?? 0} reviews</span>
        </div>

        <h3>{tour.title}</h3>

        <div className="category-tour-card__bottom">
          <div className="category-tour-card__price">
            {hasFixedPrice ? (
              <>
                <small>FROM</small>
                <div>
                  <strong>{tour.price}</strong>
                  {tour.unit && <span>{tour.unit}</span>}
                </div>
              </>
            ) : (
              <>
                <small>PRICE</small>
                <div><strong className="category-tour-card__contact">Contact us</strong></div>
              </>
            )}
          </div>

          <span className="category-tour-card__view">
            View <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </a>
  )
}

export default function TourCategory({ slug, menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const page = tourCategoryPages[slug]

  useLuxuryReveal(pageRef)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!page) return null

  return (
    <div className="tour-category-page" ref={pageRef}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="light" showTopBar />

      <main>
        <section className="category-hero" style={{ '--category-hero-image': `url(${page.heroImage})` }}>
          <div className="category-hero__shade" />
          <div className="container category-hero__content">
            <span className="category-eyebrow category-eyebrow--hero" data-hero-reveal>{page.eyebrow}</span>
            <h1 data-hero-reveal>{page.heroTitle}</h1>
            <p data-hero-reveal>{page.heroCopy}</p>
          </div>
        </section>

        <section className="category-experiences">
          <div className="container category-experiences__heading">
            <div>
              <span className="category-eyebrow" data-lux-reveal>{page.eyebrow}</span>
              <h2 data-lux-reveal>{page.sectionTitle}</h2>
              <p data-lux-reveal>{page.sectionCopy}</p>
            </div>
          </div>

          <div className="category-tour-grid">
            {page.tours.map((tour) => (
              <CategoryTourCard key={tour.id} tour={tour} category={page.name} />
            ))}
          </div>
        </section>

        <div className="category-reviews-wrap" data-lux-reveal>
          <ReviewsSection copy="4.9 ★ average across 356 verified Google reviews & growing on TripAdvisor." />
        </div>

        <div className="category-support-wrap" data-lux-reveal>
          <SupportCta />
        </div>
      </main>

      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
