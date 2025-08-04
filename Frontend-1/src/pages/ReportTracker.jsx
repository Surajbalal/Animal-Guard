import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { format } from 'date-fns'
import { Search, MapPin, Calendar, User, AlertCircle } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'

const ReportTracker = () => {
  const [searchParams] = useSearchParams()
  const [reports, setReports] = useState([])
  const [searchId, setSearchId] = useState(searchParams.get('reportId') || '')
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)

  useEffect(() => {
    if (searchParams.get('reportId')) {
      handleSearch()
    }
  }, [])

  const handleSearch = async () => {
    if (!searchId.trim()) return

    setLoading(true)
    setSearchPerformed(true)

    try {
      const response = await axios.get(`/api/reports/track/${searchId}`)
      setReports([response.data])
    } catch (error) {
      console.error('Error fetching report:', error)
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending'
      case 'accepted': return 'status-accepted'
      case 'in-progress': return 'status-in-progress'
      case 'resolved': return 'status-resolved'
      default: return 'status-pending'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'accepted': return <User className="h-4 w-4" />
      case 'in-progress': return <Calendar className="h-4 w-4" />
      case 'resolved': return <MapPin className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Report</h1>
          <p className="text-lg text-gray-600">
            Enter your report ID to check the status and progress of your animal incident report
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report ID
              </label>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter your report ID (e.g., RPT-2024-001234)"
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading || !searchId.trim()}
                className="btn-primary flex items-center space-x-2 px-6"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!loading && searchPerformed && reports.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Not Found</h3>
            <p className="text-gray-600">
              No report found with the ID "{searchId}". Please check the ID and try again.
            </p>
          </div>
        )}

        {!loading && reports.length > 0 && (
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Report Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Report ID: {report.reportId}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Reported: {format(new Date(report.createdAt), 'PPP')}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{report.location?.address || 'Location marked on map'}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`${getStatusColor(report.status)} flex items-center space-x-1`}>
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Animal Type</span>
                      <p className="text-gray-900">{report.animalType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Incident Type</span>
                      <p className="text-gray-900">{report.incidentType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Severity</span>
                      <p className={`capitalize ${
                        report.severity === 'critical' ? 'text-red-600' :
                        report.severity === 'high' ? 'text-orange-600' :
                        report.severity === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {report.severity}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Report Description */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{report.description}</p>
                </div>

                {/* Status Timeline */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Status Timeline</h3>
                  <div className="space-y-4">
                    {report.statusUpdates?.map((update, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getStatusColor(update.status)}`}>
                          {getStatusIcon(update.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {update.status.replace('-', ' ')}
                              </p>
                              {update.notes && (
                                <p className="text-sm text-gray-600 mt-1">{update.notes}</p>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(new Date(update.timestamp), 'PPp')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {report.status.replace('-', ' ')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(report.createdAt), 'PPp')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Assigned NGO */}
                {report.assignedNgo && (
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Assigned NGO</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-green-900">{report.assignedNgo.name}</p>
                          <p className="text-sm text-green-700 mt-1">{report.assignedNgo.contactPhone}</p>
                          <p className="text-sm text-green-700">{report.assignedNgo.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-600">
                            Accepted: {format(new Date(report.acceptedAt), 'PPp')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-700 mb-4">
            If you can't find your report or have questions about the status, here are some tips:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            <li>Report IDs are typically sent via email or SMS after submission</li>
            <li>Make sure you're entering the complete report ID (e.g., RPT-2024-001234)</li>
            <li>Reports may take up to 24 hours to appear in the system</li>
            <li>Contact us if your report was submitted more than 24 hours ago and still doesn't appear</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ReportTracker