import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, userType }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    // Redirect to appropriate login page based on userType
    if (userType === 'admin') {
      return <Navigate to="/admin/login" replace />
    }
    return <Navigate to={`/${userType}/login`} replace />
  }

  // Check if user has the right permissions
  if (userType === 'admin') {
    // Allow access for any admin type (super_admin, ngo_admin, or regular admin)
    if (user.userType !== 'admin' && user.role !== 'super_admin' && user.role !== 'ngo_admin') {
      return <Navigate to="/" replace />
    }
  } else if (user.userType !== userType) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute