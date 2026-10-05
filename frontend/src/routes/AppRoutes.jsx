import { Routes, Route } from 'react-router-dom'

import PublicLayout from '../layouts/PublicLayout.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

import Home from '../pages/Home.jsx'
import Search from '../pages/Search.jsx'
import PropertyDetails from '../pages/PropertyDetails.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import SavedProperties from '../pages/SavedProperties.jsx'

import Dashboard from '../pages/Dashboard.jsx'
import MyListings from '../pages/MyListings.jsx'
import CreateListing from '../pages/CreateListing.jsx'
import EditListing from '../pages/EditListing.jsx'
import Inquiries from '../pages/Inquiries.jsx'
import Profile from '../pages/Profile.jsx'

import NotFound from '../pages/NotFound.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedProperties />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/my-listings" element={<MyListings />} />
        <Route path="/dashboard/create-listing" element={<CreateListing />} />
        <Route path="/dashboard/edit-listing/:id" element={<EditListing />} />
        <Route path="/dashboard/inquiries" element={<Inquiries />} />
        <Route path="/dashboard/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
