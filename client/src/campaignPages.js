import { tourCatalog } from './data'

const findTour = (title) => tourCatalog.find((tour) => tour.title === title)
const pickTours = (titles) => titles.map(findTour).filter(Boolean)

export const campaignPages = {
  'evening-desert-safari': {
    slug: 'evening-desert-safari',
    eyebrow: 'EVENING DESERT SAFARI DUBAI',
    title: 'Evening Desert Safari Dubai',
    heroCopy: 'Dune bashing, camel riding, BBQ dinner and live desert entertainment in one easy evening experience.',
    heroImage: '/images/top-experiences/evening-desert-safari-bbq-dinner.png',
    seoTitle: 'Evening Desert Safari Dubai | BBQ Dinner & Live Shows',
    seoDescription: 'Book an evening desert safari in Dubai with dune bashing, camel ride, BBQ dinner and live entertainment. Compare a few selected packages and book direct by WhatsApp.',
    packageTitles: [
      'Evening Desert Safari with BBQ Dinner',
      'VIP Premium Desert Safari with BBQ Dinner',
      'Desert Safari with Dinner at Caravanserai'
    ],
    sectionTitle: 'Choose your evening desert safari package',
    sectionCopy: 'Only the most relevant evening packages for this campaign are shown below.',
    highlights: [
      '4×4 desert pickup options',
      'Dune bashing and sunset photo stops',
      'Camel ride and camp activities',
      'BBQ dinner on selected packages',
      'Live evening entertainment',
      'Direct WhatsApp booking support'
    ],
    included: [
      'Hotel pickup by 4×4 on selected packages',
      'Dune bashing and desert photo stop',
      'Camel ride',
      'Desert camp access',
      'BBQ buffet dinner where stated',
      'Soft drinks and water',
      'Live cultural entertainment where included'
    ],
    excluded: [
      'Personal purchases and souvenirs',
      'Alcoholic beverages unless stated',
      'Optional upgrades not selected',
      'Gratuities',
      'Anything not listed in the confirmed package'
    ],
    knowBefore: [
      'Wear comfortable clothes and closed shoes.',
      'Pickup time depends on season and hotel location.',
      'Share child ages before booking if dune bashing is required.',
      'Exact entertainment schedule can vary by operating date.'
    ],
    faqs: [
      ['What is included in an evening desert safari?', 'The exact inclusions depend on the selected package. Typical options include 4×4 pickup, dune bashing, camel riding, camp access, dinner and live entertainment.'],
      ['What time is pickup?', 'Pickup windows vary by season, traffic and location. Your exact time is confirmed before the tour.'],
      ['Is the evening safari suitable for families?', 'Many evening safari packages are family friendly. Share child ages before booking so the team can confirm the right option.'],
      ['Can I choose VIP seating?', 'Yes. Select a VIP or premium package if you want upgraded seating or service.'],
      ['How do I book?', 'Choose a package and complete the booking form. Your request opens directly in WhatsApp for confirmation.']
    ]
  },
  'quad-bike': {
    slug: 'quad-bike',
    eyebrow: 'QUAD BIKE DUBAI',
    title: 'Dubai Quad Bike Experience',
    heroCopy: 'Choose a focused quad-bike package with safety support, desert riding and optional safari or dinner combinations.',
    heroImage: '/images/adv-double.webp',
    seoTitle: 'Quad Bike Dubai | Desert Quad Bike Packages',
    seoDescription: 'Book a quad bike in Dubai with selected morning, evening and single or double rider packages. Booking form, WhatsApp and call support available.',
    packageTitles: [
      'Single and Double Quad Bike',
      'Evening Quad Bike with Dinner',
      'Morning Desert Safari with Quad Bike'
    ],
    sectionTitle: 'Choose your quad bike package',
    sectionCopy: 'Three focused quad-bike options are shown so ad visitors can compare quickly and book.',
    highlights: [
      'Safety briefing before riding',
      'Helmet and required safety equipment',
      'Guided or supported desert riding',
      'Single and double options',
      'Safari and dinner combinations available',
      'WhatsApp support before arrival'
    ],
    included: [
      'Safety briefing',
      'Helmet and required safety gear',
      'Selected quad-bike riding duration',
      'Professional activity support',
      'Desert photo opportunities',
      'Pickup on selected packages',
      'Dinner on selected evening packages'
    ],
    excluded: [
      'Extra riding time beyond the package',
      'Vehicle upgrades not selected',
      'Personal photo or video packages',
      'Meals unless stated in the selected package',
      'Personal expenses and gratuities'
    ],
    knowBefore: [
      'Closed shoes and comfortable clothing are recommended.',
      'Rider age requirements vary by quad type and package.',
      'Follow the activity marshal and safety briefing at all times.',
      'Confirm pickup before booking if your package includes transfers.'
    ],
    faqs: [
      ['Do I need previous quad-bike experience?', 'No previous experience is normally required for standard sessions. A safety briefing is provided before riding.'],
      ['Are helmets included?', 'Required safety equipment is provided as part of the selected riding package unless your confirmation states otherwise.'],
      ['Can I book a quad bike with desert safari?', 'Yes. The morning safari and evening dinner combinations are included among the selected campaign packages.'],
      ['What age can ride?', 'Age and rider requirements vary by vehicle and operator. Share the rider age before booking.'],
      ['How do I confirm availability?', 'Use the booking form, WhatsApp button or call option on this page.']
    ]
  },
  'dune-buggy': {
    slug: 'dune-buggy',
    eyebrow: 'DUNE BUGGY DUBAI',
    title: 'Dubai Dune Buggy Ride',
    heroCopy: 'A focused selection of dune buggy and CAN-AM experiences for riders who want a high-adrenaline desert session.',
    heroImage: '/images/adv-buggy.webp',
    seoTitle: 'Dune Buggy Dubai | CAN-AM Buggy Tours',
    seoDescription: 'Book a Dubai dune buggy or CAN-AM tour. Compare selected one-hour and dinner packages with direct booking, WhatsApp and call options.',
    packageTitles: [
      'CAN-AM Buggy Tour – 1 Hour',
      'Evening Buggy Tour with Dinner',
      'CAN-AM Buggy Tour with Dinner'
    ],
    sectionTitle: 'Choose your dune buggy package',
    sectionCopy: 'Only three campaign-relevant buggy packages are shown for faster comparison.',
    highlights: [
      'Powerful CAN-AM and buggy options',
      'Pre-drive safety briefing',
      'Helmet and required safety equipment',
      'Professional desert activity support',
      'One-hour and evening options',
      'Dinner packages available'
    ],
    included: [
      'Pre-drive safety briefing',
      'Helmet and required safety equipment',
      'Selected buggy session',
      'Professional activity guide',
      'Desert route and photo stops',
      'Water and refreshments',
      'Dinner on selected packages'
    ],
    excluded: [
      'Damage caused by unsafe or negligent driving',
      'Extra buggy time or upgrades not selected',
      'Personal photography packages',
      'Meals unless included in the selected package',
      'Personal expenses and gratuities'
    ],
    knowBefore: [
      'Driver age and licence rules depend on the selected buggy.',
      'Closed shoes and comfortable desert clothing are recommended.',
      'Guests must follow the guide and designated desert route.',
      'Arrive on time for check-in and the mandatory safety briefing.'
    ],
    faqs: [
      ['Do I need a driving licence?', 'Requirements depend on the selected buggy and operator. Confirm driver age and licence rules before booking.'],
      ['Is dune buggy driving suitable for beginners?', 'Many packages are suitable for first-time drivers after the safety briefing, subject to package requirements.'],
      ['What safety equipment is provided?', 'The required helmet and safety equipment for the selected package are provided.'],
      ['Can I book a buggy tour with dinner?', 'Yes. Two of the selected campaign packages include a dinner option.'],
      ['How do I book?', 'Complete the form and send the request on WhatsApp, or call the booking team directly.']
    ]
  },
  'private-desert-setup': {
    slug: 'private-desert-setup',
    eyebrow: 'PRIVATE DESERT SAFARI DUBAI',
    title: 'Private Desert Safari & VIP Setup',
    heroCopy: 'Premium desert experiences for couples, families and private groups with upgraded transport, seating and service options.',
    heroImage: '/images/top-experiences/vip-desert-safari-private-seating.png',
    seoTitle: 'Private Desert Safari Dubai | VIP Desert Setup',
    seoDescription: 'Book a private desert safari in Dubai with VIP seating, private vehicle options and premium dinner experiences. Direct booking, WhatsApp and call support.',
    packageTitles: [
      'Desert Safari with VIP Setup',
      'VIP Desert Safari with Private Seating',
      'Private Desert Safari with Sahara Fortress Dinner'
    ],
    sectionTitle: 'Choose your private desert package',
    sectionCopy: 'A small selection of premium packages specifically suited to the private-desert campaign.',
    highlights: [
      'Private or premium transfer options',
      'Reserved VIP or private seating',
      'Dune bashing and sunset stops',
      'Premium dinner options',
      'Dedicated guest service',
      'Suitable for couples and private groups'
    ],
    included: [
      'Private or premium transfer on selected packages',
      'Dune bashing and sunset photo stops',
      'Reserved VIP or private seating',
      'Table service on selected packages',
      'Premium BBQ or dinner options',
      'Camel ride and desert activities',
      'Live entertainment where included'
    ],
    excluded: [
      'Custom decorations unless confirmed',
      'Premium upgrades not listed in the package',
      'Alcoholic beverages unless stated',
      'Personal expenses and gratuities',
      'Anything not included in the final confirmation'
    ],
    knowBefore: [
      'Private transfer is included only when stated in the selected package.',
      'Share your group size and occasion before booking.',
      'Custom celebration arrangements are subject to availability.',
      'Confirm the latest setup, dinner and seating details before payment.'
    ],
    faqs: [
      ['What is the difference between VIP and private safari?', 'VIP packages usually upgrade camp seating and service, while private packages may also include a private vehicle or more exclusive arrangements.'],
      ['Can I book for a couple?', 'Yes. Private desert experiences can be suitable for couples, subject to the selected package and availability.'],
      ['Is hotel pickup private?', 'Private pickup applies only when the package specifically states private transfer or private vehicle.'],
      ['Can you arrange a celebration?', 'Custom requests may be possible. Share your date, group size and requirements through the booking form.'],
      ['How do I get a final quote?', 'Submit the form or contact the team by WhatsApp to confirm the selected setup and latest rate.']
    ]
  }
}

Object.values(campaignPages).forEach((page) => {
  page.tours = pickTours(page.packageTitles)
})

export function getCampaignPage(slug) {
  if (slug === 'desert-safari') return campaignPages['evening-desert-safari']
  return campaignPages[slug]
}
