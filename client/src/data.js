import { images } from './generatedImages'

export const heroSlides = [
  {
    eyebrow: 'Most popular',
    title: 'Evening Desert Safari',
    copy: 'Dune bashing · Camel ride · BBQ dinner · Live shows',
    image: images.heroDesert
  },
  {
    eyebrow: 'City highlight',
    title: 'Dubai skyline after dark',
    copy: 'Private transfers · Burj Khalifa · Marina · Old Dubai',
    image: images.heroCity
  },
  {
    eyebrow: 'Premium escape',
    title: 'VIP camp under the stars',
    copy: 'Private seating · Gourmet dinner · Dedicated host',
    image: images.heroCamp
  },
  {
    eyebrow: 'Desert tradition',
    title: 'Camel trails at golden hour',
    copy: 'Guided ride · Sunset views · Arabian desert moments',
    image: images.heroCamel
  }
]

export const tours = [
  { image: images.tourQuad, tag: 'Desert safari', meta: 'Morning', title: 'Morning Desert Safari with Quad Bike', price: 'Contact for price' },
  { image: images.tourCamp, tag: 'Desert safari', meta: 'Evening', title: 'Evening Desert Safari with BBQ Dinner', price: 'Contact for price' },
  { image: images.tourVip, tag: 'Desert safari', meta: 'VIP', title: 'Desert Safari with VIP Setup', price: 'Contact for price' },
  { image: images.tourPrivate, tag: 'Desert safari', meta: 'Private', title: 'VIP Desert Safari with Private Seating', price: 'Contact for price' },
  { image: images.tourGate, tag: 'Desert safari', meta: 'Premium', title: 'VIP Premium Desert Safari with BBQ Dinner', price: 'Contact for price' },
  { image: images.tourCamel, tag: 'Desert safari', meta: '30 min', title: 'Sunrise Camel Trekking', price: 'Contact for price' },
  { image: images.tourCaravan, tag: 'Desert safari', meta: 'Dinner', title: 'Desert Safari with Dinner at Caravanserai', price: 'Contact for price' }
]

export const cities = [
  { image: images.cityDubai, title: 'Dubai City Tour', price: 'From AED 0' },
  { image: images.cityBurj, title: 'Dubai City Tour with Burj Khalifa Visit', price: 'From AED 0' },
  { image: images.cityAbuDhabi, title: 'Abu Dhabi City Tour', price: 'From AED 0' },
  { image: images.citySix, title: 'Six Emirates Tour', price: 'From AED 0' },

  { image: images.cityDubai, title: 'Old Dubai Heritage Tour', price: 'From AED 0' },
  { image: images.cityAbuDhabi, title: 'Abu Dhabi Mosque & Corniche Tour', price: 'From AED 0' }
]

export const adventures = [
  { image: images.adventureBuggy, title: 'CAN-AM Buggy Tour – 1 Hour', price: 'From AED 1249' },
  { image: images.adventureDunes, title: 'CAN-AM Buggy Tour with Dinner', price: 'From AED 1649' },
  { image: images.adventureQuad, title: 'Evening Buggy Tour with Dinner', price: 'From AED 800' },
  { image: images.adventureEvening, title: 'Evening Quad Bike with Dinner', price: 'From AED 450' },
  { image: images.adventureDrive, title: 'Dune Buggy Experience', price: 'From AED 0' },
  { image: images.adventureDouble, title: 'Single and Double Quad Bike', price: 'From AED 0' }
]

export const helicopters = [
  { image: images.heliPalm, tier: 'Standard', title: 'Iconic Tour', duration: '12 Min', price: 'AED 710', unit: 'Per Person', copy: 'Best entry flight for guests who want a quick skyline experience.' },
  { image: images.heliMarina, tier: 'Standard', title: 'Palm Tour', duration: '17 Min', price: 'AED 945', unit: 'Per Person', copy: 'Balanced route covering Palm highlights and coastal views.' },
  { image: images.heliVision, tier: 'Standard', title: 'Vision Tour', duration: '22 Min', price: 'AED 1,299', unit: 'Per Person', copy: 'Longer scenic flight with a fuller Dubai overview.' },
  { image: images.heliPrivate, tier: 'Premium safari', title: 'VIP Private Flight', duration: '17 Min', price: 'AED 4,725', unit: 'Per Flight', copy: 'Private setup for couples, VIP arrivals, and small groups.' },
  { image: images.heliPremium, tier: 'Premium safari', title: 'Premium Safari Flight', duration: '40 Min', price: 'AED 11,200', unit: 'Per Flight', copy: 'Our most complete premium category with the strongest private experience.' },

  { image: images.heliPalm, tier: 'Helicopter package', title: 'Dubai Skyline Flight', duration: '25 Min', price: 'AED 1,650', unit: 'Per Person', copy: 'An extended helicopter route covering the Palm, Marina and downtown landmarks.' }
]

export const attractions = [
  { image: images.attractionBurj, title: 'Burj Khalifa — At the Top', price: 'AED 149' },
  { image: images.attractionMuseum, title: 'Museum of the Future', price: 'AED 149' },
  { image: images.attractionAquarium, title: 'Dubai Aquarium & Underwater Zoo', price: 'AED 99' },
  { image: images.attractionMosque, title: 'Sheikh Zayed Grand Mosque — Guided Tour', price: 'AED 0' },

  { image: images.attractionBurj, title: 'Dubai Frame Entry Ticket', price: 'AED 69' },
  { image: images.attractionMuseum, title: 'AYA Universe Dubai', price: 'AED 135' }
]

export const reviews = [
  { name: 'Simon P.', place: 'United Kingdom', text: 'Amazing experience! The dune bashing was incredible and the BBQ was delicious.' },
  { name: 'Priya S.', place: 'India', text: 'Sheikh Zayed Mosque at sunset was unforgettable. Driver was punctual and very kind.' },
  { name: 'James O’Connor', place: 'Ireland', text: 'Best operator in Dubai. WhatsApp replies in under a minute and fair pricing.' },
  { name: 'Sophie Laurent', place: 'France', text: 'Pure adrenaline then calm under the stars. A beautiful evening.' },
  { name: 'Daniel W.', place: 'Germany', text: 'Smooth, professional, and exactly on time. Will book again.' },
  { name: 'Cara N.', place: 'Australia', text: 'Great safari and a patient guide. Perfect for first-time visitors.' }
]

export const blogs = [
  { image: images.blogOne, tag: 'Tips', title: 'Dubai in Summer: How to Plan a Comfortable Trip' },
  { image: images.blogTwo, tag: 'Reviews', title: 'Traveller Review: Why Families Choose a Private Desert Safari' },
  { image: images.blogThree, tag: 'Destinations', title: 'Abu Dhabi Cultural Day: Mosque, Louvre and Corniche' }
]


export const tourCategories = [
  { name: 'Desert Safari', description: 'Classic, VIP and overnight desert experiences', image: images.tourCamp },
  { name: 'Desert Adventures', description: 'Quad bikes, buggies and self-drive thrills', image: images.adventureDrive },
  { name: 'City Tours', description: 'Guided Dubai, Abu Dhabi and UAE sightseeing', image: images.cityBurj },
  { name: 'Attractions', description: "Tickets for the UAE's most popular landmarks", image: images.attractionMuseum },
  { name: 'Cruises', description: 'Marina cruising and waterfront dining experiences', image: images.heliMarina },
  { name: 'Water Activities', description: 'Yachts, underwater and coastal adventures', image: images.attractionAquarium },
  { name: 'Aerial Experiences', description: 'Helicopter flights and skyline experiences', image: images.heliPalm },
  { name: 'Packages', description: 'Curated multi-day itineraries and value packages', image: images.aboutSecondary }
]

export const tourFilterNames = ['All', ...tourCategories.map((category) => category.name)]

export const tourCatalog = [
  { id: 1, category: 'Desert Safari', image: images.tourCamp, title: 'Evening Desert Safari with BBQ Dinner', description: 'Golden dunes, dune bashing, camel riding and a traditional live-show dinner camp.', duration: '7 hours', location: 'Dubai Desert', price: 'AED 149', rating: '4.9', reviews: 356, featured: true },
  { id: 2, category: 'Desert Safari', image: images.tourPrivate, title: 'VIP Desert Safari with Private Seating', description: 'A premium desert evening with reserved seating, table service and private transfers.', duration: '7 hours', location: 'Lahbab Desert', price: 'AED 299', rating: '4.9', reviews: 184, featured: true },
  { id: 3, category: 'Desert Safari', image: images.tourCamel, title: 'Sunrise Camel Trekking Experience', description: 'A peaceful guided camel trail timed with the soft first light over the dunes.', duration: '3 hours', location: 'Al Awir', price: 'AED 189', rating: '4.8', reviews: 91 },
  { id: 4, category: 'Desert Safari', image: images.tourVip, title: 'Premium Overnight Desert Escape', description: 'Sunset safari, gourmet dinner and a comfortable overnight camp beneath the stars.', duration: '18 hours', location: 'Dubai Desert', price: 'AED 649', rating: '4.9', reviews: 72 },

  { id: 5, category: 'Desert Adventures', image: images.adventureBuggy, title: 'CAN-AM Buggy Tour — 1 Hour', description: 'High-performance private buggy driving on open dunes with a professional marshal.', duration: '1 hour', location: 'Lahbab Desert', price: 'AED 1,249', rating: '4.9', reviews: 118, featured: true },
  { id: 6, category: 'Desert Adventures', image: images.adventureDunes, title: 'CAN-AM Buggy Tour with Dinner', description: 'A powerful dune-driving session followed by a relaxed evening desert dinner.', duration: '5 hours', location: 'Dubai Desert', price: 'AED 1,649', rating: '4.8', reviews: 67 },
  { id: 7, category: 'Desert Adventures', image: images.adventureQuad, title: 'Evening Quad Bike Adventure', description: 'Ride a modern quad bike across a supervised dune area before sunset.', duration: '2 hours', location: 'Al Badayer', price: 'AED 450', rating: '4.7', reviews: 143 },

  { id: 8, category: 'City Tours', image: images.cityDubai, title: 'Dubai City Tour', description: 'Discover Old Dubai, Jumeirah, Palm highlights and the city skyline in one journey.', duration: '5 hours', location: 'Dubai', price: 'AED 129', rating: '4.8', reviews: 221 },
  { id: 9, category: 'City Tours', image: images.cityBurj, title: 'Dubai City Tour with Burj Khalifa', description: 'A guided city route completed with entry to the world-famous Burj Khalifa.', duration: '7 hours', location: 'Dubai', price: 'AED 349', rating: '4.9', reviews: 198, featured: true },
  { id: 10, category: 'City Tours', image: images.cityAbuDhabi, title: 'Abu Dhabi Grand City Tour', description: 'Visit the capital’s mosque, Corniche, heritage landmarks and modern skyline.', duration: '9 hours', location: 'Abu Dhabi', price: 'AED 249', rating: '4.8', reviews: 176 },

  { id: 11, category: 'Attractions', image: images.attractionBurj, title: 'Burj Khalifa — At the Top', description: 'Timed entry to Levels 124 and 125 with panoramic views across Dubai.', duration: '2 hours', location: 'Downtown Dubai', price: 'AED 149', rating: '4.9', reviews: 510, featured: true },
  { id: 12, category: 'Attractions', image: images.attractionMuseum, title: 'Museum of the Future', description: 'Explore immersive exhibitions about technology, design and tomorrow’s world.', duration: '2 hours', location: 'Dubai', price: 'AED 149', rating: '4.8', reviews: 342 },
  { id: 13, category: 'Attractions', image: images.attractionAquarium, title: 'Dubai Aquarium & Underwater Zoo', description: 'See sharks, rays and marine life through one of the world’s largest aquarium tunnels.', duration: '3 hours', location: 'Dubai Mall', price: 'AED 99', rating: '4.7', reviews: 284 },
  { id: 14, category: 'Attractions', image: images.attractionMosque, title: 'Sheikh Zayed Grand Mosque Guided Tour', description: 'A respectful guided visit focused on architecture, culture and local history.', duration: '3 hours', location: 'Abu Dhabi', price: 'AED 79', rating: '4.9', reviews: 153 },

  { id: 15, category: 'Cruises', image: images.heliMarina, title: 'Dubai Marina Sunset Cruise', description: 'Cruise past the illuminated Marina skyline with refreshments and open-air seating.', duration: '2 hours', location: 'Dubai Marina', price: 'AED 159', rating: '4.8', reviews: 211 },
  { id: 16, category: 'Cruises', image: images.blogTwo, title: 'Premium Dinner Dhow Cruise', description: 'A refined evening cruise with buffet dining, skyline views and hotel transfers.', duration: '3 hours', location: 'Dubai Creek', price: 'AED 199', rating: '4.7', reviews: 164 },

  { id: 17, category: 'Water Activities', image: images.attractionAquarium, title: 'Atlantis Aquaventure Day Pass', description: 'A full day of slides, private beach access and family water attractions.', duration: 'Full day', location: 'Palm Jumeirah', price: 'AED 315', rating: '4.8', reviews: 429, featured: true },
  { id: 18, category: 'Water Activities', image: images.citySix, title: 'Jumeirah Jet Ski Experience', description: 'Ride along the coast with Burj Al Arab views and a certified water-sports guide.', duration: '1 hour', location: 'Jumeirah', price: 'AED 299', rating: '4.8', reviews: 132 },

  { id: 19, category: 'Aerial Experiences', image: images.heliPalm, title: 'Iconic Dubai Helicopter Tour', description: 'A scenic flight over Palm Jumeirah, Atlantis and Dubai’s signature coastline.', duration: '12 minutes', location: 'Dubai', price: 'AED 710', rating: '4.9', reviews: 96, featured: true },
  { id: 20, category: 'Aerial Experiences', image: images.heliVision, title: 'Vision Helicopter Tour', description: 'A longer panoramic route with the Palm, Marina and downtown skyline in view.', duration: '22 minutes', location: 'Dubai', price: 'AED 1,299', rating: '4.9', reviews: 61 },
  { id: 21, category: 'Aerial Experiences', image: images.heliPrivate, title: 'VIP Private Helicopter Flight', description: 'A private aircraft experience for couples, families and special arrivals.', duration: '17 minutes', location: 'Dubai', price: 'AED 4,725', rating: '5.0', reviews: 28 },

  { id: 22, category: 'Packages', image: images.aboutPrimary, title: 'Dubai Highlights — 3 Day Package', description: 'A balanced city, desert and attraction itinerary with private airport transfers.', duration: '3 days', location: 'Dubai', price: 'AED 1,899', rating: '4.9', reviews: 74, featured: true },
  { id: 23, category: 'Packages', image: images.aboutSecondary, title: 'Dubai & Abu Dhabi — 5 Day Journey', description: 'Two emirates, premium city touring and a memorable VIP desert evening.', duration: '5 days', location: 'UAE', price: 'AED 3,499', rating: '4.9', reviews: 49 }
]
