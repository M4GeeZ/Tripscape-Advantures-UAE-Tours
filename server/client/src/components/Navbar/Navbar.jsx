import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronDown,
  Facebook,
  Instagram,
  Mail,
  Menu,
  Search,
  X,
  Youtube
} from 'lucide-react'

import { images } from '../../generatedImages'
import SearchResults from '../SearchResults/SearchResults'
import ToursMegaMenu from '../ToursMegaMenu/ToursMegaMenu'
import { buildToursSearchUrl, searchSiteContent } from '../../utils/siteSearch'
import './Navbar.css'

function WhatsAppIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M16.03 3C9.39 3 4 8.3 4 14.83c0 2.3.68 4.55 1.97 6.47L4 28.5l7.48-1.94a12.2 12.2 0 0 0 4.54.88h.01C22.65 27.44 28 22.15 28 15.62 28 9.08 22.66 3 16.03 3Zm0 21.95h-.01a9.75 9.75 0 0 1-4.97-1.36l-.36-.21-4.44 1.15 1.18-4.25-.23-.37a9.42 9.42 0 0 1-1.48-5.08c0-5.21 4.32-9.45 9.63-9.45 5.31 0 9.63 4.24 9.63 9.45 0 5.22-4.32 9.46-9.62 9.46Zm5.28-7.08c-.29-.14-1.7-.83-1.96-.92-.26-.1-.45-.14-.64.14-.19.28-.74.92-.9 1.11-.17.19-.34.21-.63.07-.29-.14-1.22-.44-2.32-1.4-.86-.75-1.44-1.68-1.61-1.96-.17-.28-.02-.43.13-.57.13-.13.29-.33.43-.5.14-.16.19-.28.29-.47.1-.19.05-.35-.02-.5-.08-.14-.64-1.52-.88-2.08-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35-.26.28-1 1-1 2.44 0 1.44 1.04 2.82 1.19 3.01.14.19 2.05 3.08 4.97 4.32.69.3 1.23.47 1.65.6.69.22 1.32.19 1.82.12.56-.08 1.7-.69 1.94-1.35.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.55-.33Z"
      />
    </svg>
  )
}

export default function Navbar({
  menuOpen,
  setMenuOpen,
  variant = 'overlay',
  showTopBar = false
}) {
  const headerRef = useRef(null)
  const closeTimer = useRef(null)
  const [toursOpen, setToursOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeResult, setActiveResult] = useState(-1)

  const searchResults = useMemo(
    () => searchSiteContent(searchQuery, { limit: 8 }),
    [searchQuery]
  )

  const isLight = variant === 'light' || toursOpen || searchOpen
  const logo = isLight ? images.navLogoGold : images.navLogoWhite

  useEffect(() => {
    const handleOutside = (event) => {
      if (searchOpen && !headerRef.current?.contains(event.target)) setSearchOpen(false)
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setToursOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [searchOpen])

  useEffect(() => setActiveResult(-1), [searchQuery])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (!window.matchMedia('(max-width: 900px)').matches) return undefined

    const previousOverflow = document.body.style.overflow

    if (menuOpen || toursOpen || searchOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen, toursOpen, searchOpen])

  const openTours = () => {
    window.clearTimeout(closeTimer.current)
    setSearchOpen(false)
    setToursOpen(true)
  }

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setToursOpen(false), 120)
  }

  const closeMobileMenu = () => {
    setMenuOpen?.(false)
    setToursOpen(false)
  }

  const handleMobileToursToggle = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setSearchOpen(false)
    setToursOpen((value) => !value)
  }

  const toggleMobileMenu = () => {
    const nextOpen = !menuOpen
    setMenuOpen?.(nextOpen)
    setSearchOpen(false)
    setToursOpen(false)
  }

  const toggleSearch = () => {
    setToursOpen(false)

    const isMobile = typeof window !== 'undefined'
      && window.matchMedia('(max-width: 900px)').matches

    if (isMobile) {
      setMenuOpen?.(false)
    }

    setSearchOpen((value) => !value)
  }

  const submitNavbarSearch = (event) => {
    event.preventDefault()
    window.location.href = buildToursSearchUrl({ query: searchQuery })
  }

  const handleSearchKeyDown = (event) => {
    if (!searchResults.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveResult((index) => (index + 1) % searchResults.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveResult((index) => (index <= 0 ? searchResults.length - 1 : index - 1))
    }
    if (event.key === 'Enter' && activeResult >= 0) {
      event.preventDefault()
      window.location.href = searchResults[activeResult].href
    }
  }

  const regularLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ]

  return (
    <header
      ref={headerRef}
      className={`site-header site-header-${variant} ${toursOpen ? 'mega-open' : ''} ${searchOpen ? 'search-open' : ''}`}
    >
      {showTopBar && (
        <div className="nav-topbar">
          <div className="container nav-topbar-inner">
            <div className="nav-topbar-contact">
              <a
                href="https://wa.me/971549930684"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-topbar-whatsapp"
                aria-label="Chat with Tripscape Adventures on WhatsApp"
              >
                <WhatsAppIcon className="nav-topbar-whatsapp-icon" />
                <span>+971 54 993 0684</span>
              </a>

              <a href="mailto:info@tripscapeadventures.com">
                <Mail size={12} />
                <span>info@tripscapeadventures.com</span>
              </a>
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
          <a
            href="/"
            className="mobile-menu-brand"
            aria-label="Tripscape Adventures home"
            onClick={closeMobileMenu}
          >
            <img src={images.navLogoWhite} alt="Tripscape Adventures" />
          </a>

          <a href="/" onClick={closeMobileMenu}>Home</a>

          <div
            className={`nav-tours-item ${toursOpen ? 'is-active' : ''}`}
            onMouseEnter={openTours}
            onMouseLeave={scheduleClose}
          >
            {/* Desktop: keep the original Tours link/chevron behavior unchanged */}
            <a
              href="/tours"
              className="nav-tours-desktop-link"
              onFocus={openTours}
              onClick={closeMobileMenu}
              aria-expanded={toursOpen}
              aria-haspopup="true"
            >
              <span>Tours</span>
              <ChevronDown className="nav-tours-chevron" size={14} />
            </a>

            {/* Mobile: text navigates to /tours, only the round arrow opens the menu */}
            <div className="nav-tours-mobile-row">
              <a
                href="/tours"
                className="nav-tours-mobile-link"
                onClick={closeMobileMenu}
              >
                Tours
              </a>
              <button
                type="button"
                className="nav-tours-mobile-toggle"
                onClick={handleMobileToursToggle}
                aria-label={toursOpen ? 'Close Tours menu' : 'Open Tours menu'}
                aria-expanded={toursOpen}
                aria-haspopup="true"
              >
                <ChevronDown className="nav-tours-mobile-chevron" />
              </button>
            </div>
          </div>

          {regularLinks.slice(1).map((link) => (
            <a key={link.label} href={link.href} onClick={closeMobileMenu}>{link.label}</a>
          ))}

          <a
            className="mobile-menu-whatsapp"
            href="https://wa.me/971549930684"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp at +971 54 993 0684"
          >
            <WhatsAppIcon className="mobile-menu-whatsapp__icon" />
            <span>
              <small>WhatsApp</small>
              <strong>+971 54 993 0684</strong>
            </span>
          </a>
        </nav>

        <div className={`nav-actions ${searchOpen ? 'search-is-open' : ''}`}>
          <button
            type="button"
            className={`icon-btn nav-search ${searchOpen ? 'is-active' : ''}`}
            aria-label={searchOpen ? 'Close search' : 'Search the website'}
            aria-expanded={searchOpen}
            onClick={toggleSearch}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          <a className="button button-gold nav-book" href="/contact">Book Now</a>

          <a
            className="nav-whatsapp"
            href="https://wa.me/971549930684"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp at +971 54 993 0684"
          >
            <WhatsAppIcon className="nav-whatsapp-icon" />
            <span className="nav-whatsapp-number">+971 54 993 0684</span>
          </a>

          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={Boolean(menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="nav-search-panel">
          <div className="nav-search-panel__inner">
            <form className="nav-global-search" onSubmit={submitNavbarSearch}>
              <Search size={22} />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search desert safari, Burj Khalifa, city tours, packages..."
                aria-label="Search Tripscape"
                autoComplete="off"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search">
                  <X size={18} />
                </button>
              )}
              <button className="button button-gold nav-global-search__submit" type="submit">Search</button>
            </form>

            <SearchResults
              className="nav-search-results"
              results={searchResults}
              query={searchQuery}
              activeIndex={activeResult}
              onActiveIndexChange={setActiveResult}
              onResultClick={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}

      <ToursMegaMenu
        open={toursOpen}
        onMouseEnter={openTours}
        onMouseLeave={scheduleClose}
        onClose={() => setToursOpen(false)}
      />
    </header>
  )
}