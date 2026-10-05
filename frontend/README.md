
# HomeFind — Real Estate Listing Frontend

React + Vite + Tailwind CSS frontend for the Real Estate Listing Platform, built to the structure in `Real_Estate_Listing_Platform_Frontend_Design.docx`.

## Stack

React 18, Vite, Tailwind CSS, React Router v6, TanStack Query, React Hook Form + Zod, Axios, lucide-react.

## Run it

```
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Backend connection

Copy `.env.example` to `.env` and point `VITE_API_URL` at the FastAPI backend (defaults to `http://localhost:8000/api`).

The app works standalone even without the backend running: every service in `src/services/` falls back to local sample data (`src/utils/mockData.js`) and browser `localStorage` (for auth, favorites, inquiries) when the API is unreachable, so the whole UI — browsing, search/filters, login/register, saving properties, creating/editing listings, dashboards — is fully clickable out of the box. Once the FastAPI backend is running and reachable, real requests take over automatically.

## Structure

```
src/
  components/
    common/     Navbar, Footer, Button, Modal, Loader
    property/   PropertyCard, PropertyGallery, PropertyFilters, PropertyAmenities
    search/     SearchBar, FilterPanel, SortDropdown
    forms/      LoginForm, RegisterForm, PropertyForm (multi-step)
  pages/        Home, Search, PropertyDetails, Login, Register, SavedProperties,
                Dashboard, MyListings, CreateListing, EditListing, Inquiries, Profile
  layouts/      PublicLayout, DashboardLayout
  context/      AuthContext
  hooks/        useAuth, useProperties (+ favorites/CRUD mutations)
  services/     api, authService, propertyService, favoriteService, inquiryService
  routes/       AppRoutes, ProtectedRoute
  utils/        helpers, constants, mockData
```

## Pages implemented (MVP scope from the design doc)

Home (hero search, featured properties, popular locations), Search (filters + sort + grid), Property Details (gallery, specs, amenities, save, contact-seller inquiry), Login/Register (JWT-ready), Saved Properties, Dashboard (summary cards, recent listings), My Listings (edit/delete/publish), Create/Edit Listing (4-step form: basic info → location → images → preview), Inquiries, Profile.

## Build

```
npm run build
```

Verified: builds cleanly with Vite (1727 modules, no errors).
