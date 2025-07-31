import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  AlertTriangle,
  Eye,
  Ban
} from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [pendingNgos, setPendingNgos] = useState([])
  const [reports, setReports] = useState([])
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, ngosResponse, reportsResponse] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/ngos'),
        axios.get('/api/admin/reports')
      ])
      
      setStats(statsResponse.data)
      setNgos(ngosResponse.data.ngos)
      setPendingNgos(ngosResponse.data.pending)
      setReports(reportsResponse.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleNgoAction = async (ngoId, action) => {
    try {
      await axios.put(`/api/admin/ngos/${ngoId}/${action}`)
      toast.success(`NGO ${action}ed successfully`)
      fetchDashboardData()
    } catch (error) {
      console.error(`Error ${action}ing NGO:`, error)
      toast.error(`Failed to ${action} NGO`)
    }
  }

  const suspendReport = async (reportId) => {
    try {
      await axios.put(`/api/admin/reports/${reportId}/suspend`)
      toast.success('Report suspended successfully')
      fetchDashboardData()
    } catch (error) {
      console.error('Error suspending report:', error)
      toast.error('Failed to suspend report')
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform management and oversight</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalReports || 0}</p>
                <p className="text-sm text-gray-600">Total Reports</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.activeNgos || 0}</p>
                <p className="text-sm text-gray-600">Active NGOs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals || 0}</p>
                <p className="text-sm text-gray-600">Pending Approvals</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.resolvedCases || 0}</p>
                <p className="text-sm text-gray-600">Resolved Cases</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('ngos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ngos'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              NGO Management ({pendingNgos.length} pending)
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reports ({reports.length})
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report) => (
                    <div key={report._id} className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          New {report.animalType} report
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(report.createdAt), 'PPp')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending NGO Approvals</h3>
                <div className="space-y-4">
                  {pendingNgos.slice(0, 5).map((ngo) => (
                    <div key={ngo._id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ngo.name}</p>
                        <p className="text-xs text-gray-500">{ngo.address?.city}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleNgoAction(ngo._id, 'approve')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleNgoAction(ngo._id, 'reject')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NGOs Tab */}
        {activeTab === 'ngos' && (
          <div className="space-y-6">
            {/* Pending Approvals */}
            {pendingNgos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {pendingNgos.map((ngo) => (
                    <div key={ngo._id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{ngo.name}</h4>
                          <p className="text-gray-600 mb-3">{ngo.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-500">Email:</span>
                              <p className="text-gray-900">{ngo.email}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Phone:</span>
                              <p className="text-gray-900">{ngo.contactPhone}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Location:</span>
                              <p className="text-gray-900">{ngo.address?.city}, {ngo.address?.state}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <span className="font-medium text-gray-500">Categories:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {ngo.rescueCategories.map((category, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3 ml-6">
                          <button
                            onClick={() => handleNgoAction(ngo._id, 'approve')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleNgoAction(ngo._id, 'reject')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active NGOs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Active NGOs</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {ngos.map((ngo) => (
                  <div key={ngo._id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{ngo.name}</h4>
                        <p className="text-gray-600 mb-2">{ngo.address?.city}, {ngo.address?.state}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Cases: {ngo.casesHandled || 0}</span>
                          <span>Radius: {ngo.rescueDistance}km</span>
                          <span>Joined: {format(new Date(ngo.createdAt), 'PP')}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Ban className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Reports</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <div key={report._id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {report.animalType} - {report.incidentType}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          report.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{report.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>ID: {report.reportId}</span>
                        <span>Severity: {report.severity}</span>
                        <span>{format(new Date(report.createdAt), 'PPp')}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-6">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => suspendReport(report._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Ban className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard