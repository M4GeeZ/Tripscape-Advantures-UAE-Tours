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

  { image: images.cityOldDubai, title: 'Old Dubai Heritage Tour', price: 'From AED 0' },
  { image: images.cityCorniche, title: 'Abu Dhabi Mosque & Corniche Tour', price: 'From AED 0' }
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
  { image: '/images/heli-card-01.jpg', tier: 'Standard', title: 'Iconic Tour', duration: '12 Min', price: 'AED 710', unit: 'Per Person', copy: 'Best entry flight for guests who want a quick skyline experience.' },
  { image: '/images/heli-card-02.jpg', tier: 'Standard', title: 'Palm Tour', duration: '17 Min', price: 'AED 945', unit: 'Per Person', copy: 'Balanced route covering Palm highlights and coastal views.' },
  { image: '/images/heli-card-03.jpg', tier: 'Standard', title: 'Vision Tour', duration: '22 Min', price: 'AED 1,299', unit: 'Per Person', copy: 'Longer scenic flight with a fuller Dubai overview.' },
  { image: '/images/heli-card-04.jpg', tier: 'Premium safari', title: 'VIP Private Flight', duration: '17 Min', price: 'AED 4,725', unit: 'Per Flight', copy: 'Private setup for couples, VIP arrivals, and small groups.' },
  { image: '/images/heli-card-05.jpg', tier: 'Premium safari', title: 'Premium Safari Flight', duration: '40 Min', price: 'AED 11,200', unit: 'Per Flight', copy: 'Our most complete premium category with the strongest private experience.' },

  { image: images.heliPalm, tier: 'Helicopter package', title: 'Dubai Skyline Flight', duration: '25 Min', price: 'AED 1,650', unit: 'Per Person', copy: 'An extended helicopter route covering the Palm, Marina and downtown landmarks.' }
]

export const attractions = [
  { image: '/images/attraction-card-01.jpg', title: 'Burj Khalifa — At the Top', price: 'AED 149' },
  { image: '/images/attraction-card-02.jpg', title: 'Museum of the Future', price: 'AED 149' },
  { image: '/images/attraction-card-03.jpg', title: 'Dubai Aquarium & Underwater Zoo', price: 'AED 99' },
  { image: '/images/attraction-card-04.jpg', title: 'Sheikh Zayed Grand Mosque — Guided Tour', price: 'AED 0' },
  { image: '/images/attraction-card-05.webp', title: 'Dubai Frame Entry Ticket', price: 'AED 69' },
  { image: '/images/attraction-card-06.jpg', title: 'AYA Universe Dubai', price: 'AED 135' }
]

export const reviews = [
  { name: 'Simon P.', place: 'United Kingdom', source: 'Google', text: 'Amazing experience! The dune bashing was incredible and the BBQ was delicious. Highly recommend Tripscape!' },
  { name: 'Priya S.', place: 'India', source: 'Google', text: 'Sheikh Zayed Mosque at sunset was unforgettable. Driver was punctual and very kind to our kids.' },
  { name: 'James O’Connor', place: 'Ireland', source: 'Google', text: 'Best operator in Dubai. WhatsApp replies in under a minute, fair pricing.' },
  { name: 'Sophie Laurent', place: 'France', source: 'Google', text: 'Dune buggy + BBQ combo. Pure adrenaline then calm under the stars. 10/10!' },
  { name: 'Daniel W.', place: 'Germany', source: 'TripAdvisor', text: 'Smooth, professional, showed up 10 minutes early. Will book again.' },
  { name: 'Cara N.', place: 'Australia', source: 'Google', text: 'Great Desert Safari! Guide was patient with us nervous first-timers.' }
]

export const blogs = [
  {
    image: '/images/blog-home-museum.png',
    tag: 'Tips',
    title: 'Dubai in Summer: How to Plan a Comfortable Trip',
    copy: 'A practical guide to indoor attractions, tour timings and transport during Dubai summer.',
    time: '4 min',
    date: '8 Jul'
  },
  {
    image: '/images/hero-camp.webp',
    tag: 'Reviews',
    title: 'Traveller Review: Why Families Choose a Private Desert Safari',
    copy: 'What families value most about private vehicles, flexible timings and dedicated guides.',
    time: '4 min',
    date: '5 Jul'
  },
  {
    image: '/images/blog-home-ferrari.png',
    tag: 'Destinations',
    title: 'Abu Dhabi Cultural Day: Mosque, Louvre and Corniche',
    copy: 'A realistic one-day route covering Abu Dhabi’s essential cultural landmarks.',
    time: '5 min',
    date: '3 Jul'
  }
]


export const tourCategories = [
  { name: 'Desert Safari', description: 'Classic, VIP and overnight desert experiences', image: '/images/hero-desert.webp' },
  { name: 'Desert Adventures', description: 'Quad bikes, buggies and self-drive thrills', image: images.adventureDrive },
  { name: 'City Tours', description: 'Guided Dubai, Abu Dhabi and UAE sightseeing', image: images.cityBurj },
  { name: 'Attractions', description: "Tickets for the UAE's .......... landmarks", image: '/images/attraction-card-01.jpg' },
  { name: 'Cruises', description: 'Marina cruising and waterfront dining experiences', image: '/images/city-dubai.webp' },
  { name: 'Water Activities', description: 'Yachts, underwater and coastal adventures', image: images.attractionAquarium },
  { name: 'Aerial Experiences', description: 'Helicopter flights and skyline experiences', image: '/images/heli-card-02.jpg' },
  { name: 'Packages', description: 'Curated multi-day itineraries and value packages', image: '/images/hero-camp.webp' }
]

export const tourFilterNames = ['All', ...tourCategories.map((category) => category.name)]

export const tourCatalog = [
  { id: 1, category: 'Desert Safari', image: '/images/hero-desert.webp', title: 'Morning Desert Safari with Quad Bike', description: 'Morning Desert Safari with Quad Bike experience in the UAE.', duration: 'Morning', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 2, category: 'Desert Safari', image: '/images/adv-evening.webp', title: 'Evening Desert Safari with BBQ Dinner', description: 'Evening Desert Safari with BBQ Dinner experience in the UAE.', duration: 'Evening', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 3, category: 'Desert Safari', image: '/images/hero-camp.webp', title: 'Desert Safari with VIP Setup', description: 'Desert Safari with VIP Setup experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 4, category: 'Desert Safari', image: '/images/hero-camp.webp', title: 'VIP Desert Safari with Private Seating', description: 'VIP Desert Safari with Private Seating experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 5, category: 'Desert Safari', image: '/images/adv-dune-drive.webp', title: 'VIP Premium Desert Safari with BBQ Dinner', description: 'VIP Premium Desert Safari with BBQ Dinner experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 6, category: 'Desert Safari', image: '/images/hero-camel.webp', title: 'Sunrise Camel Trekking', description: 'Sunrise Camel Trekking experience in the UAE.', duration: '30 minutes camel trekking', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 7, category: 'Desert Safari', image: '/images/adv-evening.webp', title: 'Desert Safari with Dinner at Caravanserai', description: 'Desert Safari with Dinner at Caravanserai experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 8, category: 'Desert Safari', image: '/images/hero-desert.webp', title: 'Royal Desert Safari with Dinner at Desert Fortress', description: 'Royal Desert Safari with Dinner at Desert Fortress experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 9, category: 'Desert Safari', image: '/images/hero-camp.webp', title: 'Overnight Desert Safari', description: 'Overnight Desert Safari experience in the UAE.', duration: 'Overnight', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 10, category: 'Desert Safari', image: '/images/adv-dunes.webp', title: 'Bedouin Desert Safari Tour', description: 'Bedouin Desert Safari Tour experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'AED 1400', unit: '/person', rating: '4.9', reviews: 0 },
  { id: 11, category: 'Desert Safari', image: '/images/hero-camel.webp', title: 'Falconry Show and Dinner at Camp', description: 'Falconry Show and Dinner at Camp experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'AED 1649', unit: '/person', rating: '4.9', reviews: 0 },
  { id: 12, category: 'Desert Safari', image: '/images/adv-evening.webp', title: 'Desert Safari with Falconry Show and Dinner', description: 'Desert Safari with Falconry Show and Dinner experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'AED 1999', unit: '/person', rating: '4.9', reviews: 0 },
  { id: 13, category: 'Desert Safari', image: '/images/adv-dune-drive.webp', title: 'Private Desert Safari with Sahara Fortress Dinner', description: 'Private Desert Safari with Sahara Fortress Dinner experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'AED 2049', unit: '/person', rating: '4.9', reviews: 0 },
  { id: 14, category: 'Desert Safari', image: '/images/hero-desert.webp', title: 'Private Desert Safari at Bab Al Shams Resort', description: 'Private Desert Safari at Bab Al Shams Resort experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'AED 2450', unit: '/person', rating: '4.9', reviews: 0 },
  { id: 15, category: 'Desert Adventures', image: '/images/adv-buggy.webp', title: 'CAN-AM Buggy Tour – 1 Hour', description: 'CAN-AM Buggy Tour – 1 Hour experience in the UAE.', duration: '1 hour', location: 'Dubai, UAE', price: 'AED 1249', unit: '/person', rating: '4.9', reviews: 0 },
  { id: 16, category: 'Desert Adventures', image: '/images/adv-dunes.webp', title: 'CAN-AM Buggy Tour with Dinner', description: 'CAN-AM Buggy Tour with Dinner experience in the UAE.', duration: '1 hour', location: 'Dubai, UAE', price: 'AED 1649', unit: '/person', rating: '4.9', reviews: 0 },
  { id: 17, category: 'Desert Adventures', image: '/images/adv-quad.webp', title: 'Evening Buggy Tour with Dinner', description: 'Evening Buggy Tour with Dinner experience in the UAE.', duration: '1 hour', location: 'Dubai, UAE', price: 'AED 800', unit: '/person', rating: '4.9', reviews: 0 },
  { id: 18, category: 'Desert Adventures', image: '/images/adv-evening.webp', title: 'Evening Quad Bike with Dinner', description: 'Evening Quad Bike with Dinner experience in the UAE.', duration: '30 minutes', location: 'Dubai, UAE', price: 'AED 450', unit: '/person', rating: '4.9', reviews: 0 },
  { id: 19, category: 'Desert Adventures', image: '/images/adv-dune-drive.webp', title: 'Dune Buggy Tour', description: 'Dune Buggy Tour experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 20, category: 'Desert Adventures', image: '/images/adv-double.webp', title: 'Single and Double Quad Bike', description: 'Single and Double Quad Bike experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 21, category: 'City Tours', image: '/images/city-01-dubai-burj-al-arab.webp', title: 'Dubai City Tour', description: 'Dubai City Tour experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 22, category: 'City Tours', image: '/images/city-02-dubai-burj-khalifa.webp', title: 'Dubai City Tour with Burj Khalifa Visit', description: 'Dubai City Tour with Burj Khalifa Visit experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 23, category: 'City Tours', image: '/images/city-03-abu-dhabi.webp', title: 'Abu Dhabi City Tour', description: 'Abu Dhabi City Tour experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 24, category: 'City Tours', image: '/images/city-04-six-emirates.webp', title: 'Six Emirates Tour', description: 'Six Emirates Tour experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 25, category: 'Cruises', image: '/images/heli-marina.webp', title: 'Dhow Cruise Marina with Dinner', description: 'Dhow Cruise Marina with Dinner experience in the UAE.', duration: '2 hours', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 26, category: 'Attractions', image: '/images/attraction-card-05.webp', title: 'Dubai Frame', description: 'Dubai Frame experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 27, category: 'Attractions', image: '/images/attraction-card-06.jpg', title: 'Global Village', description: 'Global Village experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 28, category: 'Attractions', image: '/images/attraction-card-03.jpg', title: 'Dubai Aquarium & Underwater Zoo', description: 'Dubai Aquarium & Underwater Zoo experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 29, category: 'Attractions', image: '/images/attr-aquarium.webp', title: 'The Lost Chambers Aquarium', description: 'The Lost Chambers Aquarium experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 30, category: 'Attractions', image: '/images/attr-museum.webp', title: 'Ski Dubai', description: 'Ski Dubai experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 31, category: 'Attractions', image: '/images/blog-home-museum.png', title: 'Museum of the Future', description: 'Museum of the Future experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 32, category: 'Attractions', image: '/images/heli-palm.webp', title: 'The View at The Palm', description: 'The View at The Palm experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 33, category: 'Attractions', image: '/images/attraction-card-03.jpg', title: 'Dubai Dolphinarium (Dolphin and Seal Show)', description: 'Dubai Dolphinarium (Dolphin and Seal Show) experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 34, category: 'Attractions', image: '/images/attraction-card-01.jpg', title: 'Sky Views Observatory', description: 'Sky Views Observatory experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 35, category: 'Attractions', image: '/images/attr-museum.webp', title: 'IMG Worlds of Adventure', description: 'IMG Worlds of Adventure experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 36, category: 'Attractions', image: '/images/city-03-abu-dhabi.webp', title: 'Warner Bros. World', description: 'Warner Bros. World experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 37, category: 'Attractions', image: '/images/blog-home-ferrari.png', title: 'Ferrari World', description: 'Ferrari World experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 38, category: 'Attractions', image: '/images/attraction-card-01.jpg', title: 'The Lounge Burj Khalifa 666', description: 'The Lounge Burj Khalifa 666 experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 39, category: 'Attractions', image: '/images/attraction-card-01.jpg', title: 'At the Top Burj Khalifa and Sky View', description: 'At the Top Burj Khalifa and Sky View experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 40, category: 'Attractions', image: '/images/city-02-dubai-burj-khalifa.webp', title: 'Burj Khalifa at the Top – Non Prime', description: 'Burj Khalifa at the Top – Non Prime experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 41, category: 'Attractions', image: '/images/attr-mosque.webp', title: 'Miracle Garden', description: 'Miracle Garden experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 42, category: 'Attractions', image: '/images/attraction-card-06.jpg', title: 'AYA Universe', description: 'AYA Universe experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 43, category: 'Attractions', image: '/images/attr-aya.webp', title: 'Dubai Garden Glow', description: 'Dubai Garden Glow experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 44, category: 'Attractions', image: '/images/about-1.webp', title: 'Atlantis Aquaventure', description: 'Atlantis Aquaventure experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 45, category: 'Attractions', image: '/images/city-01-dubai-burj-al-arab.webp', title: 'Inside Burj Al Arab Tour Experience', description: 'Inside Burj Al Arab Tour Experience experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 46, category: 'Attractions', image: '/images/attr-aquarium.webp', title: 'The Green Planet', description: 'The Green Planet experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 47, category: 'Attractions', image: '/images/heli-palm.webp', title: 'Yas Waterworld', description: 'Yas Waterworld experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 48, category: 'Water Activities', image: '/images/heli-marina.webp', title: 'Luxury Yacht', description: 'Luxury Yacht experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 49, category: 'Water Activities', image: '/images/attr-aquarium.webp', title: 'Jet Ski', description: 'Jet Ski experience in the UAE.', duration: '30 / 60 Mins', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 50, category: 'Water Activities', image: '/images/attraction-card-03.jpg', title: 'Scuba Diving', description: 'Scuba Diving experience in the UAE.', duration: '', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
]
