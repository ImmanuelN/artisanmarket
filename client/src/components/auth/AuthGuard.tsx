import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, redirectIfAuthenticated = false }) => {
  const { user, token, isInitialized } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && redirectIfAuthenticated && token && user) {
      // Redirect authenticated users away from auth pages
      if (user.role === 'vendor') {
        navigate('/vendor', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isInitialized, token, user, navigate, redirectIfAuthenticated]);

  // Don't render anything if we're about to redirect
  if (isInitialized && redirectIfAuthenticated && token && user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
