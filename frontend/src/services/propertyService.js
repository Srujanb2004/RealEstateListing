import api from './api'
import { buildQueryString } from '../utils/helpers'
import { normalizeCity } from '../utils/constants'
import { MOCK_PROPERTIES } from '../utils/mockData'

const USE_MOCK_FALLBACK = true

const propertyService = {
  async list(filters = {}) {
    const qs = buildQueryString(filters)
    try {
      const { data } = await api.get(`/properties${qs ? `?${qs}` : ''}`)
      return data
    } catch (err) {
      if (!USE_MOCK_FALLBACK) throw err
      return filterMock(filters)
    }
  },

  async get(id) {
    try {
      const { data } = await api.get(`/properties/${id}`)
      return data
    } catch (err) {
      if (!USE_MOCK_FALLBACK) throw err
      const found = MOCK_PROPERTIES.find((p) => String(p.id) === String(id))
      if (!found) throw err
      return found
    }
  },

  async create(payload) {
    const { data } = await api.post('/properties', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/properties/${id}`, payload)
    return data
  },

  async remove(id) {
    const { data } = await api.delete(`/properties/${id}`)
    return data
  },

  async myListings() {
    try {
      const { data } = await api.get('/properties/mine')
      return data
    } catch (err) {
      if (!USE_MOCK_FALLBACK) throw err
      return MOCK_PROPERTIES.slice(0, 3)
    }
  },

  async uploadImages(propertyId, files) {
    const form = new FormData()
    Array.from(files).forEach((file) => form.append('files', file))
    const { data } = await api.post(`/properties/${propertyId}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}

function filterMock(filters) {
  let results = [...MOCK_PROPERTIES]
  const { city, listing_type, property_type, min_price, max_price, bedrooms, sort } = filters

  if (city) {
    const query = normalizeCity(city)
    results = results.filter((p) => {
      const propertyCity = normalizeCity(p.city)
      return propertyCity.includes(query) || query.includes(propertyCity) || p.locality.toLowerCase().includes(query)
    })
  }
  if (listing_type) results = results.filter((p) => p.listing_type === listing_type)
  if (property_type) results = results.filter((p) => p.property_type === property_type)
  if (min_price) results = results.filter((p) => p.price >= Number(min_price))
  if (max_price) results = results.filter((p) => p.price <= Number(max_price))
  if (bedrooms) results = results.filter((p) => p.bedrooms >= Number(bedrooms))

  switch (sort) {
    case 'price_asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'area_desc':
      results.sort((a, b) => b.area_sqft - a.area_sqft)
      break
    default:
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  return { items: results, total: results.length }
}

export default propertyService
