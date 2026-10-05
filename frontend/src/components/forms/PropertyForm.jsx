import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, ImagePlus, X } from 'lucide-react'
import Button from '../common/Button.jsx'
import { PROPERTY_TYPES, LISTING_TYPES } from '../../utils/constants'
import { formatPrice, formatArea, classNames } from '../../utils/helpers'

const optionalNumber = z.preprocess(
  (v) => (v === '' || v === undefined || v === null ? undefined : v),
  z.coerce.number().optional(),
)

const propertySchema = z.object({
  property_type: z.string().min(1, 'Select a property type'),
  listing_type: z.enum(['Buy', 'Rent'], { errorMap: () => ({ message: 'Select Buy or Rent' }) }),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description should be at least 10 characters'),
  bedrooms: z.number({ invalid_type_error: 'Enter number of bedrooms' }).min(0, 'Must be 0 or more'),
  bathrooms: z.number({ invalid_type_error: 'Enter number of bathrooms' }).min(0, 'Must be 0 or more'),
  area_sqft: z.number({ invalid_type_error: 'Enter area in sqft' }).min(1, 'Enter a valid area'),
  price: z.number({ invalid_type_error: 'Enter a price' }).min(1, 'Enter a valid price'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  locality: z.string().min(1, 'Locality is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  latitude: optionalNumber,
  longitude: optionalNumber,
})

const STEPS = [
  { label: 'Basic Info', fields: ['property_type', 'listing_type', 'title', 'description', 'bedrooms', 'bathrooms', 'area_sqft', 'price'] },
  { label: 'Location', fields: ['address', 'city', 'locality', 'pincode', 'latitude', 'longitude'] },
  { label: 'Images', fields: [] },
  { label: 'Preview', fields: [] },
]

export default function PropertyForm({ initialValues, onSubmit, submitting = false }) {
  const [step, setStep] = useState(0)
  const [imageFiles, setImageFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const existingImages = initialValues?.images || []

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      property_type: initialValues?.property_type || '',
      listing_type: initialValues?.listing_type || 'Buy',
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      bedrooms: initialValues?.bedrooms ?? '',
      bathrooms: initialValues?.bathrooms ?? '',
      area_sqft: initialValues?.area_sqft ?? '',
      price: initialValues?.price ?? '',
      address: initialValues?.address || '',
      city: initialValues?.city || '',
      locality: initialValues?.locality || '',
      pincode: initialValues?.pincode || '',
      latitude: initialValues?.latitude ?? '',
      longitude: initialValues?.longitude ?? '',
    },
  })

  const values = watch()

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const nextFiles = [...imageFiles, ...files]
    const nextPreviews = [
      ...previews,
      ...files.map((file) => ({ url: URL.createObjectURL(file), name: file.name })),
    ]
    setImageFiles(nextFiles)
    setPreviews(nextPreviews)
    e.target.value = ''
  }

  const removePreview = (index) => {
    URL.revokeObjectURL(previews[index].url)
    setImageFiles(imageFiles.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const goNext = async () => {
    const fields = STEPS[step].fields
    const valid = fields.length ? await trigger(fields) : true
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  const finalSubmit = (data) => {
    onSubmit(data, imageFiles)
  }

  return (
    <div>
      <ol className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <li key={s.label} className="flex-1 flex items-center">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={classNames(
                  'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2',
                  i < step
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : i === step
                      ? 'border-brand-600 text-brand-600'
                      : 'border-gray-300 text-gray-400',
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={classNames('text-xs font-medium', i === step ? 'text-brand-700' : 'text-gray-400')}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={classNames('h-0.5 flex-1 -mt-5', i < step ? 'bg-brand-600' : 'bg-gray-200')} />
            )}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(finalSubmit)} noValidate className="space-y-6">
        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Property type
                </label>
                <select id="property_type" className="input" {...register('property_type')}>
                  <option value="">Select type</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.property_type && <p className="text-sm text-red-600 mt-1">{errors.property_type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing type</label>
                <div className="grid grid-cols-2 gap-3">
                  {LISTING_TYPES.map((lt) => (
                    <label
                      key={lt}
                      className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
                    >
                      <input type="radio" value={lt} className="text-brand-600" {...register('listing_type')} />
                      {lt}
                    </label>
                  ))}
                </div>
                {errors.listing_type && <p className="text-sm text-red-600 mt-1">{errors.listing_type.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input id="title" type="text" className="input" {...register('title')} />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" rows={4} className="input" {...register('description')} />
              {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input id="bedrooms" type="number" min="0" className="input" {...register('bedrooms', { valueAsNumber: true })} />
                {errors.bedrooms && <p className="text-sm text-red-600 mt-1">{errors.bedrooms.message}</p>}
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input id="bathrooms" type="number" min="0" className="input" {...register('bathrooms', { valueAsNumber: true })} />
                {errors.bathrooms && <p className="text-sm text-red-600 mt-1">{errors.bathrooms.message}</p>}
              </div>
              <div>
                <label htmlFor="area_sqft" className="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
                <input id="area_sqft" type="number" min="0" className="input" {...register('area_sqft', { valueAsNumber: true })} />
                {errors.area_sqft && <p className="text-sm text-red-600 mt-1">{errors.area_sqft.message}</p>}
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input id="price" type="number" min="0" className="input" {...register('price', { valueAsNumber: true })} />
                {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input id="address" type="text" className="input" {...register('address')} />
              {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input id="city" type="text" className="input" {...register('city')} />
                {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
                <input id="locality" type="text" className="input" {...register('locality')} />
                {errors.locality && <p className="text-sm text-red-600 mt-1">{errors.locality.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input id="pincode" type="text" className="input" {...register('pincode')} />
                {errors.pincode && <p className="text-sm text-red-600 mt-1">{errors.pincode.message}</p>}
              </div>
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">Latitude (optional)</label>
                <input id="latitude" type="number" step="any" className="input" {...register('latitude')} />
                {errors.latitude && <p className="text-sm text-red-600 mt-1">{errors.latitude.message}</p>}
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">Longitude (optional)</label>
                <input id="longitude" type="number" step="any" className="input" {...register('longitude')} />
                {errors.longitude && <p className="text-sm text-red-600 mt-1">{errors.longitude.message}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
              Property images
            </label>
            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500 cursor-pointer hover:border-brand-400 hover:text-brand-600"
            >
              <ImagePlus className="h-6 w-6" />
              Click to select images
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {existingImages.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Current images</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {existingImages.map((url, i) => (
                    <img key={i} src={url} alt="" className="h-24 w-full object-cover rounded-lg border border-gray-200" />
                  ))}
                </div>
              </div>
            )}

            {previews.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">New images to upload</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {previews.map((p, i) => (
                    <div key={p.url} className="relative group">
                      <img src={p.url} alt={p.name} className="h-24 w-full object-cover rounded-lg border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => removePreview(i)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="card p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{values.title || 'Untitled listing'}</h3>
              <p className="text-sm text-gray-500">{values.property_type} · {values.listing_type}</p>
            </div>
            <p className="text-sm text-gray-600">{values.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><span className="text-gray-400">Bedrooms</span><p className="font-medium">{values.bedrooms || '—'}</p></div>
              <div><span className="text-gray-400">Bathrooms</span><p className="font-medium">{values.bathrooms || '—'}</p></div>
              <div><span className="text-gray-400">Area</span><p className="font-medium">{formatArea(values.area_sqft)}</p></div>
              <div><span className="text-gray-400">Price</span><p className="font-medium">{formatPrice(values.price, values.listing_type)}</p></div>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Location</span>
              <p className="font-medium">
                {[values.address, values.locality, values.city, values.pincode].filter(Boolean).join(', ')}
              </p>
            </div>
            {(previews.length > 0 || existingImages.length > 0) && (
              <div>
                <span className="text-sm text-gray-400">Images</span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                  {existingImages.map((url, i) => (
                    <img key={`e-${i}`} src={url} alt="" className="h-16 w-full object-cover rounded-md border border-gray-200" />
                  ))}
                  {previews.map((p) => (
                    <img key={p.url} src={p.url} alt={p.name} className="h-16 w-full object-cover rounded-md border border-gray-200" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={goBack} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext}>Next</Button>
          ) : (
            // type="button" + explicit handleSubmit, never type="submit". On the
            // Images step goNext has no fields to await, so setStep runs inside
            // the click handler; React flushes it synchronously and a
            // type="submit" button here would inherit that same click's default
            // action, submitting the form and skipping Preview entirely.
            <Button type="button" onClick={handleSubmit(finalSubmit)} loading={submitting}>
              Submit listing
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
