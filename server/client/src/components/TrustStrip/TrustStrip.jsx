import { BadgeCheck, Headphones, ShieldCheck, Sparkles } from 'lucide-react'
import './TrustStrip.css'

const items = [
  { icon: ShieldCheck, title: 'Licensed Operator', copy: 'DED-registered, fully insured tours across the UAE.' },
  { icon: BadgeCheck, title: 'Best Price Guarantee', copy: "Find it cheaper? We'll match it — no questions asked." },
  { icon: Sparkles, title: 'Hand-picked Experiences', copy: 'Real itineraries, real guides, no tourist traps.' },
  { icon: Headphones, title: '24/7 WhatsApp Support', copy: 'Reply in under 60 seconds, every day of the year.' }
]

export default function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="container trust-grid">
        {items.map(({ icon: Icon, title, copy }) => (
          <article className="trust-item" key={title} data-reveal>
            <span className="trust-icon"><Icon /></span>
            <div><h3>{title}</h3><p>{copy}</p></div>
          </article>
        ))}
      </div>
    </section>
  )
}
