# Family Package Card Image Fix

- Replaced the VIP Private Desert Safari – Family Package card artwork with the supplied full desert family setup image.
- Removed the old `featuredImage` override that was forcing the previous collage image to render in the Top Experiences card.
- The card now uses the same `object-fit: cover` image behavior as the other Top Experiences cards, so it fills the entire image area consistently.
- Existing family package page, six event cards, routes, booking form, and content were not changed.
