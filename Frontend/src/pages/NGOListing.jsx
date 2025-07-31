import { useState, useEffect } from 'react'
import axios from 'axios'
import { MapPin, Phone, Mail, Clock, Filter, Search } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'

const NGOListing = () => {
  const [ngos, setNgos] = useState([])
  const [filteredNgos, setFilteredNgos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = [
    'Dogs', 'Cats', 'Farm Animals', 'Wildlife', 'Birds', 'All Animals'
  ]

  useEffect(() => {
    fetchNgos()
  }, [])

  useEffect(() => {
    filterNgos()
  }, [ngos, searchTerm, selectedCity, selectedCategory])

  const fetchNgos = async () => {
    try {
      const response = await axios.get('/api/ngos/approved')
      setNgos(response.data)
    } catch (error) {
      console.error('Error fetching NGOs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterNgos = () => {
    let filtered = [...ngos]

    if (searchTerm) {
      filtered = filtered.filter(ngo =>
        ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCity) {
      filtered = filtered.filter(ngo =>
        ngo.address.city.toLowerCase().includes(selectedCity.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(ngo =>
        ngo.rescueCategories.includes(selectedCategory) ||
        ngo.rescueCategories.includes('All Animals')
      )
    }

    setFilteredNgos(filtered)
  }

  const cities = [...new Set(ngos.map(ngo => ngo.address?.city).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Partner NGOs</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover verified animal welfare organizations in your area ready to help animals in need
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filter NGOs</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search NGOs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-field"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animal Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredNgos.length} of {ngos.length} NGOs
          </p>
        </div>

        {/* NGO Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNgos.map((ngo) => (
            <div key={ngo._id} className="card hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {ngo.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{ngo.address?.city}, {ngo.address?.state}</span>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Verified
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  {ngo.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Rescue Categories:</h4>
                  <div className="flex flex-wrap gap-1">
                    {ngo.rescueCategories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{ngo.contactPhone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{ngo.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{ngo.serviceHours || '24/7 Emergency Response'}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Rescue Radius:</span> {ngo.rescueDistance} km
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Cases Handled:</span> {ngo.casesHandled || 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNgos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <MapPin className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No NGOs Found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms to find NGOs in your area.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NGOListing