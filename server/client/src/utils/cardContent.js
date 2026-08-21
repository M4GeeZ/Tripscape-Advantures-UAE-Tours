import { categoryToSlug, getTourDetail, slugify } from '../tourDetails'

const categoryEndings = {
  'desert-safari': 'It is a practical choice for travellers who want the desert atmosphere, organised transport and reliable local support in one easy booking.',
  'desert-adventures': 'It suits guests who want more active desert time, with clear safety guidance and support before and during the experience.',
  'city-tours': 'It is ideal for first-time visitors who want to see key landmarks comfortably without planning every stop and transfer themselves.',
  attractions: 'It works well as a simple add-on to a Dubai itinerary, with digital booking support and clear visit instructions before arrival.',
  cruises: 'It is a relaxed way to enjoy Dubai from the water while keeping timing, departure details and guest support easy to manage.',
  'water-activities': 'It is designed for guests who want a straightforward coastal activity with safety guidance and booking support included.',
  'aerial-experiences': 'It is a memorable option for couples, families and visitors who want a premium view of Dubai with a clear check-in process.',
  packages: 'It is arranged to reduce planning time while keeping transport, timing and guest support simple throughout the experience.'
}

export function getCardDescription(category, title, fallback = '') {
  const categorySlug = categoryToSlug(category)
  const detail = getTourDetail(categorySlug, slugify(title))
  let description = detail?.description || fallback || ''

  if (!description || / experience in the UAE\.?$/i.test(description)) {
    description = `${title} is a carefully arranged UAE experience with clear booking support and practical guest guidance.`
  }

  const ending = categoryEndings[categorySlug]
  if (ending && description.length < 310 && !description.includes(ending)) {
    description = `${description} ${ending}`
  }

  return description
}
