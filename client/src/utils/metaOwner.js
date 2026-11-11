/*
  Some pages (category, campaign, E-Jet, private events) set their own title and description.
  They call claimPageMeta() so the sitewide SeoHead does not replace those with its generic values
  when its (lazy-loaded) data arrives.
*/
const normalize = (path) => String(path || '').split(/[?#]/)[0].replace(/\/+$/, '') || '/'

export const metaOwner = { path: '' }

export function claimPageMeta(path = typeof window !== 'undefined' ? window.location.pathname : '') {
  metaOwner.path = normalize(path)
}

export const isMetaClaimed = (path) => metaOwner.path === normalize(path)
