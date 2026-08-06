import { useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import PageHero from '../../components/PageHero/PageHero'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { images } from '../../generatedImages'
import './Blog.css'

const filters = ['All', 'Tips', 'Guides', 'Reviews', 'News', 'Destinations']

const articles = [
  { category: 'Tips', image: images.blogOne, title: 'Dubai in Summer: How to Plan a Comfortable Trip', copy: 'A practical guide to indoor attractions, tour timings and transport during Dubai summer.', time: '4 min read' },
  { category: 'Reviews', image: images.blogTwo, title: 'Traveller Review: Why Families Choose a Private Desert Safari', copy: 'What families value most about private vehicles, flexible timings and dedicated guides.', time: '4 min read' },
  { category: 'Destinations', image: images.blogThree, title: 'Abu Dhabi Cultural Day: Mosque, Louvre and Corniche', copy: 'A realistic one-day route covering Abu Dhabi’s essential cultural landmarks.', time: '5 min read' },
  { category: 'Guides', image: images.tourVip, title: 'The Best Desert Safari in Dubai 2025 — Complete Guide', copy: 'Everything you need to know before booking a desert safari in Dubai — from choosing the right experience.', time: '6 min read' },
  { category: 'News', image: images.citySix, title: 'Tripscape Adds Faster WhatsApp Booking Support', copy: 'Guests can now get itinerary, availability and pickup assistance through one support channel.', time: '3 min read' },
  { category: 'Guides', image: images.attractionBurj, title: 'Burj Khalifa Tickets — At the Top vs Sky vs Lounge 152', copy: 'A complete comparison of all Burj Khalifa ticket types so you can choose the right experience.', time: '5 min read' },
  { category: 'Guides', image: images.aboutSecondary, title: 'Abu Dhabi Day Trip from Dubai — Everything You Need to Know', copy: 'Planning a day trip from Dubai to Abu Dhabi? Here is exactly what to see, how to get there and how to plan.', time: '7 min read' },
  { category: 'Tips', image: images.attractionAquarium, title: 'Dubai with Kids — 10 Best Family Activities in 2025', copy: 'Travelling to Dubai with children? Here are the best family-friendly activities that kids and parents will love.', time: '8 min read' },
  { category: 'Tips', image: images.adventureDrive, title: 'What to Wear on a Desert Safari in Dubai', copy: 'Packing for a desert safari? Here is exactly what to wear and what to avoid for a comfortable adventure.', time: '4 min read' },
  { category: 'Destinations', image: images.heliMarina, title: 'Dubai Marina — Complete Visitor Guide 2025', copy: 'The Dubai Marina is one of the most vibrant neighbourhoods in the city. Here is everything you need to know.', time: '6 min read' }
]

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
              <article
                className="blog-lux-card"
                key={article.title}
                data-lux-reveal
                data-reveal-delay={(index % 3) * .07}
              >
                <a href="#" className="blog-lux-image-wrap" aria-label={article.title}>
                  <img src={article.image} alt="" />
                  <span className="blog-lux-arrow"><ArrowUpRight size={18} /></span>
                </a>
                <div className="blog-lux-body">
                  <span className="blog-lux-tag">{article.category}</span>
                  <h2>{article.title}</h2>
                  <p>{article.copy}</p>
                  <div className="blog-lux-meta">
                    <span><Clock3 size={13} /> {article.time}</span>
                    <span>Tripscape Team</span>
                  </div>
                </div>
              </article>
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
