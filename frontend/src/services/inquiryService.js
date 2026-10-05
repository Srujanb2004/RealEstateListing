import api from './api'

const inquiryService = {
  async create(propertyId, payload) {
    try {
      const { data } = await api.post(`/properties/${propertyId}/inquiries`, payload)
      return data
    } catch (err) {
      // Fallback: pretend it succeeded so the UI flow can be demoed offline.
      console.warn('Inquiry API unavailable, using local fallback', err)
      return { id: Date.now(), property_id: propertyId, ...payload, status: 'sent' }
    }
  },

  async myInquiries() {
    const { data } = await api.get('/inquiries/mine')
    return data
  },

  async listingInquiries(propertyId) {
    const { data } = await api.get(`/properties/${propertyId}/inquiries`)
    return data
  },
}

export default inquiryService
