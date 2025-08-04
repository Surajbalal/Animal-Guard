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
  Ban,
  Settings,
  Shield,
  UserPlus,
  Trash2,
  Edit
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [pendingNgos, setPendingNgos] = useState([])
  const [reports, setReports] = useState([])
  const [ngos, setNgos] = useState([])
  const [ngoAdmins, setNgoAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, ngosResponse, reportsResponse, adminsResponse] = await Promise.all([
        axios.get('/api/super-admin/stats'),
        axios.get('/api/super-admin/ngos'),
        axios.get('/api/super-admin/reports'),
        axios.get('/api/super-admin/ngo-admins')
      ])
      
      setStats(statsResponse.data)
      setNgos(ngosResponse.data.ngos)
      setPendingNgos(ngosResponse.data.pending)
      setReports(reportsResponse.data)
      setNgoAdmins(adminsResponse.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleNgoAction = async (ngoId, action) => {
    try {
      await axios.put(`/api/super-admin/ngos/${ngoId}/${action}`)
      toast.success(`NGO ${action}ed successfully`)
      fetchDashboardData()
    } catch (error) {
      console.error(`Error ${action}ing NGO:`, error)
      toast.error(`Failed to ${action} NGO`)
    }
  }

  const suspendReport = async (reportId) => {
    try {
      await axios.put(`/api/super-admin/reports/${reportId}/suspend`)
      toast.success('Report suspended successfully')
      fetchDashboardData()
    } catch (error) {
      console.error('Error suspending report:', error)
      toast.error('Failed to suspend report')
    }
  }

  const createNgoAdmin = async (adminData) => {
    try {
      await axios.post('/api/super-admin/ngo-admins', adminData)
      toast.success('NGO Admin created successfully')
      setShowCreateAdminModal(false)
      fetchDashboardData()
    } catch (error) {
      console.error('Error creating NGO admin:', error)
      toast.error('Failed to create NGO admin')
    }
  }

  const deleteNgoAdmin = async (adminId) => {
    if (!confirm('Are you sure you want to delete this NGO admin?')) return
    
    try {
      await axios.delete(`/api/super-admin/ngo-admins/${adminId}`)
      toast.success('NGO Admin deleted successfully')
      fetchDashboardData()
    } catch (error) {
      console.error('Error deleting NGO admin:', error)
      toast.error('Failed to delete NGO admin')
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
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Complete platform management and oversight</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{ngoAdmins.length || 0}</p>
                <p className="text-sm text-gray-600">NGO Admins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'ngos', label: `NGO Management (${pendingNgos.length} pending)` },
              { id: 'reports', label: `Reports (${reports.length})` },
              { id: 'admins', label: `NGO Admins (${ngoAdmins.length})` },
              { id: 'settings', label: 'System Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
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

              {/* System Health */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Server Status</span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email Service</span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Map Service</span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Active</span>
                  </div>
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

        {/* NGO Admins Tab */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">NGO Administrators</h3>
                <button
                  onClick={() => setShowCreateAdminModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create NGO Admin</span>
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {ngoAdmins.map((admin) => (
                  <div key={admin._id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{admin.name}</h4>
                        <p className="text-gray-600">{admin.email}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                          <span>NGO: {admin.ngoName}</span>
                          <span>Created: {format(new Date(admin.createdAt), 'PP')}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {admin.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteNgoAdmin(admin._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="h-6 w-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Auto-approve NGOs
                      </label>
                      <select className="input-field">
                        <option value="false">Manual approval required</option>
                        <option value="true">Auto-approve verified NGOs</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report retention period (days)
                      </label>
                      <input type="number" defaultValue="365" className="input-field" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Send email alerts for critical reports</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Notify admins of new NGO registrations</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Weekly system reports</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button className="btn-primary">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create NGO Admin Modal */}
      {showCreateAdminModal && (
        <CreateNgoAdminModal
          onClose={() => setShowCreateAdminModal(false)}
          onCreate={createNgoAdmin}
          ngos={ngos}
        />
      )}
    </div>
  )
}

// Create NGO Admin Modal Component
const CreateNgoAdminModal = ({ onClose, onCreate, ngos }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    ngoId: '',
    permissions: []
  })

  const permissions = [
    'manage_cases',
    'view_reports',
    'update_ngo_profile',
    'manage_team'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create NGO Admin</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign to NGO</label>
              <select
                required
                value={formData.ngoId}
                onChange={(e) => setFormData({...formData, ngoId: e.target.value})}
                className="input-field"
              >
                <option value="">Select NGO</option>
                {ngos.map(ngo => (
                  <option key={ngo._id} value={ngo._id}>{ngo.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div className="space-y-2">
                {permissions.map(permission => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, permissions: [...formData.permissions, permission]})
                        } else {
                          setFormData({...formData, permissions: formData.permissions.filter(p => p !== permission)})
                        }
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{permission.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Create Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard