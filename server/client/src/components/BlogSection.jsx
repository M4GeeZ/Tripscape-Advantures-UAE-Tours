import { ArrowRight } from 'lucide-react'
import { blogs } from '../data'
import SectionHeading from './SectionHeading'

export default function BlogSection() {
  return (
    <section id="blog" className="section white-section blog-section">
      <div className="container">
        <div className="heading-row">
          <SectionHeading eyebrow="Travel journal" title="Stories, tips & insider guides." copy="Local knowledge from our guides — everything you need to plan the perfect UAE trip." />
          <a href="#blog" className="button button-gold compact">All articles <ArrowRight size={16} /></a>
        </div>
        <div className="blog-grid">
          {blogs.map((blog) => (
            <article className="blog-card" key={blog.title} data-reveal><img src={blog.image} alt={blog.title} loading="lazy" /><div><span>{blog.tag}</span><h3>{blog.title}</h3><p>A practical guide with local tips, timing advice and transport details.</p><small>4 min · 8 Jul</small></div></article>
          ))}
        </div>
      </div>
    </section>
  )
}
