import { images } from '../../generatedImages'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="newsletter">
        <div className="container newsletter-inner"><div><span>Stay in the loop</span><h3>Desert sunsets & secret deals — straight to your inbox.</h3></div><form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="your@email.com" /><button className="button button-gold compact">Subscribe</button></form></div>
      </div>
      <div className="container footer-grid">
        <div className="footer-brand"><div className="brand footer-logo brand-image"><img src={images.logoWhite} alt="Tripscape Adventures" /></div><p>Licensed UAE tour operator delivering unforgettable desert, city and attraction experiences.</p><span>+971 54 993 0684</span><span>info@tripscapeadventures.com</span><span>Office 1024, Business Bay, Dubai, UAE</span></div>
        <div><h4>Company</h4><a href="/about">About Us</a><a href="/contact">Contact</a><a href="/blog">Blog</a><a href="#">Careers</a></div>
        <div><h4>Experiences</h4><a href="/tours?category=Desert%20Safari">Desert Safari</a><a href="/tours?category=Desert%20Adventures">Adventures</a><a href="/tours?category=City%20Tours">City Tours</a><a href="/tours?category=Attractions">Attractions</a></div>
        <div><h4>Destinations</h4><a href="/tours">Dubai</a><a href="/tours">Abu Dhabi</a><a href="/tours">Sharjah</a><a href="/tours">Ras Al Khaimah</a></div>
      </div>
      <div className="footer-bottom"><div className="container"><span>© 2026 Tripscape Adventures. All rights reserved.</span><span>Privacy · Terms · Refund Policy</span><span>Trade License: DED-1234567</span></div></div>
    </footer>
  )
}
