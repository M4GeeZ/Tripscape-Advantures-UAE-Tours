// Hides test / junk entries (e.g. "hgng") from every place reviews are shown.
export function isDisplayableReview(review) {
  const text = String(review?.text || '').trim()
  return text.length >= 25 && text.split(/\s+/).length >= 4 && String(review?.name || '').trim().length >= 2
}
