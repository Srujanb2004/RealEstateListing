import api from './api'

const authService = {
  async login(email, password) {
    const form = new URLSearchParams()
    form.set('username', email)
    form.set('password', password)
    const { data } = await api.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return data // { access_token, token_type, user }
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  async me() {
    const { data } = await api.get('/auth/me')
    return data
  },
}

export default authService
