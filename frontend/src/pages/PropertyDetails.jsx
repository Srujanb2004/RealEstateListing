import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { BedDouble, Bath, Ruler, MapPin, Heart, MessageCircle } from 'lucide-react'
import { useProperty, useFavorites, useToggleFavorite } from '../hooks/useProperties'
import { formatPrice, formatArea, classNames } from '../utils/helpers'
import inquiryService from '../services/inquiryService'
import PropertyGallery from '../components/property/PropertyGallery.jsx'
import PropertyAmenities from '../components/property/PropertyAmenities.jsx'
import Loader from '../components/common/Loader.jsx'
import Modal from '../components/common/Modal.jsx'
import Button from '../components/common/Button.jsx'

const EMPTY_FORM = { name: '', email: '', phone: '', message: '' }

export default function PropertyDetails() {
  const { id } = useParams()
  const { data, isLoading } = useProperty(id)
  const { data: favorites } = useFavorites()
  const toggle = useToggleFavorite()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (isLoading) return <Loader full />

  if (!data) {
    return (
      <div className="container-page py-16 text-center text-gray-500">
        Property not found.
      </div>
    )
  }

  const savedIds = new Set((favorites || []).map((p) => p.id))
  const isSaved = savedIds.has(data.id)

  const handleToggleFavorite = () => {
    toggle.mutate({ propertyId: data.id, isSaved })
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(EMPTY_FORM)
    setSubmitted(false)
  }

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await inquiryService.create(data.id, form)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page py-8">
      <PropertyGallery images={data.images} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{data.title}</h1>
            <p className="mt-2 text-2xl font-semibold text-brand-600">
              {formatPrice(data.price, data.listing_type)}
            </p>
            <p className="mt-2 flex items-center gap-1 text-gray-500">
              <MapPin className="h-4 w-4" />
              {data.locality ? `${data.locality}, ` : ''}
              {data.city}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-6 text-gray-700">
              <span className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-brand-600" /> {data.bedrooms} Beds
              </span>
              <span className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-brand-600" /> {data.bathrooms} Baths
              </span>
              <span className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-brand-600" /> {formatArea(data.area_sqft)}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{data.description}</p>
          </div>

          <PropertyAmenities amenities={data.amenities} />

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>
            <p className="text-gray-600 mb-4">
              {data.address ? `${data.address}, ` : ''}
              {data.locality ? `${data.locality}, ` : ''}
              {data.city}
              {data.pincode ? ` - ${data.pincode}` : ''}
            </p>
            <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center text-gray-400">
              Map view coming soon
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-24 space-y-3">
            <Button
              variant={isSaved ? 'secondary' : 'primary'}
              className="w-full justify-center"
              onClick={handleToggleFavorite}
            >
              <Heart className={classNames('h-4 w-4', isSaved && 'fill-current')} />
              {isSaved ? 'Saved' : 'Save Property'}
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-center"
              onClick={() => setModalOpen(true)}
            >
              <MessageCircle className="h-4 w-4" /> Contact Seller
            </Button>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={closeModal} title="Contact Seller">
        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <p className="text-green-600 font-medium">
              Your inquiry has been sent! The seller will get back to you soon.
            </p>
            <Button onClick={closeModal}>Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                required
                className="input"
                value={form.name}
                onChange={handleFieldChange('name')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="input"
                value={form.email}
                onChange={handleFieldChange('email')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                className="input"
                value={form.phone}
                onChange={handleFieldChange('phone')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                className="input"
                value={form.message}
                onChange={handleFieldChange('message')}
                placeholder={`Hi, I'm interested in "${data.title}". Please share more details.`}
              />
            </div>
            <Button type="submit" loading={submitting} className="w-full justify-center">
              Send Inquiry
            </Button>
          </form>
        )}
      </Modal>
    </div>
  )
}
