import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Youtube,
} from 'lucide-react'
import { images } from '../../generatedImages'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="newsletter">
        <div className="footer-shell newsletter-inner">
          <div className="newsletter-copy">
            <span>Stay in the loop</span>
            <h3>Desert sunsets &amp; secret deals — straight to your inbox.</h3>
          </div>

          <form onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="your@email.com" aria-label="Email address" />
            <button className="footer-subscribe" type="submit">
              <Send size={16} />
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer-shell footer-grid">
        <div className="footer-brand">
          <a href="/" className="footer-logo" aria-label="Tripscape Adventures home">
            <img src={images.navLogoWhite} alt="Tripscape Adventures" />
          </a>

          <p>
            Licensed UAE tour operator delivering unforgettable
            <br />
            desert, city and attraction experiences across Dubai, Abu
            <br />
            Dhabi, Sharjah, RAK &amp; Fujairah since 2018.
          </p>

          <div className="footer-contact-list">
            <a href="tel:+971549930684" className="footer-contact-item">
              <Phone size={18} />
              <span>+971 54 993 0684</span>
            </a>

            <a href="mailto:info@tripscapetourism.com" className="footer-contact-item">
              <Mail size={18} />
              <span>info@tripscapetourism.com</span>
            </a>

            <div className="footer-contact-item">
              <MapPin size={18} />
              <span>Office 1204, Business Bay, Dubai, UAE</span>
            </div>
          </div>

          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><Facebook size={17} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
            <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/blog">Blog</a>
          <a href="/become-a-guide">Become a Guide</a>
          <a href="/careers">Careers</a>
        </div>

        <div className="footer-column">
          <h4>Experiences</h4>
          <a href="/tours/desert-safari">Desert Safari</a>
          <a href="/tours/desert-adventures">Adventures</a>
          <a href="/tours/city-tours">City Tours</a>
          <a href="/tours/attractions">Attractions</a>
          <a href="/tours/packages">Packages</a>
        </div>

        <div className="footer-column">
          <h4>Destinations</h4>
          <a href="/tours">Dubai</a>
          <a href="/tours">Abu Dhabi</a>
          <a href="/tours">Sharjah</a>
          <a href="/tours">Ras Al Khaimah</a>
          <a href="/tours">Fujairah</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-shell footer-bottom-inner">
          <span>© 2026 Tripscape Adventures. All rights reserved.</span>

          <div className="footer-legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/refund-policy">Refund Policy</a>
          </div>

          <span className="footer-license">Trade License: DED-1234567</span>
        </div>
      </div>
    </footer>
  )
}
