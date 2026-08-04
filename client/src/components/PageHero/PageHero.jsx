import './PageHero.css'

export default function PageHero({ eyebrow, title, copy, image, compact = false, children }) {
  return (
    <section
      className={`page-hero ${compact ? 'page-hero-compact' : ''} ${image ? 'page-hero-image' : 'page-hero-solid'}`}
      style={image ? { '--page-hero-image': `url(${image})` } : undefined}
    >
      <div className="page-hero-shade" />
      <div className="page-hero-glow page-hero-glow-one" />
      <div className="page-hero-glow page-hero-glow-two" />
      <div className="container page-hero-inner">
        <span className="page-hero-eyebrow" data-hero-reveal>{eyebrow}</span>
        <h1 data-hero-reveal>{title}</h1>
        {copy && <p data-hero-reveal>{copy}</p>}
        {children && <div className="page-hero-extra" data-hero-reveal>{children}</div>}
      </div>
      <div className="page-hero-line" aria-hidden="true" />
    </section>
  )
}
