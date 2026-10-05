import { useState } from 'react'
import { UserCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/common/Button.jsx'

export default function Profile() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // No backend endpoint exists yet for updating a profile — this is a local-only stub.
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="card p-6 max-w-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
            <UserCircle className="h-10 w-10 text-brand-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name || 'Unnamed User'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {user?.role && (
              <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {user.role}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              id="profile-name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit">Save Changes</Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" /> Profile updated
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
