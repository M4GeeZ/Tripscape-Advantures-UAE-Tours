import { useMemo, useRef, useState } from 'react'
import { Clock3 } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import PageHero from '../../components/PageHero/PageHero'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { blogArticles } from '../../blogArticles'
import './Blog.css'

const filters = ['All', 'Tips', 'Guides', 'Reviews', 'News', 'Destinations']

const articles = blogArticles


export default function Blog({ menuOpen, setMenuOpen }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const pageRef = useRef(null)
  useLuxuryReveal(pageRef)

  const visibleArticles = useMemo(
    () => activeFilter === 'All' ? articles : articles.filter((article) => article.category === activeFilter),
    [activeFilter]
  )

  return (
    <div className="blog-page" ref={pageRef}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="light" showTopBar />
      <main>
        <PageHero
          compact
          eyebrow="Travel journal"
          title="Stories, tips & insider guides."
          copy="Local knowledge from our guides — everything you need to plan the perfect UAE trip."
        />

        <section className="blog-journal-section">
          <div className="blog-filter-shell" data-lux-reveal>
            <div className="container blog-filter-row" role="tablist" aria-label="Blog categories">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={activeFilter === filter ? 'active' : ''}
                  onClick={() => setActiveFilter(filter)}
                  role="tab"
                  aria-selected={activeFilter === filter}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="container blog-lux-grid">
            {visibleArticles.map((article, index) => (
              <a
                className="blog-lux-card"
                key={article.title}
                data-lux-reveal
                data-reveal-delay={(index % 3) * .07}
                href={`/blog/${article.slug}`}
                aria-label={article.title}
              >
                <div className="blog-lux-image-wrap">
                  <img
                    src={article.listImage}
                    alt={article.title}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable="false"
                  />
                </div>
                <div className="blog-lux-body">
                  <span className="blog-lux-tag">{article.category}</span>
                  <h2>{article.title}</h2>
                  <p>{article.copy}</p>
                  <div className="blog-lux-meta">
                    <span><Clock3 size={13} /> {article.time}</span>
                    <span>Tripscape Team</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
