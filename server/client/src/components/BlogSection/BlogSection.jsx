import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react'
import { blogArticles } from '../../blogArticles'
import SectionHeading from '../SectionHeading/SectionHeading'
import './BlogSection.css'

const blogs = blogArticles.slice(0, 3)

export default function BlogSection() {
  return (
    <section id="blog" className="section white-section blog-section">
      <div className="container">
        <div className="blog-heading-row">
          <SectionHeading
            eyebrow="Travel journal"
            title="Stories, tips & insider guides."
            copy="Local knowledge from our guides — everything you need to plan the perfect UAE trip."
          />
          <a href="/blog" className="button button-gold blog-all-articles">
            All articles <ArrowRight size={18} />
          </a>
        </div>

        <div className="blog-grid">
          {blogs.map((blog) => (
            <a className="blog-card" key={blog.title} data-reveal href={`/blog/${blog.slug}?from=home`} aria-label={blog.title}>
              <div className="blog-card-image">
                <img src={blog.homeImage || blog.listImage} alt={blog.title} loading="lazy" />
              </div>

              <div className="blog-card-body">
                <span className="blog-card-tag">{blog.category}</span>
                <h3>{blog.title}</h3>
                <p>{blog.copy}</p>

                <div className="blog-card-meta">
                  <span><Clock3 size={14} /> {blog.time.replace(' read', '')}</span>
                  <span><CalendarDays size={14} /> {blog.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
