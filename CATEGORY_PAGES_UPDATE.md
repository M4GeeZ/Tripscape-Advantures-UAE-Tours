# Tour Category Pages Update

Implemented reusable category landing pages for the eight cards in the Tours mega menu.

Routes:
- /tours/desert-safari
- /tours/desert-adventures
- /tours/city-tours
- /tours/attractions
- /tours/cruises
- /tours/water-activities
- /tours/aerial-experiences
- /tours/packages

Main files:
- client/src/pages/TourCategory/TourCategory.jsx
- client/src/pages/TourCategory/TourCategory.css
- client/src/tourCategoryPages.js

Also updated:
- client/src/App.jsx
- client/src/components/ToursMegaMenu/ToursMegaMenu.jsx
- client/src/components/Footer/Footer.jsx
- client/src/components/ReviewsSection/ReviewsSection.jsx
- client/src/data.js

The category pages use one reusable React layout with category-specific hero content and tour data. GSAP/ScrollTrigger fade + blur reveal animations are applied to hero text, headings, cards, reviews, and the support section.
