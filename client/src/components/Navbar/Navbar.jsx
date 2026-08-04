import { useRef, useState } from 'react'
import { ChevronDown, Facebook, Instagram, Mail, Menu, Phone, Search, X, Youtube } from 'lucide-react'
import { images } from '../../generatedImages'
import ToursMegaMenu from '../ToursMegaMenu/ToursMegaMenu'
import './Navbar.css'

export default function Navbar({ menuOpen, setMenuOpen, variant = 'overlay', showTopBar = false }) {
  const [toursOpen, setToursOpen] = useState(false)
  const closeTimer = useRef(null)
  const isLight = variant === 'light' || toursOpen
  const logo = isLight ? images.logoGold : images.logoWhite

  const openTours = () => {
    window.clearTimeout(closeTimer.current)
    setToursOpen(true)
  }

  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setToursOpen(false), 120)
  }

  const regularLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ]

  return (
    <header className={`site-header site-header-${variant} ${toursOpen ? 'mega-open' : ''}`}>
      {showTopBar && (
        <div className="nav-topbar">
          <div className="container nav-topbar-inner">
            <div className="nav-topbar-contact">
              <a href="tel:+971549930684"><Phone size={12} /> +971 54 993 0684</a>
              <a href="mailto:info@tripscapeadventures.com"><Mail size={12} /> info@tripscapeadventures.com</a>
            </div>
            <div className="nav-topbar-socials">
              <a href="#" aria-label="Instagram"><Instagram size={13} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={13} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={14} /></a>
            </div>
          </div>
        </div>
      )}

      <div className="nav-wrap">
        <a href="/" className="brand brand-image" aria-label="Tripscape home">
          <img src={logo} alt="Tripscape Adventures" />
        </a>

        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
          <a href="/" onClick={() => setMenuOpen(false)}>Home</a>

          <div
            className={`nav-tours-item ${toursOpen ? 'is-active' : ''}`}
            onMouseEnter={openTours}
            onMouseLeave={scheduleClose}
          >
            <a
              href="/tours"
              onFocus={openTours}
              onClick={() => setMenuOpen(false)}
              aria-expanded={toursOpen}
            >
              Tours <ChevronDown className="nav-tours-chevron" size={14} />
            </a>
          </div>

          {regularLinks.slice(1).map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="icon-btn nav-search" aria-label="Search"><Search size={20} /></button>
          <a className="button button-gold nav-book" href="/contact">Book Now</a>
          <button className="icon-btn menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <ToursMegaMenu open={toursOpen} onMouseEnter={openTours} onMouseLeave={scheduleClose} />
    </header>
  )
}
