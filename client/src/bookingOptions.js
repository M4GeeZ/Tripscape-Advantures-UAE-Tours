const uniq = (items) => [...new Set(items.filter(Boolean))]

export function getBookingServices(tourTitle = '') {
  const title = String(tourTitle).trim()
  const key = title.toLowerCase()

  if (/e-jet|water go kart/.test(key)) {
    return uniq([
      title,
      '10 Laps Water Go Kart',
      '15 Laps Water Go Kart',
      'Private / Group E-Jet Session',
    ])
  }

  if (/quad bike/.test(key)) {
    return uniq([
      title,
      'Single Quad Bike',
      'Double Quad Bike',
      'Quad Bike + Desert Safari',
      'Quad Bike + Dinner',
    ])
  }

  if (/buggy|can-am/.test(key)) {
    return uniq([
      title,
      '1 Hour Dune Buggy',
      'Dune Buggy + Desert Safari',
      'Dune Buggy + Dinner',
      'Private Buggy Experience',
    ])
  }

  if (/desert|safari|camel|falcon|bedouin|caravanserai|fortress/.test(key)) {
    return uniq([
      title,
      'Standard Desert Safari',
      'Desert Safari with BBQ Dinner',
      'VIP Desert Safari with Private Seating',
      'Private Desert Safari',
      'Desert Safari + Quad Bike',
    ])
  }

  if (/city tour|emirates tour|mosque|heritage|abu dhabi|old dubai/.test(key)) {
    return uniq([
      title,
      'Shared City Tour',
      'Private City Tour',
      'City Tour + Attraction Tickets',
      'Private Vehicle City Tour',
    ])
  }

  if (/cruise|dhow/.test(key)) {
    return uniq([
      title,
      'Dhow Cruise with Dinner',
      'Premium / Upper Deck Seating',
      'Cruise + Private Transfer',
    ])
  }

  if (/helicopter|flight|aerial|skyline/.test(key)) {
    return uniq([
      title,
      'Standard Flight Experience',
      'Private Flight Experience',
      'Flight + Hotel Transfer',
    ])
  }

  if (/yacht|jet ski|scuba|water activ/.test(key)) {
    return uniq([
      title,
      'Standard Session',
      'Private Session',
      'Experience + Hotel Transfer',
    ])
  }

  if (/burj|museum|aquarium|frame|aya|village|ski dubai|palm|dolphin|img worlds|warner|ferrari|miracle garden|garden glow|aquaventure|green planet|yas waterworld|lost chambers/.test(key)) {
    return uniq([
      title,
      'Entry Ticket Only',
      'Ticket + Shared Transfer',
      'Ticket + Private Transfer',
    ])
  }

  return uniq([
    title || 'Standard Experience',
    'Standard Experience',
    'Private / Custom Option',
    'Experience + Hotel Transfer',
  ])
}

export function getBookingAddOns(tourTitle = '') {
  const key = String(tourTitle).toLowerCase()
  const common = [
    'Hotel Pickup & Drop-off',
    'Private Transfer',
    'Photo / Video Package',
  ]

  // "Desert Safari with Quad Bike" packages use the standard desert safari add-ons below.
  if (/quad bike/.test(key) && !/desert|safari/.test(key)) {
    return uniq([...common, 'Additional Quad Bike Time', 'Desert Safari Combo', 'BBQ Dinner Upgrade'])
  }

  if (/buggy|can-am/.test(key)) {
    return uniq([...common, 'Additional Buggy Time', 'Desert Safari Combo', 'BBQ Dinner Upgrade'])
  }

  if (/e-jet|water go kart/.test(key)) {
    return uniq([...common, 'Additional Ride Session', 'Group Booking Setup'])
  }

  if (/desert|safari|camel|falcon|bedouin|caravanserai|fortress/.test(key)) {
    return uniq([...common, 'Quad Bike Upgrade', 'VIP Seating', 'BBQ Dinner Upgrade', 'Private Camp Setup'])
  }

  if (/city tour|emirates tour|mosque|heritage|abu dhabi|old dubai/.test(key)) {
    return uniq([...common, 'Private Vehicle Upgrade', 'Attraction Ticket Add-on', 'Extra Tour Hour'])
  }

  if (/cruise|dhow/.test(key)) {
    return uniq([...common, 'Premium / Upper Deck Seating', 'Celebration Setup'])
  }

  if (/helicopter|flight|aerial|skyline/.test(key)) {
    return uniq([...common, 'Private Flight Upgrade'])
  }

  if (/yacht|jet ski|scuba|water activ/.test(key)) {
    return uniq([...common, 'Additional Activity Time', 'Private Session Upgrade'])
  }

  return uniq([...common, 'Private / VIP Upgrade'])
}

/*
  Priced add-ons shown in the booking form (AED, flat price per booking).
  The visitor ticks the extras they want and the form adds them to the total.
  >>> Edit the numbers below to change a price; nothing else needs to change. <<<
*/
const addOn = (name, price) => ({ name, price })

const PRIVATE_SUV = addOn('Private 4×4 SUV Transfer (Exclusive Car)', 280)
const BUGGY_RIDE = addOn('Dune Buggy Ride Upgrade', 600)
const PRIVATE_HOTEL_TRANSFER = addOn('Private Hotel Transfer', 250)
const PHOTO_VIDEO_REEL = addOn('Photo & Video Reel', 190)

export function getPricedAddOns(tourTitle = '') {
  const key = String(tourTitle).toLowerCase()

  if (/quad bike/.test(key) && !/desert|safari/.test(key)) {
    return [PRIVATE_SUV, BUGGY_RIDE, addOn('Extra 30 Min Quad Bike Track Extension', 120), addOn('BBQ Dinner Upgrade', 90)]
  }

  if (/buggy|can-am/.test(key)) {
    return [PRIVATE_SUV, addOn('Extra 30 Min Dune Buggy Ride', 600), addOn('Quad Bike Ride Upgrade (30 Min)', 120), addOn('BBQ Dinner Upgrade', 90)]
  }

  if (/e-jet|water go kart/.test(key)) {
    return [PRIVATE_HOTEL_TRANSFER, addOn('Photo & Video Reel', 150), addOn('Extra Ride Session (10 Laps)', 120)]
  }

  if (/desert|safari|camel|falcon|bedouin|caravanserai|fortress/.test(key)) {
    return [PRIVATE_SUV, BUGGY_RIDE, addOn('Quad Bike Ride Upgrade (30 Min)', 120), addOn('VIP Seating Upgrade', 150)]
  }

  if (/city tour|emirates tour|mosque|heritage|abu dhabi|old dubai/.test(key)) {
    return [addOn('Private Vehicle Upgrade', 300), addOn('Professional Photographer (2 Hours)', 200), addOn('Extra Tour Hour', 100)]
  }

  if (/cruise|dhow/.test(key)) {
    return [addOn('Premium / Upper Deck Seating', 60), addOn('Celebration Setup (Cake & Decoration)', 200), PRIVATE_HOTEL_TRANSFER]
  }

  if (/helicopter|flight|aerial|skyline|iconic tour|palm tour|vision tour/.test(key)) {
    return [PRIVATE_HOTEL_TRANSFER, PHOTO_VIDEO_REEL, addOn('Celebration Setup (Flowers & Cake)', 200)]
  }

  if (/yacht|jet ski|scuba|water activ/.test(key)) {
    return [addOn('Extra Activity Time (15 Min)', 100), addOn('Photo & Video Reel', 150), PRIVATE_HOTEL_TRANSFER]
  }

  if (/burj|museum|aquarium|frame|aya|village|ski dubai|palm|dolphin|img worlds|warner|ferrari|miracle garden|garden glow|aquaventure|green planet|yas waterworld|lost chambers/.test(key)) {
    return [PRIVATE_HOTEL_TRANSFER, addOn('Photographer Add-on', 150), addOn('Guided Assistance Add-on', 120)]
  }

  return [PRIVATE_HOTEL_TRANSFER, PHOTO_VIDEO_REEL, addOn('Private / VIP Upgrade', 300)]
}
