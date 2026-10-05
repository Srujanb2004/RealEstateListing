import api from './api'
import { MOCK_PROPERTIES } from '../utils/mockData'

const LOCAL_KEY = 'saved_property_ids'

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []
  } catch {
    return []
  }
}

function writeLocal(ids) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(ids))
}

const favoriteService = {
  async list() {
    try {
      const { data } = await api.get('/favorites')
      return data
    } catch {
      const ids = readLocal()
      return MOCK_PROPERTIES.filter((p) => ids.includes(p.id))
    }
  },

  async add(propertyId) {
    try {
      const { data } = await api.post('/favorites', { property_id: propertyId })
      return data
    } catch {
      const ids = new Set(readLocal())
      ids.add(propertyId)
      writeLocal([...ids])
      return { property_id: propertyId }
    }
  },

  async remove(propertyId) {
    try {
      await api.delete(`/favorites/${propertyId}`)
    } catch {
      const ids = readLocal().filter((id) => id !== propertyId)
      writeLocal(ids)
    }
  },

  isSavedLocally(propertyId) {
    return readLocal().includes(propertyId)
  },
}

export default favoriteService
