import ExperienceCardActions from '../ExperienceCardActions/ExperienceCardActions'
import { useTourCardImage } from '../../utils/tourImages'
import './ExperienceCard.css'

const CONTACT_PRICE = /^(|contact.*|(from\s*)?aed\s*0)$/i

const isContact = (price) => CONTACT_PRICE.test(String(price || '').trim())

// Divider + price row shared by every card markup on the site.
export function ExperiencePriceRow({ price, oldPrice, priceNote }) {
  const priceText = String(price || '').trim()

  return (
    <div className="experience-card-price-row">
      <div className="experience-card-price">
        {isContact(price) ? (
          <strong>Contact for price</strong>
        ) : (
          <>
            {oldPrice && <s>{oldPrice}</s>}
            <strong>{oldPrice || /^from\b/i.test(priceText) ? priceText : `From ${priceText}`}</strong>
          </>
        )}
      </div>
      <span className="experience-card-price-note">
        {isContact(price) ? '' : priceNote?.replace(/^\/\s*/, 'per ')}
      </span>
    </div>
  )
}

/*
  Shared card used by every tour/experience grid on the site.
  Layout: image + badge, gold eyebrow, title, description, check points,
  divider, price row, full-width primary CTA and outlined secondary CTA.
*/
export default function ExperienceCard({
  image,
  imageAlt,
  imageClassName = '',
  href,
  badge,
  badgeTone = 'dark',
  meta,
  eyebrow,
  title,
  description,
  points = [],
  price,
  oldPrice,
  priceNote,
  className = '',
  ...rest
}) {
  // Image 1 from the admin panel wins over the built-in card image.
  const cardImage = useTourCardImage(title, image)

  return (
    <article className={`experience-card ${className}`.trim()} {...rest}>
      <a className="experience-card-media" href={href} aria-label={`View ${title}`}>
        <img className={imageClassName} src={cardImage} alt={imageAlt || title} loading="lazy" />
        {badge && <span className={`experience-card-badge experience-card-badge--${badgeTone}`}>{badge}</span>}
        {meta && <span className="experience-card-meta">{meta}</span>}
      </a>

      <div className="experience-card-body">
        {eyebrow && <span className="experience-card-eyebrow">{eyebrow}</span>}
        <h3 className="experience-card-title"><a href={href}>{title}</a></h3>
        {description && <p className="experience-card-description">{description}</p>}

        {points.length > 0 && (
          <ul className="experience-card-points">
            {points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        )}

        <ExperiencePriceRow price={price} oldPrice={oldPrice} priceNote={priceNote} />

        <ExperienceCardActions title={title} detailHref={href} />
      </div>
    </article>
  )
}
