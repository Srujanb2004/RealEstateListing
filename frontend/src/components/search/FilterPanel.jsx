import PropertyFilters from '../property/PropertyFilters.jsx'

export default function FilterPanel({ filters, onChange }) {
  const handleReset = () => {
    onChange({
      property_type: undefined,
      min_price: undefined,
      max_price: undefined,
      bedrooms: undefined,
      amenities: [],
    })
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          Reset
        </button>
      </div>

      <PropertyFilters filters={filters} onChange={onChange} />
    </div>
  )
}
