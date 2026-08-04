export default function SectionHeading({ eyebrow, title, copy, centered = false, light = false, children }) {
  return (
    <div className={`section-heading ${centered ? 'centered' : ''} ${light ? 'light' : ''}`} data-reveal>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
      {children}
    </div>
  )
}
