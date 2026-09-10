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

  if (/quad bike/.test(key)) {
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
