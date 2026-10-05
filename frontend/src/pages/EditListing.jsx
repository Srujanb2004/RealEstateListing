import { useNavigate, useParams } from 'react-router-dom'
import PropertyForm from '../components/forms/PropertyForm.jsx'
import Loader from '../components/common/Loader.jsx'
import { useProperty, useUpdateProperty } from '../hooks/useProperties'
import propertyService from '../services/propertyService'

export default function EditListing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useProperty(id)
  const mutation = useUpdateProperty()

  const handleSubmit = (values, files) => {
    mutation.mutate(
      { id, payload: values },
      {
        onSuccess: async () => {
          if (files?.length) {
            try {
              await propertyService.uploadImages(id, files)
            } catch {
              // Non-blocking: update succeeded even if image upload fails.
            }
          }
          navigate('/dashboard/my-listings')
        },
      },
    )
  }

  if (isLoading) return <Loader full label="Loading listing..." />

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit listing</h1>
      <p className="text-sm text-gray-500 mb-6">Update your property details below.</p>
      <div className="card p-6">
        <PropertyForm initialValues={data} onSubmit={handleSubmit} submitting={mutation.isPending} />
      </div>
    </div>
  )
}
