import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { useMyListings, useDeleteProperty, useUpdateProperty } from '../hooks/useProperties'
import { formatPrice, NO_IMAGE_PLACEHOLDER } from '../utils/helpers'
import Loader from '../components/common/Loader.jsx'
import Modal from '../components/common/Modal.jsx'
import Button from '../components/common/Button.jsx'

function getListingsArray(data) {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.items)) return data.items
  return []
}

const STATUS_STYLES = {
  Active: 'bg-green-100 text-green-700',
  Draft: 'bg-gray-100 text-gray-700',
  Unpublished: 'bg-red-100 text-red-700',
  Sold: 'bg-red-100 text-red-700',
  Rented: 'bg-red-100 text-red-700',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  )
}

export default function MyListings() {
  const { data, isLoading } = useMyListings()
  const deleteProperty = useDeleteProperty()
  const updateProperty = useUpdateProperty()
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  const listings = getListingsArray(data)

  const handleTogglePublish = (property) => {
    const nextStatus = property.status === 'Active' ? 'Unpublished' : 'Active'
    updateProperty.mutate({ id: property.id, payload: { status: nextStatus } })
  }

  const confirmDelete = () => {
    if (pendingDeleteId != null) {
      deleteProperty.mutate(pendingDeleteId)
      setPendingDeleteId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
        <Link to="/dashboard/create-listing" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Property
        </Link>
      </div>

      {isLoading ? (
        <Loader label="Loading your listings..." />
      ) : listings.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-gray-500 mb-3">You haven't listed any properties yet</p>
          <Link to="/dashboard/create-listing" className="text-brand-600 font-medium hover:underline">
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-3 px-4 font-medium">Property</th>
                <th className="py-3 px-4 font-medium">Price</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((property) => (
                <tr key={property.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.images?.[0] || NO_IMAGE_PLACEHOLDER}
                        alt={property.title}
                        className="h-12 w-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{property.title}</p>
                        <p className="text-xs text-gray-500">
                          {[property.locality, property.city].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {formatPrice(property.price, property.listing_type)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={property.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/dashboard/edit-listing/${property.id}`}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(property)}
                        disabled={updateProperty.isPending}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600"
                        title={property.status === 'Active' ? 'Unpublish' : 'Publish'}
                      >
                        {property.status === 'Active' ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setPendingDeleteId(property.id)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={pendingDeleteId != null}
        onClose={() => setPendingDeleteId(null)}
        title="Delete listing"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={deleteProperty.isPending}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this listing? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
