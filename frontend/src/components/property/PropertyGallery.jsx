import { useState } from 'react'
import { classNames } from '../../utils/helpers'

export default function PropertyGallery({ images }) {
  const list = images && images.length ? images : []
  const [active, setActive] = useState(0)

  if (!list.length) {
    return (
      <div className="w-full aspect-video rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
        No images available
      </div>
    )
  }

  return (
    <div>
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
        <img
          src={list[active]}
          alt={`Property image ${active + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={classNames(
                'shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-colors',
                i === active ? 'border-brand-600 ring-2 ring-brand-500' : 'border-transparent',
              )}
            >
              <img src={src} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
