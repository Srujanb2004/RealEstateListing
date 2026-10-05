export const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Plot', 'Studio', 'Commercial']

export const LISTING_TYPES = ['Buy', 'Rent']

export const AMENITIES = [
  'Parking', 'Swimming Pool', 'Gym', 'Lift', 'Power Backup', 'Security',
  'Garden', 'Club House', 'Pet Friendly', 'Furnished', 'Air Conditioning', 'Balcony',
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'area_desc', label: 'Area: Largest first' },
]

export const PROPERTY_STATUS = ['Draft', 'Active', 'Unpublished', 'Sold', 'Rented']

// Common alternate/colloquial names for cities in our mock data, so a search for
// "Bangalore" still matches listings stored under the official name "Bengaluru".
export const CITY_ALIASES = {
  bangalore: 'bengaluru',
  bengaluru: 'bengaluru',
  bombay: 'mumbai',
  mumbai: 'mumbai',
  hyderabad: 'hyderabad',
  secunderabad: 'hyderabad',
  poona: 'pune',
  pune: 'pune',
  chennai: 'chennai',
  madras: 'chennai',
  delhi: 'delhi ncr',
  'new delhi': 'delhi ncr',
  gurgaon: 'delhi ncr',
  gurugram: 'delhi ncr',
  noida: 'delhi ncr',
  'delhi ncr': 'delhi ncr',
}

export function normalizeCity(value) {
  const key = String(value || '').trim().toLowerCase()
  return CITY_ALIASES[key] || key
}
