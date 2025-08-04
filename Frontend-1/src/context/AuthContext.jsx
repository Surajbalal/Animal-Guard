import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userType = localStorage.getItem('userType')
    const userRole = localStorage.getItem('userRole')
    
    if (token && userType) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Verify token validity
      const profileEndpoint = userRole ? `/api/${userRole}/profile` : `/api/${userType}/profile`
      
      axios.get(profileEndpoint)
        .then(response => {
          setUser({ ...response.data, userType, role: userRole })
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('userType')
          localStorage.removeItem('userRole')
          delete axios.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials, userType) => {
    try {
      // Map userType to appropriate endpoint
      let endpoint = `/api/${userType}/login`
      let role = null

      // Handle different admin types
      if (userType === 'super-admin') {
        endpoint = '/api/super-admin/login'
        role = 'super_admin'
        userType = 'admin' // Store as admin type but with super_admin role
      } else if (userType === 'ngo-admin') {
        endpoint = '/api/ngo-admin/login'
        role = 'ngo_admin'
        userType = 'admin' // Store as admin type but with ngo_admin role
      }

      const response = await axios.post(endpoint, credentials)
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('userType', userType)
      if (role) {
        localStorage.setItem('userRole', role)
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser({ ...userData, userType, role })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    localStorage.removeItem('userRole')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }
const register = async (data, userType) => {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/${userType}/register`;
    console.log("Registering to:", url, "with data:", data);
    const response = await axios.post(url, data,{
      headers:{
        "content-type" : applicaiton/json
      }
      });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Registration failed error:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Registration failed' 
    };
  }
};


  const value = {
    user,
    login,
    logout,
    register,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}