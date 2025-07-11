import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../../store/store'

interface ProtectedRouteProps {
  children: React.ReactNode
  role?: 'customer' | 'vendor' | 'admin'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, token } = useSelector((state: RootState) => state.auth)

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
