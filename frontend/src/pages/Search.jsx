import { useSearchParams } from 'react-router-dom'
import { useProperties, useFavorites, useToggleFavorite } from '../hooks/useProperties'
import PropertyCard from '../components/property/PropertyCard.jsx'
import FilterPanel from '../components/search/FilterPanel.jsx'
import SortDropdown from '../components/search/SortDropdown.jsx'
import Loader from '../components/common/Loader.jsx'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  const rawParams = Object.fromEntries(searchParams.entries())
  const filtersObj = {
    city: rawParams.city || '',
    listing_type: rawParams.listing_type || '',
    property_type: rawParams.property_type || '',
    min_price: rawParams.min_price || '',
    max_price: rawParams.max_price || '',
    bedrooms: rawParams.bedrooms || '',
    amenities: rawParams.amenities ? rawParams.amenities.split(',') : [],
    sort: rawParams.sort || 'newest',
  }

  const { data, isLoading } = useProperties(filtersObj)
  const { data: favorites } = useFavorites()
  const toggle = useToggleFavorite()

  const savedIds = new Set((favorites || []).map((p) => p.id))
  const items = data?.items || []

  const handleFilterChange = (partial) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(partial).forEach(([key, value]) => {
        const isEmpty =
          value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
        if (isEmpty) {
          next.delete(key)
        } else if (Array.isArray(value)) {
          next.set(key, value.join(','))
        } else {
          next.set(key, value)
        }
      })
      return next
    })
  }

  const handleToggleFavorite = (property) => {
    toggle.mutate({ propertyId: property.id, isSaved: savedIds.has(property.id) })
  }

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-gray-600 text-sm sm:text-base">
          {isLoading ? 'Searching…' : `${items.length} propert${items.length === 1 ? 'y' : 'ies'} found`}
        </p>
        <SortDropdown value={filtersObj.sort} onChange={(sort) => handleFilterChange({ sort })} />
      </div>

      <div className="flex gap-6">
        <aside className="w-72 shrink-0 hidden lg:block">
          <FilterPanel filters={filtersObj} onChange={handleFilterChange} />
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <Loader />
          ) : items.length === 0 ? (
            <div className="card py-16 text-center text-gray-500">
              No properties match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  saved={savedIds.has(property.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
