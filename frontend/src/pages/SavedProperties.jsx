import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useFavorites, useToggleFavorite } from '../hooks/useProperties'
import PropertyCard from '../components/property/PropertyCard.jsx'
import Loader from '../components/common/Loader.jsx'

export default function SavedProperties() {
  const { data: favorites, isLoading } = useFavorites()
  const toggle = useToggleFavorite()

  const items = favorites || []

  const handleToggleFavorite = (property) => {
    toggle.mutate({ propertyId: property.id, isSaved: true })
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Properties</h1>

      {isLoading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="card py-16 text-center space-y-4">
          <Heart className="h-10 w-10 text-gray-300 mx-auto" />
          <p className="text-gray-500">You haven't saved any properties yet.</p>
          <Link to="/search" className="btn-primary inline-flex">
            Browse properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              saved
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}
