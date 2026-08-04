import { Mail, MessageCircle, Phone } from 'lucide-react'

export default function SupportCta() {
  return (
    <section id="contact" className="support-section">
      <div className="container">
        <div className="support-card" data-reveal>
          <div><span>24/7 support</span><h2>How can we help you plan the perfect UAE trip?</h2><p>Our team is online every day of the year. Pick the channel that works for you.</p></div>
          <a href="https://wa.me/971549930684" target="_blank" rel="noreferrer"><MessageCircle /><span><small>WhatsApp</small>Chat now — replies in 60s</span></a>
          <a href="tel:+971549930684"><Phone /><span><small>Call us</small>+971 54 993 0684</span></a>
          <a href="mailto:info@tripscapeadventures.com"><Mail /><span><small>Email</small>info@tripscapeadventures.com</span></a>
        </div>
      </div>
    </section>
  )
}
