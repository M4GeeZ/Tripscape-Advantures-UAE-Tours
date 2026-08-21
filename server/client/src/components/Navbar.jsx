import { Menu, Search, X } from 'lucide-react'
import { images } from '../generatedImages'

export default function Navbar({ menuOpen, setMenuOpen }) {
  const links = ['Home', 'Tours', 'Services', 'About', 'Blog', 'Contact']

  return (
    <header className="nav-wrap">
      <a href="#top" className="brand brand-image" aria-label="Tripscape home">
        <img src={images.logoWhite} alt="Tripscape Adventures" />
      </a>

      <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
        {links.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{link}</a>
        ))}
      </nav>

      <div className="nav-actions">
        <button className="icon-btn nav-search" aria-label="Search"><Search size={22} /></button>
        <a className="button button-gold nav-book" href="#contact">Book Now</a>
        <button className="icon-btn menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
