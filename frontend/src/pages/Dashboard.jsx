import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Building2, CheckCircle2, MessageSquare } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useMyListings } from '../hooks/useProperties'
import inquiryService from '../services/inquiryService'
import { formatPrice, NO_IMAGE_PLACEHOLDER } from '../utils/helpers'
import Loader from '../components/common/Loader.jsx'

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

export default function Dashboard() {
  const { user } = useAuth()
  const { data: listingsData, isLoading } = useMyListings()
  const { data: inquiries } = useQuery({
    queryKey: ['my-inquiries'],
    queryFn: async () => {
      try {
        return await inquiryService.myInquiries()
      } catch {
        return []
      }
    },
  })

  const listings = getListingsArray(listingsData)
  const totalListings = listings.length
  const activeListings = listings.filter((p) => p.status === 'Active').length
  const inquiriesCount = Array.isArray(inquiries) ? inquiries.length : 0

  const recentListings = [...listings]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 5)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || user?.email}
        </h1>
        <Link to="/dashboard/create-listing" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Listings</p>
            <Building2 className="h-5 w-5 text-brand-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalListings}</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Active Listings</p>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeListings}</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Inquiries</p>
            <MessageSquare className="h-5 w-5 text-brand-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{inquiriesCount}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Listings</h2>
        {isLoading ? (
          <Loader label="Loading listings..." />
        ) : recentListings.length === 0 ? (
          <p className="text-sm text-gray-500">
            You haven't listed any properties yet.{' '}
            <Link to="/dashboard/create-listing" className="text-brand-600 font-medium hover:underline">
              Add your first property
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4 font-medium">Property</th>
                  <th className="py-2 pr-4 font-medium">Price</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentListings.map((property) => (
                  <tr key={property.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={property.images?.[0] || NO_IMAGE_PLACEHOLDER}
                          alt={property.title}
                          className="h-12 w-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                        />
                        <span className="font-medium text-gray-900">{property.title}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap text-gray-700">
                      {formatPrice(property.price, property.listing_type)}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={property.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
