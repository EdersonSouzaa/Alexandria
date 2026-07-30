import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DashboardShell from '../components/DashboardShell'
import { PageHeadSkeleton, StatsSkeleton, BookGridSkeleton } from '../components/Skeleton'
import '../styles/dashboard.css'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="dash">
        <DashboardShell active={location.pathname}>
          <PageHeadSkeleton withFilters={false} />
          <StatsSkeleton count={4} />
          <BookGridSkeleton count={8} />
        </DashboardShell>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
