import { useNavigate } from 'react-router-dom'
import { buildQueryString } from '../utils/helpers'
import { useProperties, useFavorites, useToggleFavorite } from '../hooks/useProperties'
import { POPULAR_LOCATIONS } from '../utils/mockData'
import SearchBar from '../components/search/SearchBar.jsx'
import PropertyCard from '../components/property/PropertyCard.jsx'
import Loader from '../components/common/Loader.jsx'

export default function Home() {
  const navigate = useNavigate()
  const { data, isLoading } = useProperties({})
  const { data: favorites } = useFavorites()
  const toggle = useToggleFavorite()

  const savedIds = new Set((favorites || []).map((p) => p.id))
  const featured = (data?.items || []).slice(0, 6)

  const handleSearch = (values) => {
    navigate({ pathname: '/search', search: buildQueryString(values) })
  }

  const handleToggleFavorite = (property) => {
    toggle.mutate({ propertyId: property.id, isSaved: savedIds.has(property.id) })
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-600 to-brand-700 text-white py-16">
        <div className="container-page">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
            Find your perfect home
          </h1>
          <p className="mt-4 text-center text-brand-100 text-base sm:text-lg max-w-2xl mx-auto">
            Search thousands of properties for sale and rent across India's top cities.
          </p>
          <div className="mt-8">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <div className="container-page py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Properties</h2>
        {isLoading ? (
          <Loader />
        ) : featured.length === 0 ? (
          <p className="text-gray-500">No properties available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property) => (
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

      <div className="container-page py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Locations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_LOCATIONS.map((location) => (
            <button
              key={location.city}
              onClick={() => navigate(`/search?city=${encodeURIComponent(location.city)}`)}
              className="relative h-32 rounded-xl overflow-hidden group shadow-sm border border-gray-200 text-left"
            >
              <img
                src={location.image}
                alt={location.city}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="relative h-full flex flex-col justify-end p-3 text-white">
                <span className="font-semibold">{location.city}</span>
                <span className="text-xs text-gray-200">{location.count} properties</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
