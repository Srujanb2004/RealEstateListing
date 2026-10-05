import { useNavigate } from 'react-router-dom'
import PropertyForm from '../components/forms/PropertyForm.jsx'
import { useCreateProperty } from '../hooks/useProperties'
import propertyService from '../services/propertyService'

export default function CreateListing() {
  const navigate = useNavigate()
  const mutation = useCreateProperty()

  const handleSubmit = (values, files) => {
    mutation.mutate(
      { ...values, images: [] },
      {
        onSuccess: async (created) => {
          if (files?.length) {
            try {
              await propertyService.uploadImages(created.id, files)
            } catch {
              // Non-blocking: listing was created even if image upload fails.
            }
          }
          navigate('/dashboard/my-listings')
        },
      },
    )
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create a new listing</h1>
      <p className="text-sm text-gray-500 mb-6">Fill in the details below to publish your property.</p>
      <div className="card p-6">
        <PropertyForm onSubmit={handleSubmit} submitting={mutation.isPending} />
      </div>
    </div>
  )
}
