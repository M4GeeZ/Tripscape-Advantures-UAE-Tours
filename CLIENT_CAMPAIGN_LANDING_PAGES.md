# Client Campaign Landing Pages

Implemented as focused Google Ads landing pages. Each page contains only a small set of packages relevant to the advertised service, a booking form, WhatsApp and call CTAs, inclusions, exclusions, know-before-you-go content and FAQs.

## Campaign URLs
- `/tours/desert-safari` — Evening Desert Safari campaign landing page
- `/tours/evening-desert-safari` — alias for Evening Desert Safari
- `/tours/quad-bike` — Quad Bike campaign landing page
- `/tours/dune-buggy` — Dune Buggy campaign landing page
- `/tours/private-desert-setup` — Private Desert Safari / VIP Setup campaign landing page

## Desert E-Jet
- Added to Desert Adventures cards/category.
- Dedicated page: `/tours/desert-adventures/desert-e-jet-water-go-kart-dubai`
- Uses client-supplied photos and videos.
- Includes 10 laps AED 250 and 15 laps AED 300 options, supplied inclusions/exclusion and know-before-you-start information.

## Booking behavior
The campaign forms do not require a new backend endpoint. Submitting a form builds a structured booking request and opens it directly in WhatsApp to the existing Tripscape number. Call CTAs use the existing phone number.

## Existing tour detail pages
Existing individual tour detail content was not rewritten. Campaign package cards continue to link to the existing tour detail pages.
