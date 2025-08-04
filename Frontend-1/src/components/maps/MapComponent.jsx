import { useState, useCallback, useRef, useEffect } from 'react'
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl'
import { MapPin } from 'lucide-react'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

const MapComponent = ({ 
  onLocationSelect, 
  initialLocation = { latitude: 20.5937, longitude: 78.9629 }, // India center
  markers = [],
  height = '400px',
  interactive = true 
}) => {
  const [viewState, setViewState] = useState({
    longitude: initialLocation.longitude,
    latitude: initialLocation.latitude,
    zoom: 5
  })
  const [selectedLocation, setSelectedLocation] = useState(null)
  const mapRef = useRef()

  // useEffect(() => {
  //   if (initialLocation.latitude && initialLocation.longitude) {
  //     setViewState(prev => ({
  //       ...prev,
  //       longitude: initialLocation.longitude,
  //       latitude: initialLocation.latitude,
  //       zoom: 12
  //     }))
  //     setSelectedLocation(initialLocation)
  //   }
  // }, [initialLocation])

  const onMapClick = useCallback((event) => {
    if (!interactive) return
    
    const { lng, lat } = event.lngLat
    const location = { latitude: lat, longitude: lng }
    
    setSelectedLocation(location)
    if (onLocationSelect) {
      onLocationSelect(location)
    }
  }, [onLocationSelect, interactive])

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          
          setViewState(prev => ({
            ...prev,
            ...location,
            zoom: 12
          }))
          setSelectedLocation(location)
          
          if (onLocationSelect) {
            onLocationSelect(location)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [onLocationSelect])

  return (
    <div className="relative">
      <div style={{ height }} className="rounded-lg overflow-hidden border border-gray-200">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={onMapClick}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          <NavigationControl position="top-right" />
          
          {interactive && (
            <GeolocateControl
              position="top-right"
              trackUserLocation={true}
              onGeolocate={(e) => {
                const location = {
                  latitude: e.coords.latitude,
                  longitude: e.coords.longitude
                }
                setSelectedLocation(location)
                if (onLocationSelect) {
                  onLocationSelect(location)
                }
              }}
            />
          )}

          {selectedLocation && (
            <Marker
              longitude={selectedLocation.longitude}
              latitude={selectedLocation.latitude}
              anchor="bottom"
            >
              <div className="bg-red-500 p-2 rounded-full shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </Marker>
          )}

          {markers.map((marker, index) => (
            <Marker
              key={index}
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor="bottom"
            >
              <div className="bg-primary-500 p-2 rounded-full shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </Marker>
          ))}
        </Map>
      </div>

      {interactive && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={getCurrentLocation}
            className="btn-secondary text-sm"
          >
            Use Current Location
          </button>
          
          {selectedLocation && (
            <div className="text-sm text-gray-600">
              Selected: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MapComponent