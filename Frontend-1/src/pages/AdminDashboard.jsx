import { useAuth } from '../context/AuthContext'
import SuperAdminDashboard from '../components/admin/SuperAdminDashboard'
import NgoAdminDashboard from '../components/admin/NgoAdminDashboard'

const AdminDashboard = () => {
  const { user } = useAuth()

  // Determine which dashboard to show based on user role
  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard />
  } else if (user?.role === 'ngo_admin') {
    return <NgoAdminDashboard />
  }

  // Fallback for regular admin (existing functionality)
  return <SuperAdminDashboard />
}

export default AdminDashboard