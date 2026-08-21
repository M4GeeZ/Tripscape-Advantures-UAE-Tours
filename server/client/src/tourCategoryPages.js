import { helicopters, tourCatalog } from './data'

const byCategory = (category) => tourCatalog.filter((tour) => tour.category === category)
const desertSafariTours = byCategory('Desert Safari')
const desertAdventureTours = byCategory('Desert Adventures')

const aerialTours = helicopters.map((tour, index) => ({
  id: `aerial-${index + 1}`,
  category: 'Aerial Experiences',
  image: tour.image,
  title: tour.title,
  description: tour.copy,
  duration: tour.duration,
  location: 'Dubai, UAE',
  price: tour.price,
  unit: tour.unit ? `/${tour.unit.toLowerCase().replace('per ', '')}` : '',
  rating: '4.9',
  reviews: 0
}))

const cruiseTours = [
  ...byCategory('Cruises'),
  { id: 'cruise-marina-sunset', category: 'Cruises', image: '/images/heli-marina.webp', title: 'Dubai Marina Sunset Cruise', description: 'Relaxed sunset sailing through Dubai Marina with skyline views.', duration: '2 hours', location: 'Dubai Marina, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 'cruise-creek-dinner', category: 'Cruises', image: '/images/city-old-dubai.webp', title: 'Dubai Creek Dhow Cruise with Dinner', description: 'Traditional dhow cruise through Old Dubai with dinner and evening views.', duration: '2 hours', location: 'Dubai Creek, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 'cruise-yacht', category: 'Cruises', image: '/images/heli-palm.webp', title: 'Private Dubai Marina Yacht Cruise', description: 'Private yacht experience for couples, families and small groups.', duration: '2 hours', location: 'Dubai Marina, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 }
]

const waterTours = [
  ...byCategory('Water Activities'),
  { id: 'water-parasailing', category: 'Water Activities', image: '/images/heli-palm.webp', title: 'Dubai Parasailing Experience', description: 'Take in the coastline from above on a guided parasailing session.', duration: '15 minutes', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 }
]

const packageTours = [
  { id: 'package-dubai-essentials', category: 'Packages', image: '/images/city-02-dubai-burj-khalifa.webp', title: 'Dubai Essentials Package', description: 'A curated Dubai combination covering city highlights and a desert experience.', duration: '2 days', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 'package-desert-city', category: 'Packages', image: '/images/hero-camp.webp', title: 'Desert Safari + Dubai City Tour', description: 'Pair a guided Dubai city tour with an evening desert safari experience.', duration: '2 days', location: 'Dubai, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 'package-dubai-abudhabi', category: 'Packages', image: '/images/city-03-abu-dhabi.webp', title: 'Dubai + Abu Dhabi Highlights', description: 'Discover signature landmarks across Dubai and Abu Dhabi in one easy itinerary.', duration: '3 days', location: 'Dubai & Abu Dhabi, UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 },
  { id: 'package-family', category: 'Packages', image: '/images/attraction-card-06.jpg', title: 'Family UAE Experience Package', description: 'A flexible family-friendly mix of attractions, sightseeing and desert time.', duration: '3 days', location: 'UAE', price: 'Contact for price', unit: '', rating: '4.9', reviews: 0 }
]

const quadBikeTours = [
  ...desertAdventureTours.filter((tour) => /quad/i.test(tour.title)),
  ...desertSafariTours.filter((tour) => /quad/i.test(tour.title))
]

const duneBuggyTours = desertAdventureTours.filter((tour) => /buggy/i.test(tour.title))

const privateDesertTours = desertSafariTours.filter((tour) => /private|vip|premium|royal/i.test(tour.title))

const campaignLanding = {
  desertSafari: {
    seoTitle: 'Dubai Desert Safari | Evening, VIP & Private Tours',
    seoDescription: 'Book Dubai desert safari experiences with dune bashing, camel rides, BBQ dinner, VIP seating and private options. Easy WhatsApp support and flexible packages.',
    introTitle: 'A complete Dubai desert experience, planned around you.',
    introCopy: [
      'Escape the city and experience Dubai’s desert with organised transport, experienced guides and packages for different travel styles. Choose a classic evening safari, a morning adventure, a premium camp setup or a private experience for your group.',
      'This landing page is designed to make comparison easy. Review the available packages, understand what is included, open the individual tour page for full details, or contact the team directly for timing, availability and custom requirements.'
    ],
    highlights: [
      { title: 'Hotel pickup options', copy: 'Convenient pickup and return options can be arranged from major Dubai locations for a smoother start and finish.' },
      { title: 'Dune & desert activities', copy: 'Depending on the package, enjoy dune bashing, camel rides, sandboarding, sunset stops and optional quad-bike upgrades.' },
      { title: 'Camp & dinner choices', copy: 'Select standard, VIP or private seating with BBQ dinner, refreshments and evening entertainment where included.' },
      { title: 'WhatsApp booking support', copy: 'Confirm availability, pickup details and package questions directly with the Tripscape booking team.' }
    ],
    included: ['Licensed desert safari guide', '4×4 desert transfer options', 'Dune drive and photo stops', 'Camel riding on selected packages', 'Camp refreshments', 'BBQ dinner on evening packages', 'Live entertainment on selected packages', 'Booking and WhatsApp support'],
    excluded: ['Personal purchases and souvenirs', 'Alcoholic beverages unless stated', 'Optional upgrades not listed in the package', 'Gratuities', 'Anything not shown in the confirmed inclusions'],
    faqs: [
      { question: 'Which Dubai desert safari is best for first-time visitors?', answer: 'An evening desert safari with dune bashing, camel riding, BBQ dinner and entertainment is the most complete first-time option. Guests wanting extra comfort can choose a VIP or private setup.' },
      { question: 'What time does a desert safari usually start?', answer: 'Morning and evening packages have different pickup windows. Exact timing depends on the selected tour, season and pickup location and is confirmed before travel.' },
      { question: 'Are children allowed on desert safari tours?', answer: 'Yes, many desert safari packages are family friendly, but age and safety restrictions can apply to dune bashing, quad bikes and buggy activities. Confirm child ages before booking.' },
      { question: 'What should I wear?', answer: 'Wear comfortable clothes and closed shoes. Light clothing is suitable in warmer months, while a light layer is useful for cooler winter evenings.' },
      { question: 'Can I book a private desert safari?', answer: 'Yes. Private vehicle, private seating and premium desert packages are available. Open the private desert setup page or contact the team for a tailored option.' },
      { question: 'How do I confirm availability?', answer: 'Use Contact Us or open the individual tour page. The team can confirm the latest rate, pickup time and availability through WhatsApp.' }
    ]
  },
  quadBike: {
    seoTitle: 'Dubai Quad Bike Tours | Desert Quad Bike Packages',
    seoDescription: 'Explore Dubai quad bike tours with morning and evening desert options, guided riding, safety equipment and dinner packages.',
    introTitle: 'Quad bike experiences for a more active Dubai desert day.',
    introCopy: ['Choose from standalone quad-bike sessions and safari combinations that add dune scenery, camp activities or dinner. Packages suit first-time riders as well as guests who want a more energetic desert experience.', 'Compare durations and inclusions below, then open the full tour page or contact the booking team for availability, rider requirements and pickup options.'],
    highlights: [
      { title: 'Safety briefing', copy: 'Riders receive basic operating and safety instructions before the session begins.' },
      { title: 'Multiple package styles', copy: 'Choose a quad-bike session, morning safari combination or evening package with camp and dinner.' },
      { title: 'Desert riding environment', copy: 'Enjoy open desert scenery and designated riding areas with on-ground support.' },
      { title: 'Easy booking support', copy: 'Confirm rider age rules, duration and pickup details before paying for your selected package.' }
    ],
    included: ['Safety briefing', 'Helmet and required safety gear', 'Selected quad-bike riding duration', 'Professional activity support', 'Desert photo opportunities', 'Pickup on selected packages', 'Dinner on selected evening packages', 'WhatsApp booking assistance'],
    excluded: ['Extra riding time beyond the package', 'Vehicle upgrades not selected', 'Personal photo or video packages', 'Meals unless stated in the package', 'Personal expenses and gratuities'],
    faqs: [
      { question: 'Do I need quad bike experience?', answer: 'No previous riding experience is normally required for standard sessions. Follow the safety briefing and activity marshal instructions at all times.' },
      { question: 'What age is required to ride?', answer: 'Age and rider requirements vary by quad-bike type and operator. Confirm the rider age before booking.' },
      { question: 'Are helmets included?', answer: 'Required safety equipment is provided as part of the selected riding package unless your confirmation states otherwise.' },
      { question: 'Can I combine quad biking with a desert safari?', answer: 'Yes. Several packages combine quad biking with dune bashing, camel riding, camp activities or dinner.' },
      { question: 'What should I wear?', answer: 'Closed shoes and comfortable clothes are recommended. Avoid loose items that can interfere with riding.' }
    ]
  },
  duneBuggy: {
    seoTitle: 'Dubai Dune Buggy Tours | CAN-AM Buggy Experiences',
    seoDescription: 'Book Dubai dune buggy and CAN-AM tours with guided desert routes, safety equipment and optional dinner packages.',
    introTitle: 'Powerful dune buggy experiences with professional desert support.',
    introCopy: ['Take control of a buggy on a Dubai desert route with a safety briefing, required equipment and activity support. Choose from shorter adventure sessions or packages that continue into sunset, dinner and camp entertainment.', 'Use this page to compare buggy options in one place. Individual tour pages show the full inclusions, exclusions, FAQs and live price calculator where a fixed price is available.'],
    highlights: [
      { title: 'CAN-AM options', copy: 'Select powerful CAN-AM packages for guests looking for a premium off-road driving experience.' },
      { title: 'Safety-first setup', copy: 'Briefing, helmets and required equipment are arranged before the desert session.' },
      { title: 'Dinner combinations', copy: 'Choose a buggy-only experience or an evening package that continues to a desert camp and dinner.' },
      { title: 'Individual tour pages', copy: 'Open each package to review exact duration, price, inclusions, exclusions and booking details.' }
    ],
    included: ['Pre-drive safety briefing', 'Helmet and required safety equipment', 'Selected buggy session', 'Professional activity guide', 'Desert route and photo stops', 'Water and refreshments', 'Dinner on selected packages', 'Booking support'],
    excluded: ['Damage caused by unsafe driving', 'Extra buggy time or upgrades not selected', 'Personal photography packages', 'Meals unless included in the selected package', 'Personal expenses and gratuities'],
    faqs: [
      { question: 'Do I need a driving licence for a dune buggy?', answer: 'Requirements depend on the selected buggy and operator. Confirm licence and minimum-age rules with the booking team before travel.' },
      { question: 'Is dune buggy driving suitable for beginners?', answer: 'Many packages are suitable for first-time drivers after a safety briefing, provided the guest meets the package requirements.' },
      { question: 'What safety equipment is provided?', answer: 'The selected package includes the required helmet and safety equipment listed on the individual tour page.' },
      { question: 'Can I book a buggy tour with dinner?', answer: 'Yes. Buggy plus dinner packages combine the driving session with a desert camp, meal and evening entertainment.' },
      { question: 'Can two people share a buggy?', answer: 'Vehicle seating depends on the selected package. Contact the team to confirm the available buggy configuration.' }
    ]
  },
  privateDesert: {
    seoTitle: 'Private Desert Safari Dubai | VIP Desert Setup',
    seoDescription: 'Book a private desert safari in Dubai with private 4x4 transport, VIP seating, premium dinner options and dedicated service.',
    introTitle: 'A more private, comfortable way to experience the Dubai desert.',
    introCopy: ['Private and VIP desert packages are designed for couples, families and groups who want more space, flexible service and a premium camp experience. Options can include private 4×4 transport, reserved seating, table service and upgraded dinner settings.', 'Compare the premium packages below and open the individual page for exact inclusions. For celebrations, couples or custom group arrangements, use Contact Us to discuss the setup before booking.'],
    highlights: [
      { title: 'Private transport', copy: 'Selected packages include a private 4×4 vehicle for a more comfortable pickup and desert journey.' },
      { title: 'Reserved seating', copy: 'VIP and private majlis options provide dedicated seating away from standard shared arrangements.' },
      { title: 'Premium service', copy: 'Table service, upgraded dinner and dedicated guest support are available on selected packages.' },
      { title: 'Custom occasions', copy: 'Ask about arrangements for couples, birthdays, families and private group celebrations.' }
    ],
    included: ['Private or premium transfer on selected packages', 'Dune bashing and sunset photo stops', 'Reserved VIP or private seating', 'Table service on selected packages', 'Premium BBQ or dinner options', 'Camel ride and desert activities', 'Live entertainment where included', 'Dedicated booking support'],
    excluded: ['Custom decorations unless confirmed', 'Premium upgrades not listed in the package', 'Alcoholic beverages unless stated', 'Personal expenses and gratuities', 'Anything not included in the final confirmation'],
    faqs: [
      { question: 'What is the difference between VIP and private desert safari?', answer: 'VIP packages usually upgrade seating and service at the camp, while private packages may also include a private vehicle and more exclusive arrangements. Check the individual package inclusions.' },
      { question: 'Can I book for a couple?', answer: 'Yes. Private desert experiences are popular for couples and can be adjusted around the selected package and availability.' },
      { question: 'Is hotel pickup private?', answer: 'Private pickup is included only on packages that specifically state private transfer or private vehicle. Confirm this before booking.' },
      { question: 'Can you arrange a birthday or celebration?', answer: 'Custom requests may be possible depending on the camp and selected package. Contact the team with your date, group size and requirements.' },
      { question: 'Is dinner included?', answer: 'Most evening VIP and private safari options include dinner when stated in the package title or inclusions. Review the individual page before confirming.' }
    ]
  }
}

export const tourCategoryPages = {
  'desert-safari': {
    name: 'Desert Safari', eyebrow: 'Dubai desert safari', heroTitle: 'Dubai desert safari experiences', heroCopy: 'Compare evening, morning, VIP and private desert safari packages with clear inclusions and direct booking support.', heroImage: '/images/hero-desert.webp', sectionTitle: 'Choose your desert safari', sectionCopy: 'Compare packages, review what is included and open the individual page for full booking details.', tours: desertSafariTours, campaign: campaignLanding.desertSafari
  },
  'quad-bike': {
    name: 'Quad Bike', detailCategory: 'Desert Adventures', eyebrow: 'Dubai quad bike', heroTitle: 'Dubai quad bike tours', heroCopy: 'Choose guided quad-bike sessions and desert safari combinations with clear safety information and booking support.', heroImage: '/images/adv-double.webp', sectionTitle: 'Choose your quad bike experience', sectionCopy: 'Compare riding time, safari combinations and evening packages before you book.', tours: quadBikeTours, campaign: campaignLanding.quadBike
  },
  'dune-buggy': {
    name: 'Dune Buggy', detailCategory: 'Desert Adventures', eyebrow: 'Dubai dune buggy', heroTitle: 'Dubai dune buggy & CAN-AM tours', heroCopy: 'Compare self-drive buggy sessions, CAN-AM packages and evening experiences with dinner.', heroImage: '/images/adv-buggy.webp', sectionTitle: 'Choose your dune buggy tour', sectionCopy: 'From one-hour CAN-AM rides to buggy-and-dinner packages, compare the options in one place.', tours: duneBuggyTours, campaign: campaignLanding.duneBuggy
  },
  'private-desert-setup': {
    name: 'Private Desert Setup', detailCategory: 'Desert Safari', eyebrow: 'Private desert safari', heroTitle: 'Private & VIP desert safari Dubai', heroCopy: 'Premium desert experiences with private transport, reserved seating and upgraded camp service on selected packages.', heroImage: '/images/hero-camp.webp', sectionTitle: 'Choose your private desert setup', sectionCopy: 'Compare VIP seating, private vehicle and premium dinner options for couples, families and groups.', tours: privateDesertTours, campaign: campaignLanding.privateDesert
  },
  'desert-adventures': { name: 'Desert Adventures', eyebrow: 'Desert adventures', heroTitle: 'Buggy and quad bike experiences', heroCopy: 'Choose from CAN-AM buggy, evening buggy and quad bike desert experiences.', heroImage: '/images/adv-buggy.webp', sectionTitle: 'Choose your desert adventures', sectionCopy: 'Our most-booked experiences this month — verified guides, instant confirmations, free WhatsApp re-scheduling.', tours: desertAdventureTours },
  'city-tours': { name: 'City Tours', eyebrow: 'City tours', heroTitle: 'Dubai, Abu Dhabi and UAE city tours', heroCopy: 'Explore iconic landmarks, heritage districts and modern skylines with guided city experiences.', heroImage: '/images/city-02-dubai-burj-khalifa.webp', sectionTitle: 'Choose your city tour', sectionCopy: 'Explore Dubai, Abu Dhabi and more with comfortable transfers and knowledgeable local guides.', tours: byCategory('City Tours') },
  attractions: { name: 'Attractions', eyebrow: 'Attractions', heroTitle: 'The UAE’s must-see attractions', heroCopy: 'Book iconic Dubai and Abu Dhabi landmarks, immersive attractions and family favourites.', heroImage: '/images/attraction-card-01.jpg', sectionTitle: 'Choose your attraction', sectionCopy: 'Popular tickets and landmark experiences selected for easy planning and quick support.', tours: byCategory('Attractions') },
  cruises: { name: 'Cruises', eyebrow: 'Cruises', heroTitle: 'Dubai marina and dhow cruise experiences', heroCopy: 'Enjoy dinner cruises, skyline sailing and private yacht experiences along Dubai’s waterfront.', heroImage: '/images/heli-marina.webp', sectionTitle: 'Choose your cruise', sectionCopy: 'From classic dinner cruises to private yacht time, find the waterfront experience that fits your trip.', tours: cruiseTours },
  'water-activities': { name: 'Water Activities', eyebrow: 'Water activities', heroTitle: 'Dubai water and coastal adventures', heroCopy: 'Choose from yachts, jet ski sessions, scuba diving and exciting experiences on the water.', heroImage: '/images/heli-palm.webp', sectionTitle: 'Choose your water activity', sectionCopy: 'Easy-to-book coastal experiences for thrill seekers, couples, families and private groups.', tours: waterTours },
  'aerial-experiences': { name: 'Aerial Experiences', eyebrow: 'Aerial experiences', heroTitle: 'Dubai helicopter and skyline experiences', heroCopy: 'See Palm Jumeirah, Dubai Marina and the city skyline from unforgettable aerial perspectives.', heroImage: '/images/heli-card-02.jpg', sectionTitle: 'Choose your aerial experience', sectionCopy: 'Short scenic flights, extended skyline routes and premium private helicopter experiences.', tours: aerialTours },
  packages: { name: 'Packages', eyebrow: 'UAE packages', heroTitle: 'Curated UAE experiences made simple', heroCopy: 'Combine desert, city and attraction highlights into convenient multi-day itineraries.', heroImage: '/images/hero-camp.webp', sectionTitle: 'Choose your UAE package', sectionCopy: 'Flexible combinations designed to help you see more of the UAE with less planning.', tours: packageTours }
}

export const tourCategoryPaths = Object.fromEntries(
  Object.entries(tourCategoryPages).map(([slug, page]) => [page.name, `/tours/${slug}`])
)
