# Premium Pages Update

Added complete premium page designs for:

- `/services`
- `/about`
- `/blog`
- `/contact`

The existing Home and Tours pages were not redesigned. Navbar and Footer components remain shared across every page; only their links were updated so the new routes open correctly.

## Animation system

`client/src/hooks/useLuxuryReveal.js` provides the slow in-place text reveal and scroll fade animation inspired by the supplied reference video. It is used only on the new page content and keeps layout positions unchanged.

## New component

- `client/src/components/PageHero/PageHero.jsx`
- `client/src/components/PageHero/PageHero.css`

Each page keeps its JSX and CSS inside its own folder.
