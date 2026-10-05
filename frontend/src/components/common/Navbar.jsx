import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Home, Menu, X, Heart, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Button from './Button.jsx'
import { classNames } from '../../utils/helpers'

const navLinkClass = ({ isActive }) =>
  classNames(
    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
    isActive ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50',
  )

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-brand-700">
          <Home className="h-6 w-6" />
          HomeFind
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/search?listing_type=Buy" className={navLinkClass}>Buy</NavLink>
          <NavLink to="/search?listing_type=Rent" className={navLinkClass}>Rent</NavLink>
          <NavLink to="/dashboard/create-listing" className={navLinkClass}>Sell</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/saved" className="btn-ghost">
                <Heart className="h-4 w-4" /> Saved
              </Link>
              <Link to="/dashboard" className="btn-ghost">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <span className="flex items-center gap-2 px-3 text-sm text-gray-600">
                <User className="h-4 w-4" /> {user?.name || user?.email}
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-1">
          <NavLink to="/search?listing_type=Buy" className={navLinkClass} onClick={() => setOpen(false)}>Buy</NavLink>
          <NavLink to="/search?listing_type=Rent" className={navLinkClass} onClick={() => setOpen(false)}>Rent</NavLink>
          <NavLink to="/dashboard/create-listing" className={navLinkClass} onClick={() => setOpen(false)}>Sell</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/saved" className={navLinkClass} onClick={() => setOpen(false)}>Saved</NavLink>
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>Login</NavLink>
              <NavLink to="/register" className={navLinkClass} onClick={() => setOpen(false)}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  )
}
