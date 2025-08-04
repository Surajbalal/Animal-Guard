import { Link } from 'react-router-dom'
import { Heart, Shield, Users, MapPin, Phone, Clock } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Report Animal Cruelty',
      description: 'Quickly report incidents of animal cruelty or injured animals with precise location data.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'NGO Network',
      description: 'Connect with verified NGOs in your area who are ready to help animals in need.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Community Driven',
      description: 'Join a community of animal lovers working together to protect vulnerable animals.'
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Location-Based Matching',
      description: 'Our smart system matches reports with the nearest available NGOs for faster response.'
    }
  ]

  const stats = [
    { number: '5,000+', label: 'Animals Rescued' },
    { number: '200+', label: 'Partner NGOs' },
    { number: '15+', label: 'Cities Covered' },
    { number: '24/7', label: 'Support Available' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Every Animal Deserves 
              <span className="text-primary-200"> Protection</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-slide-up">
              Report animal cruelty incidents and connect with local NGOs for immediate rescue and care. 
              Together, we can make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to="/report"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors shadow-lg"
              >
                Report an Incident
              </Link>
              <Link
                to="/ngos"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Find NGOs Near You
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How AnimalGuard Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform connects compassionate individuals with dedicated NGOs to ensure rapid response to animal welfare emergencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-16 bg-red-50 border-l-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-red-800 mb-2 flex items-center">
                <Phone className="h-6 w-6 mr-2" />
                Emergency Animal Rescue
              </h3>
              <p className="text-red-700">
                If you witness severe animal cruelty or an animal in immediate danger, report it now!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/report"
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center"
              >
                <Clock className="h-5 w-5 mr-2" />
                Report Now
              </Link>
              <Link
                to="/tracker"
                className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors"
              >
                Track Your Report
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-600 to-secondary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Movement to Protect Animals
          </h2>
          <p className="text-xl mb-8 text-secondary-100 max-w-2xl mx-auto">
            Whether you're an individual who cares about animal welfare or an NGO ready to make a difference, 
            AnimalGuard provides the tools you need to save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/ngo/register"
              className="bg-white text-secondary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-50 transition-colors"
            >
              Register Your NGO
            </Link>
            <Link
              to="/report"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-secondary-600 transition-colors"
            >
              Make a Report
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home