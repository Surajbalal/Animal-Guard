import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import ReportIncident from './pages/ReportIncident'
import NGOListing from './pages/NGOListing'
import ReportTracker from './pages/ReportTracker'
import NGODashboard from './pages/NGODashboard'
import AdminDashboard from './pages/AdminDashboard'
import NGOLogin from './pages/NGOLogin'
import NGORegister from './pages/NGORegister'
import AdminLogin from './pages/AdminLogin'
import SuperAdminLogin from './pages/SuperAdminLogin'
import NgoAdminLogin from './pages/NgoAdminLogin'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/ngos" element={<NGOListing />} />
          <Route path="/tracker" element={<ReportTracker />} />
          <Route path="/ngo/login" element={<NGOLogin />} />
          <Route path="/ngo/register" element={<NGORegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/ngo-admin/login" element={<NgoAdminLogin />} />
          <Route 
            path="/ngo/dashboard" 
            element={
              <ProtectedRoute userType="ngo">
                <NGODashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute userType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App