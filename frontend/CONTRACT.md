# Frontend build contract

Project root: `project/frontend/src`. React 18 + Vite + Tailwind + React Router v6 + TanStack Query v5 + React Hook Form + Zod + Axios + lucide-react. JSX files use `.jsx`, no TypeScript.

Already built (read these for exact APIs/conventions before writing new files):
- `src/utils/helpers.js` — `formatPrice(value, listingType)`, `formatArea(sqft)`, `timeAgo(dateString)`, `classNames(...args)`, `buildQueryString(params)`
- `src/utils/constants.js` — `PROPERTY_TYPES`, `LISTING_TYPES` (`['Buy','Rent']`), `AMENITIES`, `SORT_OPTIONS` (`[{value,label}]`), `PROPERTY_STATUS`
- `src/utils/mockData.js` — `MOCK_PROPERTIES`, `MOCK_USER`, `POPULAR_LOCATIONS` (shape reference for a Property object)
- `src/services/api.js`, `authService.js`, `propertyService.js`, `favoriteService.js`, `inquiryService.js` — all data access goes through these, never call axios directly from components/pages
- `src/context/AuthContext.jsx` + `src/hooks/useAuth.js` — `const { user, isAuthenticated, loading, login, register, logout } = useAuth()`. `login(email, password)` and `register(payload)` return the user and never reject in practice (they fall back to a demo user offline), so callers can `await` and then `navigate()`.
- `src/hooks/useProperties.js` — TanStack Query hooks: `useProperties(filters)` → `{data:{items,total}, isLoading, error}`, `useProperty(id)` → `{data: property, isLoading}`, `useMyListings()`, `useFavorites()` → `{data: property[]}`, `useToggleFavorite()` → mutation `mutate({propertyId, isSaved})`, `useCreateProperty()`, `useUpdateProperty()` → mutation `mutate({id, payload})`, `useDeleteProperty()` → mutation `mutate(id)`
- `src/layouts/PublicLayout.jsx`, `src/layouts/DashboardLayout.jsx` — already wired with `<Outlet/>`, do not modify
- `src/components/common/Button.jsx` — `<Button variant="primary|secondary|ghost|danger" loading disabled onClick type>` children
- `src/components/common/Modal.jsx` — `<Modal open onClose title footer>` children
- `src/components/common/Loader.jsx` — `<Loader full label />`
- `src/components/common/Navbar.jsx`, `Footer.jsx` — read for Tailwind style conventions

## Property object shape (from mockData.js / propertyService)
```
{
  id, title, description,
  property_type,      // one of PROPERTY_TYPES
  listing_type,        // 'Buy' | 'Rent'
  price, bedrooms, bathrooms, area_sqft,
  city, locality, address, pincode, latitude, longitude,
  amenities: string[],
  images: string[],    // array of image URLs
  status,               // one of PROPERTY_STATUS
  created_at,           // ISO date string
  owner_id,
}
```

## Tailwind conventions already defined in `src/index.css`
`.container-page` (max-w-7xl centered padding), `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.input` (form input), `.card` (white rounded bordered box). Reuse these classes; keep visual style consistent with Navbar.jsx/Footer.jsx (blue `brand` palette, rounded-xl cards, rounded-lg buttons, gray-200 borders, shadow-sm).

## Icons
`lucide-react` only, e.g. `import { Heart, BedDouble, Bath, Ruler, MapPin } from 'lucide-react'`.

## Routing paths (final, defined in `src/routes/AppRoutes.jsx` — do not create this file, someone else owns it)
Public (under PublicLayout): `/` Home, `/search` Search, `/property/:id` PropertyDetails, `/login` Login, `/register` Register, `/saved` SavedProperties (protected).
Dashboard (under DashboardLayout, all protected): `/dashboard` Dashboard, `/dashboard/my-listings` MyListings, `/dashboard/create-listing` CreateListing, `/dashboard/edit-listing/:id` EditListing, `/dashboard/inquiries` Inquiries, `/dashboard/profile` Profile.
Fallback: `*` NotFound (no layout needed, standalone centered page).

## Forms
Use `react-hook-form` with `@hookform/resolvers/zod` and `zod` for validation. Error text: `text-sm text-red-600 mt-1`.

## General rules
- Functional components, default export, no prop-types library (plain JS).
- Do not use browser `localStorage`/`sessionStorage` directly in new code — that's already handled inside the services/context layer.
- Every page assumes it is rendered inside `PublicLayout` or `DashboardLayout` (already provides Navbar/Footer/Sidebar) — pages should NOT re-render Navbar/Footer themselves, just the page content wrapped in `<div className="container-page py-8">...</div>` (public pages) or a plain fragment (dashboard pages, layout already adds padding).
- Keep components reasonably compact but fully functional (no TODO stubs, no placeholder "coming soon" unless explicitly a Phase 2/3 item from the design doc, e.g. map view, real-time chat).
