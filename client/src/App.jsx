import { useState } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Home from './pages/Home/Home'
import Tours from './pages/Tours/Tours'
import Services from './pages/Services/Services'
import About from './pages/About/About'
import Blog from './pages/Blog/Blog'
import Contact from './pages/Contact/Contact'

export default function App() {
  useSmoothScroll()
  const [menuOpen, setMenuOpen] = useState(false)
  const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
  const pageProps = { menuOpen, setMenuOpen }

  if (normalizedPath === '/tours') return <Tours {...pageProps} />
  if (normalizedPath === '/services') return <Services {...pageProps} />
  if (normalizedPath === '/about') return <About {...pageProps} />
  if (normalizedPath === '/blog') return <Blog {...pageProps} />
  if (normalizedPath === '/contact') return <Contact {...pageProps} />

  return <Home {...pageProps} />
}
