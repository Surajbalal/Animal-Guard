import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { MapPin, Upload, AlertTriangle, Send } from 'lucide-react'
import MapComponent from '../components/maps/MapComponent'
import FileUpload from '../components/forms/FileUpload'
import LoadingSpinner from '../components/common/LoadingSpinner'
import axiosInstance from '../context/useAxiosInstance'

const ReportIncident = () => {
  const [location, setLocation] = useState(null)
  const [files, setFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const animalTypes = [
    'Dog', 'Cat', 'Cow', 'Buffalo', 'Horse', 'Bird', 'Goat', 'Sheep', 'Other'
  ]

  const incidentTypes = [
    'Physical Abuse', 'Neglect', 'Abandonment', 'Injured Animal', 
    'Illegal Confinement', 'Medical Emergency', 'Other'
  ]

  const severityLevels = [
    { value: 'low', label: 'Low - Minor injuries or neglect' },
    { value: 'medium', label: 'Medium - Moderate injuries or abuse' },
    { value: 'high', label: 'High - Severe injuries or immediate danger' },
    { value: 'critical', label: 'Critical - Life-threatening emergency' }
  ]

  const onSubmit = async (data) => {
    if (!location) {
      toast.error('Please select a location on the map')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      
      // Add form data
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })
      
      // Add location
      formData.append('latitude', location.latitude)
      formData.append('longitude', location.longitude)
      
      // Add files
      files.forEach(file => {
        formData.append('media', file)
      })

      const response = await axiosInstance.post('/api/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Incident reported successfully!')
      reset()
      setLocation(null)
      setFiles([])
      
      // Redirect to tracker with the report ID
      navigate(`/tracker?reportId=${response.data.reportId}`)
      
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.error(error.response?.data?.message || 'Failed to submit report')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Report Animal Incident</h1>
                <p className="text-gray-600">Help us connect this case with nearby NGOs for immediate assistance</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Incident Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Incident Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Animal *
                  </label>
                  <select
                    {...register('animalType', { required: 'Animal type is required' })}
                    className="input-field"
                  >
                    <option value="">Select animal type</option>
                    {animalTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.animalType && (
                    <p className="mt-1 text-sm text-red-600">{errors.animalType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Incident *
                  </label>
                  <select
                    {...register('incidentType', { required: 'Incident type is required' })}
                    className="input-field"
                  >
                    <option value="">Select incident type</option>
                    {incidentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.incidentType && (
                    <p className="mt-1 text-sm text-red-600">{errors.incidentType.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity Level *
                  </label>
                  <select
                    {...register('severity', { required: 'Severity level is required' })}
                    className="input-field"
                  >
                    <option value="">Select severity</option>
                    {severityLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                  {errors.severity && (
                    <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { 
                      required: 'Description is required',
                      minLength: { value: 20, message: 'Description must be at least 20 characters' }
                    })}
                    rows={4}
                    className="input-field"
                    placeholder="Please provide detailed information about the incident..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Selection */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Incident Location *
              </h2>
              <p className="text-sm text-gray-600">
                Click on the map to pin the exact location where the incident occurred
              </p>
              
              <MapComponent
                onLocationSelect={setLocation}
                height="400px"
                interactive={true}
              />
              
              {!location && (
                <p className="text-sm text-red-600">Please select a location on the map</p>
              )}
            </div>

            {/* Media Upload */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Photos & Videos (Optional)
              </h2>
              <p className="text-sm text-gray-600">
                Upload photos or videos to help NGOs better understand the situation
              </p>
              
              <FileUpload
                onFilesChange={setFiles}
                maxFiles={5}
                acceptedTypes={['image/*', 'video/*']}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Contact Information (Optional)</h2>
              <p className="text-sm text-gray-600">
                Providing contact information helps NGOs reach you for updates or additional information
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    {...register('reporterName')}
                    className="input-field"
                    placeholder="Enter your name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    {...register('reporterPhone')}
                    className="input-field"
                    placeholder="Enter your phone number (optional)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('reporterEmail')}
                    className="input-field"
                    placeholder="Enter your email address (optional)"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Privacy Note:</p>
                    <p>Your contact information will only be shared with verified NGOs responding to this case and will be kept confidential.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportIncident