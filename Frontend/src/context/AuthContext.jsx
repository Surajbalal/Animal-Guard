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
    
    if (token && userType) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Verify token validity
      axios.get(`/api/${userType}/profile`)
        .then(response => {
          setUser({ ...response.data, userType })
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('userType')
          delete axios.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials, userType) => {
    try {
      const response = await axios.post(`/api/${userType}/login`, credentials)
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('userType', userType)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser({ ...userData, userType })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

const register = async (data, userType) => {
  try {
    const url = `${process.env.VITE_API_BASE_URL}/api/${userType}/register`;
    console.log("Registering to:", url, "with data:", data);
    const response = await axios.post(url, data);
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