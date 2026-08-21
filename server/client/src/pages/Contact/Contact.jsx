import { useRef } from 'react'
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import { useLuxuryReveal } from '../../hooks/useLuxuryReveal'
import './Contact.css'

const contactItems = [
  { label: 'WhatsApp', value: '+971 54 993 0684', icon: MessageCircle, tone: 'green' },
  { label: 'Phone', value: '+971 54 993 0684', icon: Phone },
  { label: 'Email', value: 'info@tripscapetourism.com', icon: Mail },
  { label: 'Address', value: 'Office 58, 2nd Floor, Dubai Shopping Centre, Deira, Dubai', icon: MapPin }
]

export default function Contact({ menuOpen, setMenuOpen }) {
  const pageRef = useRef(null)
  const experience = new URLSearchParams(window.location.search).get('experience') || ''
  useLuxuryReveal(pageRef)

  return (
    <div className="contact-page" ref={pageRef}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="light" showTopBar />
      <main className="contact-main">
        <div className="contact-orb contact-orb-one" />
        <div className="contact-orb contact-orb-two" />
        <section className="contact-intro container">
          <span data-hero-reveal>Get in touch</span>
          <h1 data-hero-reveal>Contact us</h1>
          <p data-hero-reveal>Fastest response is WhatsApp — we reply in under 60 seconds, every day.</p>
        </section>

        <section className="container contact-layout">
          <div className="contact-details">
            {contactItems.map(({ label, value, icon: Icon, tone }, index) => (
              <a
                href={label === 'Email' ? `mailto:${value}` : label === 'Address' ? '#' : 'tel:+971549930684'}
                className="contact-detail-card"
                key={label}
                data-lux-reveal
                data-reveal-delay={index * .06}
              >
                <span className={`contact-detail-icon ${tone === 'green' ? 'green' : ''}`}><Icon size={20} /></span>
                <span><small>{label}</small><strong>{value}</strong></span>
              </a>
            ))}
          </div>

          <form className="contact-form-lux" onSubmit={(event) => event.preventDefault()} data-lux-reveal>
            <div className="contact-form-row">
              <label>
                <span>Name *</span>
                <input type="text" placeholder="Your name" required />
              </label>
              <label>
                <span>Phone / WhatsApp *</span>
                <input type="tel" placeholder="+971 xx xxx xxxx" required />
              </label>
            </div>

            <label>
              <span>Email *</span>
              <input type="email" placeholder="your@email.com" required />
            </label>

            <label>
              <span>Interested in</span>
              <input
                type="text"
                defaultValue={experience}
                placeholder="Tour or experience name"
              />
            </label>

            <label>
              <span>Message</span>
              <textarea placeholder="Travel dates, group size, special requirements..." rows="5" />
            </label>

            <button type="submit" className="button button-gold contact-submit">
              Send message <Send size={17} />
            </button>
            <p className="contact-form-note">Or WhatsApp us directly for the fastest response</p>
          </form>
        </section>
      </main>
      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
