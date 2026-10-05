import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Heart, MessageSquare, UserCircle, LogOut, Home,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { classNames } from '../utils/helpers'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/my-listings', label: 'My Listings', icon: Building2 },
  { to: '/saved', label: 'Saved Properties', icon: Heart },
  { to: '/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/dashboard/profile', label: 'Profile', icon: UserCircle },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden md:flex md:flex-col w-64 border-r border-gray-200 bg-white">
        <div className="h-16 flex items-center gap-2 px-6 font-bold text-brand-700 border-b border-gray-200">
          <Home className="h-5 w-5" /> HomeFind
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100',
                )
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-200">
          <p className="px-3 text-xs text-gray-400 mb-2 truncate">{user?.email}</p>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
          <span className="font-bold text-brand-700">HomeFind</span>
          <button onClick={() => { logout(); navigate('/') }} className="text-sm text-red-600">Logout</button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
