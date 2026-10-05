export function formatPrice(value, listingType = 'Buy') {
  if (value == null) return '—'
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
  return listingType === 'Rent' ? `${formatted}/mo` : formatted
}

export function formatArea(sqft) {
  if (sqft == null) return '—'
  return `${new Intl.NumberFormat('en-IN').format(sqft)} sqft`
}

export function timeAgo(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const units = [
    ['year', 31536000], ['month', 2592000], ['week', 604800],
    ['day', 86400], ['hour', 3600], ['minute', 60],
  ]
  for (const [label, secs] of units) {
    const value = Math.floor(seconds / secs)
    if (value >= 1) return `${value} ${label}${value > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ')
}

// Inline SVG so listings without images degrade to a real placeholder instead
// of a broken-image icon — no external host to depend on.
export const NO_IMAGE_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="60" viewBox="0 0 80 60">
      <rect width="80" height="60" fill="#f1f5f9"/>
      <path d="M20 38l9-11 7 8 5-6 9 9z" fill="#cbd5e1"/>
      <circle cx="28" cy="22" r="4" fill="#cbd5e1"/>
    </svg>`,
  )

export function buildQueryString(params) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      if (value.length) search.set(key, value.join(','))
    } else {
      search.set(key, value)
    }
  })
  return search.toString()
}
