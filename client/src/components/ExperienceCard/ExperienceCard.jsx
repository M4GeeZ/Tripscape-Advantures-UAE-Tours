import ExperienceCardActions from '../ExperienceCardActions/ExperienceCardActions'
import { applyPromoToPrice, usePromo } from '../../utils/promoOffers'
import './ExperienceCard.css'

const CONTACT_PRICE = /^(|contact.*|(from\s*)?aed\s*0)$/i

const isContact = (price) => CONTACT_PRICE.test(String(price || '').trim())

// Discounted price for a tour when the visitor has copied one of its promo codes.
export function usePromoPrice(title, price) {
  const promo = usePromo(title)
  return isContact(price) ? null : applyPromoToPrice(price, promo)
}

export function PromoSaleBadge({ title, price }) {
  const deal = usePromoPrice(title, price)
  return deal ? <span className="experience-card-sale">Save {deal.percent}%</span> : null
}

// Divider + price row shared by every card markup on the site.
export function ExperiencePriceRow({ title, price, oldPrice, priceNote }) {
  const deal = usePromoPrice(title, price)
  const priceText = String(deal?.price || price || '').trim()
  const struck = deal?.oldPrice || oldPrice

  return (
    <div className="experience-card-price-row">
      <div className="experience-card-price">
        {isContact(price) ? (
          <strong>Contact for price</strong>
        ) : (
          <>
            {struck && <s>{struck}</s>}
            <strong>{struck || /^from\b/i.test(priceText) ? priceText : `From ${priceText}`}</strong>
          </>
        )}
      </div>
      <span className="experience-card-price-note">
        {isContact(price) ? '' : priceNote?.replace(/^\/\s*/, 'per ')}
      </span>
      {deal && <span className="experience-card-code">Code {deal.code} applied</span>}
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
  const deal = usePromoPrice(title, price)

  return (
    <article className={`experience-card ${className}`.trim()} {...rest}>
      <a className="experience-card-media" href={href} aria-label={`View ${title}`}>
        <img className={imageClassName} src={image} alt={imageAlt || title} loading="lazy" />
        {badge && <span className={`experience-card-badge experience-card-badge--${badgeTone}`}>{badge}</span>}
        {deal ? <PromoSaleBadge title={title} price={price} /> : meta && <span className="experience-card-meta">{meta}</span>}
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

        <ExperiencePriceRow title={title} price={price} oldPrice={oldPrice} priceNote={priceNote} />

        <ExperienceCardActions title={title} detailHref={href} />
      </div>
    </article>
  )
}
