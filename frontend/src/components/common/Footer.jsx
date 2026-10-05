import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container-page py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white mb-3">
            <Home className="h-5 w-5" /> HomeFind
          </Link>
          <p className="text-sm text-gray-400">
            Find your next home. Buy, rent, or list a property in minutes.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search?listing_type=Buy" className="hover:text-white">Buy a home</Link></li>
            <li><Link to="/search?listing_type=Rent" className="hover:text-white">Rent a home</Link></li>
            <li><Link to="/dashboard/create-listing" className="hover:text-white">List your property</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/register" className="hover:text-white">Register</Link></li>
            <li><Link to="/saved" className="hover:text-white">Saved properties</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-white">About</span></li>
            <li><span className="hover:text-white">Contact</span></li>
            <li><span className="hover:text-white">Privacy Policy</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} HomeFind. All rights reserved.
      </div>
    </footer>
  )
}
