import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-brand-600 font-bold text-7xl sm:text-8xl mb-4">404</p>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        Sorry, we couldn't find the page you're looking for. It may have been moved or no longer exists.
      </p>
      <Link to="/" className="btn-primary">
        <Home className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  )
}
