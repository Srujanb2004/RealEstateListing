import { Link } from 'react-router-dom'
import { Heart, MapPin, BedDouble, Bath, Ruler } from 'lucide-react'
import { formatPrice, formatArea, timeAgo } from '../../utils/helpers'

export default function PropertyCard({ property, saved = false, onToggleFavorite }) {
  const image = property.images?.[0]

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.(property)
  }

  return (
    <div className="card overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative">
        <Link to={`/property/${property.id}`} className="block">
          {image ? (
            <img
              src={image}
              alt={property.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
          ) : (
            <div className="w-full h-48 rounded-t-xl bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={saved ? 'Remove from saved' : 'Save property'}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <Heart className={saved ? 'h-4 w-4 text-red-600' : 'h-4 w-4'} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <Link to={`/property/${property.id}`} className="block p-4">
        <p className="text-lg font-bold text-brand-700">{formatPrice(property.price, property.listing_type)}</p>
        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1">{property.title}</h3>

        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {property.locality}, {property.city}
        </p>

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" /> {property.bedrooms} bd
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" /> {property.bathrooms} ba
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="h-4 w-4" /> {formatArea(property.area_sqft)}
          </span>
        </div>

        <p className="mt-2 text-xs text-gray-400">{timeAgo(property.created_at)}</p>
      </Link>
    </div>
  )
}
