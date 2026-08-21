import { useEffect, useRef } from 'react'
import { Check, Clock3, MessageCircle, X } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { getBlogArticle } from '../../blogArticles'
import '../TourDetail/TourDetail.css'
import './Blog.css'

export default function BlogDetail({ slug, menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const article = getBlogArticle(slug)
  useLuxuryReveal(pageRef)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!article) return null

  const fromHome = new URLSearchParams(window.location.search).get('from') === 'home'
  const image = fromHome && article.homeImage ? article.homeImage : article.listImage
  const whatsappText = encodeURIComponent(`Hi Tripscape, I would like more information about: ${article.title}`)
  const whatsappHref = `https://wa.me/971549930684?text=${whatsappText}`

  return (
    <div className="tour-detail-page blog-detail-page" ref={pageRef}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="light" showTopBar />

      <main>
        <section className="tour-detail-gallery blog-detail-gallery" data-hero-reveal>
          <div className="tour-detail-gallery__stage">
            <img src={image} alt={article.title} className="tour-detail-gallery__hero" />
          </div>
        </section>

        <section className="tour-detail-content">
          <div className="container tour-detail-content__grid">
            <div className="tour-detail-main">
              <span className="tour-detail-badge" data-lux-reveal>{article.category}</span>
              <h1 data-lux-reveal>{article.title}</h1>

              <div className="tour-detail-meta" data-lux-reveal>
                <span><Clock3 size={15} /> {article.time}</span>
                <span>Tripscape Team</span>
              </div>

              <div className="tour-detail-description-block" data-lux-reveal>
                <h2>Description</h2>
                <p className="tour-detail-description">{article.description}</p>
              </div>

              <div className="tour-detail-included" data-lux-reveal>
                <h2>What's included</h2>
                <ul>
                  {article.included.map((item) => (
                    <li key={item}><Check size={17} /><span>{item}</span></li>
                  ))}
                </ul>
              </div>

              <div className="tour-detail-excluded" data-lux-reveal>
                <h2>What's excluded</h2>
                <ul>
                  {article.excluded.map((item) => (
                    <li key={item}><X size={17} /><span>{item}</span></li>
                  ))}
                </ul>
              </div>

              <div className="tour-detail-faqs" data-lux-reveal>
                <h2>Frequently asked questions</h2>
                <div className="tour-detail-faqs__list">
                  {article.faqs.map((faq, index) => (
                    <details key={faq.question} open={index === 0}>
                      <summary>{faq.question}</summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            <aside className="tour-detail-price-card blog-contact-card" data-lux-reveal>
              <span>NEED HELP?</span>
              <strong>Contact us</strong>
              <p>Ask our team about this guide, a related tour, availability or a custom UAE itinerary.</p>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="tour-detail-whatsapp">
                <MessageCircle size={18} /> Ask on WhatsApp
              </a>
              <a href="/contact" className="blog-contact-link">Contact page</a>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
