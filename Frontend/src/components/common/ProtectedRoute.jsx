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
    return <Navigate to={`/${userType}/login`} replace />
  }

  if (user.userType !== userType) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute