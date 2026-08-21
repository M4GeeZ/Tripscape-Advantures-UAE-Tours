import { ArrowRight, MessageCircle } from 'lucide-react'
import './ExperienceCardActions.css'

export default function ExperienceCardActions({ title, detailHref }) {
  const contactHref = `/contact?experience=${encodeURIComponent(title)}`

  return (
    <div className="experience-card-actions">
      <a className="experience-card-action" href={contactHref} aria-label={`Contact us about ${title}`}>
        <MessageCircle size={15} />
        <span>Contact Us</span>
      </a>
      <a className="experience-card-action" href={detailHref} aria-label={`View ${title} page`}>
        <span>View Page</span>
        <ArrowRight size={15} />
      </a>
    </div>
  )
}
