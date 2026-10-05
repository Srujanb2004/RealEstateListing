import { classNames } from '../../utils/helpers'
import { PROPERTY_TYPES, AMENITIES } from '../../utils/constants'

const BEDROOM_OPTIONS = [1, 2, 3, 4]

export default function PropertyFilters({ filters = {}, onChange }) {
  const { property_type, min_price, max_price, bedrooms, amenities = [] } = filters

  const handleTypeClick = (type) => {
    onChange({ property_type: property_type === type ? undefined : type })
  }

  const handleBedroomClick = (value) => {
    onChange({ bedrooms: bedrooms === value ? undefined : value })
  }

  const handleAmenityToggle = (amenity) => {
    const next = amenities.includes(amenity)
      ? amenities.filter((a) => a !== amenity)
      : [...amenities, amenity]
    onChange({ amenities: next })
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Property Type</h4>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeClick(type)}
              className={classNames(
                'px-3 py-1.5 rounded-lg text-sm border transition-colors',
                property_type === type
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            className="input"
            value={min_price ?? ''}
            onChange={(e) => onChange({ min_price: e.target.value ? Number(e.target.value) : undefined })}
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            className="input"
            value={max_price ?? ''}
            onChange={(e) => onChange({ max_price: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Bedrooms</h4>
        <div className="flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleBedroomClick(value)}
              className={classNames(
                'px-3 py-1.5 rounded-lg text-sm border transition-colors',
                bedrooms === value
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
              )}
            >
              {value}+
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Amenities</h4>
        <div className="space-y-2">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                checked={amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
