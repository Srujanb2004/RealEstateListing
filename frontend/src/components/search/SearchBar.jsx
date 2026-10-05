import { useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import { PROPERTY_TYPES } from '../../utils/constants'

const BUDGET_OPTIONS = [
  { label: 'Any budget', value: '' },
  { label: 'Under ₹20L', value: '2000000' },
  { label: '₹20L – 50L', value: '5000000' },
  { label: '₹50L – 1Cr', value: '10000000' },
  { label: 'Above ₹1Cr', value: '' },
]

export default function SearchBar({ onSearch }) {
  const [city, setCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [listingType, setListingType] = useState('Buy')
  const [budgetIndex, setBudgetIndex] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    const budget = BUDGET_OPTIONS[budgetIndex]
    onSearch?.({
      city: city || undefined,
      property_type: propertyType || undefined,
      listing_type: listingType,
      max_price: budget?.value ? Number(budget.value) : undefined,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 flex flex-wrap items-stretch gap-3"
    >
      <div className="flex bg-gray-100 rounded-lg p-1 shrink-0">
        {['Buy', 'Rent'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setListingType(type)}
            className={
              listingType === type
                ? 'px-4 py-2 rounded-md text-sm font-semibold bg-brand-600 text-white transition-colors'
                : 'px-4 py-2 rounded-md text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors'
            }
          >
            {type}
          </button>
        ))}
      </div>

      <div className="relative flex-1 min-w-[180px]">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City or locality"
          className="input pl-9"
        />
      </div>

      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        className="input flex-1 min-w-[140px]"
      >
        <option value="">Any type</option>
        {PROPERTY_TYPES.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <select
        value={budgetIndex}
        onChange={(e) => setBudgetIndex(Number(e.target.value))}
        className="input flex-1 min-w-[140px]"
      >
        {BUDGET_OPTIONS.map((option, i) => (
          <option key={option.label} value={i}>{option.label}</option>
        ))}
      </select>

      <button type="submit" className="btn-primary px-6 shrink-0">
        <Search className="h-4 w-4" /> Search
      </button>
    </form>
  )
}
