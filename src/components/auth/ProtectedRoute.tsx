import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../../store/store'
import { DashboardLoading } from '../ui'

interface ProtectedRouteProps {
  children: React.ReactNode
  role?: 'customer' | 'vendor' | 'admin'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, token, isReconnecting, isInitialized } = useSelector((state: RootState) => state.auth)

  // Show loading while checking authentication status
  if (!isInitialized || isReconnecting) {
    const userType = role === 'vendor' ? 'vendor' : 'customer'
    return <DashboardLoading userType={userType} />
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
