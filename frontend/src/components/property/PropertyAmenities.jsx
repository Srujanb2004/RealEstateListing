import { CheckCircle2 } from 'lucide-react'

export default function PropertyAmenities({ amenities }) {
  if (!amenities || amenities.length === 0) {
    return <p className="text-sm text-gray-500">No amenities listed</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {amenities.map((amenity) => (
        <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
          <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
          {amenity}
        </div>
      ))}
    </div>
  )
}
