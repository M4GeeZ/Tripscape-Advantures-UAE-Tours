import { useEffect, useMemo, useRef, useState } from 'react'
import { Clock3, MessageCircle, ArrowLeft } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import { blogArticles, getBlogArticle } from '../../blogArticles'
import { apiUrl } from '../../utils/apiBaseUrl'
import './Blog.css'

function fallbackContent(article) {
  const included = (article.included || []).map((item) => `<li>${item}</li>`).join('')
  return `<p>${article.description || article.copy || ''}</p><h2>What this guide covers</h2><ul>${included}</ul><h2>Practical planning notes</h2><p>Use the information in this guide as a starting point and confirm current opening times, availability and package details before travelling.</p>`
}

export default function BlogDetail({ slug, menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const [dynamicArticle, setDynamicArticle] = useState(null)
  const staticArticle = getBlogArticle(slug)
  const article = dynamicArticle || staticArticle
  useLuxuryReveal(pageRef)

  useEffect(() => {
    let active = true
    fetch(apiUrl(`/api/blogs/${encodeURIComponent(slug)}`))
      .then((response) => response.ok ? response.json() : null)
      .then((item) => active && item && setDynamicArticle(item))
      .catch(() => {})
    return () => { active = false }
  }, [slug])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!article) return
    const title = article.seoTitle || `${article.title} | Tripscape Tourism`
    const description = article.metaDescription || article.description || article.copy || ''
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta && description) meta.setAttribute('content', description.slice(0, 320))
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = article.canonical || `${window.location.origin}/blog/${article.slug}`
  }, [article, slug])

  const related = useMemo(() => blogArticles.filter((item) => item.slug !== slug).slice(0, 3), [slug])

  if (!article) return <div className="blog-not-found">Article not found.</div>

  const image = article.homeImage || article.listImage || article.image
  const whatsappText = encodeURIComponent(`Hi Tripscape, I would like more information about: ${article.title}`)
  const whatsappHref = `https://wa.me/971549930684?text=${whatsappText}`
  const content = article.content || fallbackContent(article)

  return (
    <div className="blog-detail-page" ref={pageRef}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="light" showTopBar />
      <main>
        <article>
          <header className="blog-article-header">
            <div className="container blog-article-header-inner">
              <a className="blog-back-link" href="/blog"><ArrowLeft size={15} /> All articles</a>
              <span className="blog-article-category">{article.category}</span>
              <h1>{article.title}</h1>
              <p className="blog-article-excerpt">{article.copy || article.description}</p>
              <div className="blog-article-meta"><span><Clock3 size={14} /> {article.time || '5 min read'}</span><span>{article.author || 'Tripscape Team'}</span><span>{article.date || ''}</span></div>
            </div>
          </header>

          <div className="container blog-article-featured">
            {image && <img src={image} alt={article.title} />}
          </div>

          <div className="container blog-article-layout">
            <div className="blog-article-body" dangerouslySetInnerHTML={{ __html: content }} />
            <aside className="blog-article-sidebar">
              <div className="blog-article-contact">
                <span>TRIPSCAPE SUPPORT</span>
                <h3>Planning a UAE experience?</h3>
                <p>Ask the team about availability, pickup details, related tours or a custom itinerary.</p>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Ask on WhatsApp</a>
              </div>
            </aside>
          </div>

          {article.faqs?.length > 0 && <section className="container blog-article-faq"><span>FAQS</span><h2>Common questions</h2><div>{article.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>}

          <section className="container blog-related"><div className="blog-related-head"><span>KEEP READING</span><h2>More travel guides</h2></div><div className="blog-related-grid">{related.map((item) => <a href={`/blog/${item.slug}`} key={item.slug}><img src={item.listImage || item.homeImage} alt={item.title} /><div><span>{item.category}</span><h3>{item.title}</h3><p>{item.copy}</p></div></a>)}</div></section>
        </article>
      </main>
      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
