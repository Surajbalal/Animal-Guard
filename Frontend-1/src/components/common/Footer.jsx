import { Heart, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">AnimalGuard</span>
            </div>
            <p className="text-gray-300 mb-4">
              Connecting communities with NGOs to ensure every animal receives the care and protection they deserve. 
              Together, we can make a difference in animal welfare.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/report" className="text-gray-300 hover:text-white transition-colors">Report Incident</a></li>
              <li><a href="/ngos" className="text-gray-300 hover:text-white transition-colors">Find NGOs</a></li>
              <li><a href="/tracker" className="text-gray-300 hover:text-white transition-colors">Track Reports</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For NGOs</h3>
            <ul className="space-y-2">
              <li><a href="/ngo/register" className="text-gray-300 hover:text-white transition-colors">Register NGO</a></li>
              <li><a href="/ngo/login" className="text-gray-300 hover:text-white transition-colors">NGO Login</a></li>
              <li><a href="/ngo/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 AnimalGuard. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-gray-300 text-sm mt-4 md:mt-0">
            <MapPin className="h-4 w-4" />
            <span>Serving communities worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer