import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Heart, Mail, Lock, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
// import MapComponent from '../components/maps/MapComponent';Z
// import LoadingSpinner from '../components/common/LoadingSpinner';

const NGORegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const watchPassword = watch('password');

  const categories = [
    'Dogs', 'Cats', 'Farm Animals', 'Wildlife', 'Birds', 'Reptiles', 'All Animals'
  ];

  const distanceOptions = [
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 15, label: '15 km' },
    { value: 20, label: '20 km' },
    { value: 30, label: '30 km' },
    { value: 50, label: '50 km' }
  ];

  const onSubmit = async (data) => {
    if (!location) {
      toast.error('Please select your NGO location on the map');
      return;
    }

    setIsLoading(true);

    const registrationData = {
      ...data,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      rescueCategories: data.rescueCategories || [],
      status: 'pending' // For admin approval
    };

    try {
      const response = await axios.post(
        `${process.env.VITE_API_BASE_URL}/api/ngo/register`,
        registrationData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        toast.success('Registration submitted successfully! Your application is under review.');
        navigate('/ngo/login');
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Input field classes
  const inputClasses = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6";
  const errorClasses = "mt-1 text-sm text-red-600";
  const buttonPrimary = "rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600";
  const buttonSecondary = "rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="bg-primary-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Heart className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Register Your NGO</h2>
          <p className="mt-2 text-gray-600">
            Join our network of verified animal welfare organizations
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? 'bg-primary-600 text-white' : 'bg-gray-200'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-8 h-0.5 ${step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span className={`${step >= 1 ? 'text-primary-600 font-medium' : ''}`}>Basic Info</span>
            <span className={`${step >= 2 ? 'text-primary-600 font-medium' : ''}`}>Services</span>
            <span className={`${step >= 3 ? 'text-primary-600 font-medium' : ''}`}>Location</span>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NGO Name *
                    </label>
                    <input
                      {...register('name', { required: 'NGO name is required' })}
                      type="text"
                      className={inputClasses}
                      placeholder="Enter your NGO name"
                    />
                    {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        className={`${inputClasses} pl-10`}
                        placeholder="ngo@example.com"
                      />
                    </div>
                    {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('contactPhone', { required: 'Phone number is required' })}
                        type="tel"
                        className={`${inputClasses} pl-10`}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    {errors.contactPhone && <p className={errorClasses}>{errors.contactPhone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className={`${inputClasses} pl-10 pr-10`}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className={errorClasses}>{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === watchPassword || 'Passwords do not match'
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`${inputClasses} pl-10 pr-10`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className={errorClasses}>{errors.confirmPassword.message}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register('description', { 
                        required: 'Description is required',
                        minLength: { value: 50, message: 'Description must be at least 50 characters' }
                      })}
                      rows={4}
                      className={inputClasses}
                      placeholder="Describe your NGO's mission, experience, and services..."
                    />
                    {errors.description && <p className={errorClasses}>{errors.description.message}</p>}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={nextStep} className={buttonPrimary}>
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Services */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Services & Capacity</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Rescue Categories *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            value={category}
                            {...register('rescueCategories', { required: 'Select at least one category' })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                    {errors.rescueCategories && <p className={errorClasses}>{errors.rescueCategories.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rescue Distance Radius *
                    </label>
                    <select
                      {...register('rescueDistance', { required: 'Rescue distance is required' })}
                      className={inputClasses}
                    >
                      <option value="">Select rescue distance</option>
                      {distanceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.rescueDistance && <p className={errorClasses}>{errors.rescueDistance.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Hours
                    </label>
                    <input
                      {...register('serviceHours')}
                      type="text"
                      className={inputClasses}
                      placeholder="e.g., 24/7, Mon-Fri 9AM-6PM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number (Optional)
                    </label>
                    <input
                      {...register('registrationNumber')}
                      type="text"
                      className={inputClasses}
                      placeholder="Your NGO registration number"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className={buttonSecondary}>
                    Previous
                  </button>
                  <button type="button" onClick={nextStep} className={buttonPrimary}>
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Address & Location</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      {...register('address.street', { required: 'Street address is required' })}
                      type="text"
                      className={inputClasses}
                      placeholder="Enter street address"
                    />
                    {errors.address?.street && <p className={errorClasses}>{errors.address.street.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      {...register('address.city', { required: 'City is required' })}
                      type="text"
                      className={inputClasses}
                      placeholder="Enter city"
                    />
                    {errors.address?.city && <p className={errorClasses}>{errors.address.city.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      {...register('address.state', { required: 'State is required' })}
                      type="text"
                      className={inputClasses}
                      placeholder="Enter state"
                    />
                    {errors.address?.state && <p className={errorClasses}>{errors.address.state.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      {...register('address.postalCode', { required: 'Postal code is required' })}
                      type="text"
                      className={inputClasses}
                      placeholder="Enter postal code"
                    />
                    {errors.address?.postalCode && <p className={errorClasses}>{errors.address.postalCode.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      {...register('address.country', { required: 'Country is required' })}
                      type="text"
                      className={inputClasses}
                      placeholder="Enter country"
                    />
                    {errors.address?.country && <p className={errorClasses}>{errors.address.country.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pin Your Location *
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Click on the map to mark your NGO's exact location
                  </p>
                  <MapComponent
                    onLocationSelect={setLocation}
                    height="400px"
                    interactive={true}
                  />
                  {!location && <p className={errorClasses}>Please select your location on the map</p>}
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className={buttonSecondary}>
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`${buttonPrimary} flex items-center space-x-2`}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Registration</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/ngo/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NGORegister;