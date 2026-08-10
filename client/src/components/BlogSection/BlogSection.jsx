import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react'
import { blogs } from '../../data'
import SectionHeading from '../SectionHeading/SectionHeading'
import './BlogSection.css'

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
          <a href="#blog" className="button button-gold blog-all-articles">
            All articles <ArrowRight size={18} />
          </a>
        </div>

        <div className="blog-grid">
          {blogs.map((blog) => (
            <article className="blog-card" key={blog.title} data-reveal>
              <div className="blog-card-image">
                <img src={blog.image} alt={blog.title} loading="lazy" />
              </div>

              <div className="blog-card-body">
                <span className="blog-card-tag">{blog.tag}</span>
                <h3>{blog.title}</h3>
                <p>{blog.copy}</p>

                <div className="blog-card-meta">
                  <span><Clock3 size={14} /> {blog.time}</span>
                  <span><CalendarDays size={14} /> {blog.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
