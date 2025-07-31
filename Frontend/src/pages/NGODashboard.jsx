import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { 
  Bell, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Settings,
  BarChart3,
  Calendar,
  Phone,
  Mail
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const NGODashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('cases')
  const [cases, setCases] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [casesResponse, statsResponse] = await Promise.all([
        axios.get('/api/ngo/cases'),
        axios.get('/api/ngo/stats')
      ])
      
      setCases(casesResponse.data)
      setStats(statsResponse.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleCaseAction = async (caseId, action) => {
    try {
      await axios.put(`/api/ngo/cases/${caseId}/${action}`)
      toast.success(`Case ${action}ed successfully`)
      fetchDashboardData()
    } catch (error) {
      console.error(`Error ${action}ing case:`, error)
      toast.error(`Failed to ${action} case`)
    }
  }

  const updateCaseStatus = async (caseId, status, notes = '') => {
    try {
      await axios.put(`/api/ngo/cases/${caseId}/status`, { status, notes })
      toast.success('Case status updated successfully')
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating case status:', error)
      toast.error('Failed to update case status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-orange-100 text-orange-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.pendingCases || 0}</p>
                <p className="text-sm text-gray-600">Pending Cases</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.activeCases || 0}</p>
                <p className="text-sm text-gray-600">Active Cases</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.resolvedCases || 0}</p>
                <p className="text-sm text-gray-600">Resolved Cases</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalCases || 0}</p>
                <p className="text-sm text-gray-600">Total Cases</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('cases')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cases'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cases ({cases.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Cases Tab */}
        {activeTab === 'cases' && (
          <div className="space-y-6">
            {cases.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Cases Available</h3>
                <p className="text-gray-600">
                  There are currently no animal rescue cases in your area that match your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {cases.map((caseItem) => (
                  <div key={caseItem._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {caseItem.animalType} - {caseItem.incidentType}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                              {caseItem.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{format(new Date(caseItem.createdAt), 'PPp')}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>Case ID: {caseItem.reportId}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`text-right ${getSeverityColor(caseItem.severity)}`}>
                          <span className="text-sm font-medium uppercase">{caseItem.severity}</span>
                          <p className="text-xs text-gray-500">Severity</p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{caseItem.description}</p>

                      {caseItem.reporterName && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Reporter Contact</h4>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="font-medium">{caseItem.reporterName}</span>
                            </div>
                            {caseItem.reporterPhone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>{caseItem.reporterPhone}</span>
                              </div>
                            )}
                            {caseItem.reporterEmail && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>{caseItem.reporterEmail}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        {caseItem.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleCaseAction(caseItem._id, 'accept')}
                              className="btn-primary flex items-center space-x-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Accept Case</span>
                            </button>
                            <button
                              onClick={() => handleCaseAction(caseItem._id, 'reject')}
                              className="btn-secondary flex items-center space-x-2"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Decline</span>
                            </button>
                          </>
                        )}

                        {caseItem.status === 'accepted' && (
                          <button
                            onClick={() => updateCaseStatus(caseItem._id, 'in-progress')}
                            className="btn-primary flex items-center space-x-2"
                          >
                            <Clock className="h-4 w-4" />
                            <span>Start Rescue</span>
                          </button>
                        )}

                        {caseItem.status === 'in-progress' && (
                          <button
                            onClick={() => updateCaseStatus(caseItem._id, 'resolved')}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Mark as Resolved</span>
                          </button>
                        )}

                        <button className="btn-secondary">
                          View Location
                        </button>

                        {caseItem.media && caseItem.media.length > 0 && (
                          <button className="btn-secondary">
                            View Media ({caseItem.media.length})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-6 w-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">NGO Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rescue Distance (km)
                  </label>
                  <select className="input-field">
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="15">15 km</option>
                    <option value="20">20 km</option>
                    <option value="30">30 km</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Hours
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.serviceHours || '24/7'}
                    className="input-field"
                    placeholder="e.g., 24/7, Mon-Fri 9AM-6PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rescue Categories
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Dogs', 'Cats', 'Farm Animals', 'Wildlife', 'Birds', 'All Animals'].map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={user?.rescueCategories?.includes(category)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button className="btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NGODashboard