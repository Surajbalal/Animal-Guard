import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, Heart, User, LogOut, Shield, Crown, Users } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Report Incident', href: '/report' },
    { name: 'NGOs', href: '/ngos' },
    { name: 'Track Reports', href: '/tracker' },
  ]

  const getDashboardLink = () => {
    if (user?.userType === 'admin' || user?.role === 'super_admin' || user?.role === 'ngo_admin') {
      return '/admin/dashboard'
    }
    return '/ngo/dashboard'
  }

  const getUserIcon = () => {
    if (user?.role === 'super_admin') return <Crown className="h-4 w-4" />
    if (user?.role === 'ngo_admin') return <Users className="h-4 w-4" />
    if (user?.userType === 'admin') return <Shield className="h-4 w-4" />
    return <User className="h-4 w-4" />
  }

  const getUserLabel = () => {
    if (user?.role === 'super_admin') return 'Super Admin'
    if (user?.role === 'ngo_admin') return 'NGO Admin'
    if (user?.userType === 'admin') return 'Admin'
    return 'Dashboard'
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">AnimalGuard</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  {getUserIcon()}
                  <span>{getUserLabel()}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="text-gray-700 hover:text-primary-600 flex items-center space-x-1">
                    <span>Admin Login</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        to="/super-admin/login"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Super Admin
                      </Link>
                      <Link
                        to="/ngo-admin/login"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        NGO Admin
                      </Link>
                      <Link
                        to="/admin/login"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Platform Admin
                      </Link>
                    </div>
                  </div>
                </div>
                <Link to="/ngo/login" className="text-gray-700 hover:text-primary-600">
                  NGO Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  {getUserIcon()}
                  <span className="ml-2">{getUserLabel()}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="flex items-center w-full text-left px-3 py-2 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/ngo/login"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  NGO Login
                </Link>
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-500 mb-2">Admin Access</p>
                  <div className="space-y-1">
                    <Link
                      to="/super-admin/login"
                      className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-primary-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Super Admin
                    </Link>
                    <Link
                      to="/ngo-admin/login"
                      className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-primary-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      NGO Admin
                    </Link>
                    <Link
                      to="/admin/login"
                      className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-primary-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Platform Admin
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar