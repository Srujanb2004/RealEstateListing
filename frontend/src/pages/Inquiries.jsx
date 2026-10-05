import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Mail, Phone, MessageSquare } from 'lucide-react'
import inquiryService from '../services/inquiryService'
import { timeAgo } from '../utils/helpers'
import Loader from '../components/common/Loader.jsx'

export default function Inquiries() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-inquiries'],
    queryFn: async () => {
      try {
        return await inquiryService.myInquiries()
      } catch {
        return []
      }
    },
  })

  const inquiries = Array.isArray(data) ? data : []

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inquiries</h1>

      {isLoading ? (
        <Loader label="Loading inquiries..." />
      ) : inquiries.length === 0 ? (
        <div className="card p-10 text-center">
          <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No inquiries yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="card p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {inquiry.name || inquiry.sender_name || 'Anonymous'}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                    {inquiry.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {inquiry.email}
                      </span>
                    )}
                    {inquiry.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {inquiry.phone}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {timeAgo(inquiry.created_at)}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3">{inquiry.message}</p>

              {inquiry.property_id != null && (
                <Link
                  to={`/property/${inquiry.property_id}`}
                  className="text-sm text-brand-600 font-medium hover:underline"
                >
                  {inquiry.property_title || 'View property'}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
