import { useEffect, useRef } from 'react'
import { Check, Clock3, MessageCircle, ShieldCheck, Sparkles, Star, X } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import ReviewsSection from '../../components/ReviewsSection/ReviewsSection'
import SupportCta from '../../components/SupportCta/SupportCta'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import ExperienceCardActions from '../../components/ExperienceCardActions/ExperienceCardActions'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { tourCategoryPages } from '../../tourCategoryPages'
import { getTourDetailHref } from '../../tourDetails'
import { getCardPoints } from '../../utils/cardContent'
import './TourCategory.css'

function CategoryTourCard({ tour, page }) {
  const category = tour.category || page.detailCategory || page.name
  const hasFixedPrice = tour.price && tour.price !== 'Contact for price'
  const detailHref = getTourDetailHref(category, tour.title)
  const points = getCardPoints(category, tour.title, tour.description, 7)

  return (
    <article className="category-tour-card" data-lux-reveal>
      <a className="category-tour-card__image" href={detailHref} aria-label={`View ${tour.title}`}>
        <img src={tour.image} alt={tour.title} loading="lazy" />
        <div className="category-tour-card__badges">
          <span className="category-tour-card__category">{page.name}</span>
          {tour.duration && <span className="category-tour-card__duration"><Clock3 size={13} /> {tour.duration}</span>}
        </div>
      </a>

      <div className="category-tour-card__body">
        <div className="category-tour-card__rating"><Star size={14} fill="currentColor" /><span>{tour.rating || '4.9'} · {tour.reviews ?? 0} reviews</span></div>
        <h3><a href={detailHref}>{tour.title}</a></h3>
        <ul className="experience-card-points">
          {points.map((point) => <li key={point}>{point}</li>)}
        </ul>

        <div className="category-tour-card__bottom">
          <div className="category-tour-card__price">
            {hasFixedPrice ? (
              <><small>FROM</small><div><strong>{tour.price}</strong>{tour.unit && <span>{tour.unit}</span>}</div></>
            ) : (
              <><small>PRICE</small><div><strong className="category-tour-card__contact">Contact for price</strong></div></>
            )}
          </div>
        </div>

        <ExperienceCardActions title={tour.title} detailHref={detailHref} />
      </div>
    </article>
  )
}

export default function TourCategory({ slug, menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const page = tourCategoryPages[slug]

  useLuxuryReveal(pageRef)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (page?.campaign) {
      document.title = page.campaign.seoTitle
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', page.campaign.seoDescription)

      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', `${window.location.origin}${window.location.pathname}`)
    }
  }, [slug, page])

  if (!page) return null
  const campaign = page.campaign

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
            {campaign && (
              <div className="category-hero__actions" data-hero-reveal>
                <a href="#packages" className="category-hero__cta">View Packages</a>
                <a href="/contact" className="category-hero__cta">Contact Us</a>
              </div>
            )}
          </div>
        </section>

        {campaign && (
          <nav className="campaign-switcher" aria-label="Desert campaign pages">
            <div className="container campaign-switcher__inner">
              <a className={slug === 'desert-safari' ? 'is-active' : ''} href="/tours/desert-safari">Desert Safari</a>
              <a className={slug === 'quad-bike' ? 'is-active' : ''} href="/tours/quad-bike">Quad Bike</a>
              <a className={slug === 'dune-buggy' ? 'is-active' : ''} href="/tours/dune-buggy">Dune Buggy</a>
              <a className={slug === 'private-desert-setup' ? 'is-active' : ''} href="/tours/private-desert-setup">Private Desert Setup</a>
            </div>
          </nav>
        )}

        {campaign && (
          <section className="campaign-overview">
            <div className="container campaign-overview__grid">
              <div data-lux-reveal>
                <span className="category-eyebrow">Plan with confidence</span>
                <h2>{campaign.introTitle}</h2>
              </div>
              <div className="campaign-overview__copy" data-lux-reveal>
                {campaign.introCopy.map((copy) => <p key={copy}>{copy}</p>)}
              </div>
            </div>
          </section>
        )}

        <section id="packages" className="category-experiences">
          <div className="container category-experiences__heading">
            <div>
              <span className="category-eyebrow" data-lux-reveal>{page.eyebrow}</span>
              <h2 data-lux-reveal>{page.sectionTitle}</h2>
              <p data-lux-reveal>{page.sectionCopy}</p>
            </div>
          </div>

          <div className={`category-tour-grid ${page.tours.length === 3 ? 'category-tour-grid--three' : ''}`}>
            {page.tours.map((tour) => <CategoryTourCard key={tour.id} tour={tour} page={page} />)}
          </div>
        </section>

        {campaign && (
          <>
            <section className="campaign-highlights">
              <div className="container">
                <div className="campaign-section-heading" data-lux-reveal>
                  <span className="category-eyebrow">Why book this experience</span>
                  <h2>Simple planning, clear package choices.</h2>
                </div>
                <div className="campaign-highlight-grid">
                  {campaign.highlights.map((item, index) => (
                    <article key={item.title} data-lux-reveal>
                      <span className="campaign-highlight-icon">{index % 2 === 0 ? <ShieldCheck size={21} /> : <Sparkles size={21} />}</span>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="campaign-included">
              <div className="container campaign-included__grid">
                <div className="campaign-included__intro" data-lux-reveal>
                  <span className="category-eyebrow">Typical inclusions</span>
                  <h2>What you can expect.</h2>
                  <p>Exact inclusions vary by package. Open the individual tour page to confirm everything included in your selected option.</p>

                  <aside className="campaign-booking-notes" aria-label="Booking notes">
                    <div className="campaign-booking-notes__head">
                      <span>Before you book</span>
                      <strong>Quick booking checklist</strong>
                    </div>
                    <ul>
                      <li><Check size={16} /><span>Check the exact package inclusions and selected duration.</span></li>
                      <li><Check size={16} /><span>Confirm pickup location and expected starting time.</span></li>
                      <li><Check size={16} /><span>Share guest ages for activity and safety requirements.</span></li>
                      <li><Check size={16} /><span>Ask for the latest availability before confirming.</span></li>
                    </ul>
                    <a href="/contact"><MessageCircle size={17} /> Contact Us</a>
                  </aside>
                </div>
                <div className="campaign-included__lists" data-lux-reveal>
                  <h3>Included</h3>
                  <ul>
                    {campaign.included.map((item) => <li key={item}><Check size={17} /><span>{item}</span></li>)}
                  </ul>
                  <h3>Not included</h3>
                  <ul className="campaign-excluded-list">
                    {campaign.excluded.map((item) => <li key={item}><X size={17} /><span>{item}</span></li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section className="campaign-faqs">
              <div className="container">
                <div className="campaign-section-heading" data-lux-reveal>
                  <span className="category-eyebrow">FAQs</span>
                  <h2>Questions before you book.</h2>
                </div>
                <div className="campaign-faqs__list" data-lux-reveal>
                  {campaign.faqs.map((faq, index) => (
                    <details key={faq.question} open={index === 0}>
                      <summary>{faq.question}</summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            <section className="campaign-final-cta">
              <div className="container campaign-final-cta__inner" data-lux-reveal>
                <div>
                  <span>Need help choosing?</span>
                  <h2>Tell us your date and group size.</h2>
                  <p>We’ll help you choose the right package and confirm availability.</p>
                </div>
                <a href="/contact"><MessageCircle size={18} /> Contact Us</a>
              </div>
            </section>
          </>
        )}

        <div className="category-reviews-wrap" data-lux-reveal><ReviewsSection copy="4.9 ★ average across 356 verified Google reviews & growing on TripAdvisor." /></div>
        <div className="category-support-wrap" data-lux-reveal><SupportCta /></div>
      </main>

      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
