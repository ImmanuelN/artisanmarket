import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import {
  BuildingStorefrontIcon,
  PhotoIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckIcon,
  CameraIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { AppDispatch } from '../../store/store'
import { updateUser } from '../../store/slices/authSlice'
import { Container, Card, Button, Input } from '../ui'
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications'
import api from '../../utils/api'
import StoreLogo from '../ui/StoreLogo'
import StoreBanner from '../ui/StoreBanner'

interface OnboardingData {
  storeName: string
  slogan: string
  storeDescription: string
  logo: string
  banner: string
  contact: {
    phone: string
    website: string
  }
  business: {
    address: {
      city: string
    }
  }
}

interface VendorOnboardingProps {
  onComplete: () => void
}

const VendorOnboarding: React.FC<VendorOnboardingProps> = ({ onComplete }) => {
  const dispatch = useDispatch<AppDispatch>()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<{ logo: boolean; banner: boolean }>({ 
    logo: false, 
    banner: false 
  })
  
  const [formData, setFormData] = useState<OnboardingData>({
    storeName: '',
    slogan: '',
    storeDescription: '',
    logo: '',
    banner: '',
    contact: {
      phone: '',
      website: ''
    },
    business: {
      address: {
        city: ''
      }
    }
  })

  const steps = [
    {
      id: 1,
      title: 'Store Information',
      description: 'Tell us about your store',
      icon: BuildingStorefrontIcon
    },
    {
      id: 2,
      title: 'Store Appearance',
      description: 'Upload your logo and banner',
      icon: PhotoIcon
    },
    {
      id: 3,
      title: 'Contact Details',
      description: 'How customers can reach you',
      icon: EnvelopeIcon
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const keys = name.split('.')

    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      let temp = newData
      for (let i = 0; i < keys.length - 1; i++) {
        temp[keys[i]] = temp[keys[i]] || {}
        temp = temp[keys[i]]
      }
      temp[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setUploading(prev => ({ ...prev, [name]: true }))

      // Instant preview
      const reader = new FileReader()
      reader.onload = (ev) => {
        setFormData(prev => ({ ...prev, [name]: ev.target?.result as string }))
      }
      reader.readAsDataURL(files[0])

      try {
        const authResponse = await fetch('/api/upload/imagekit-auth', {
          method: 'POST',
        })

        if (!authResponse.ok) {
          throw new Error(`Auth request failed with status: ${authResponse.status}`)
        }

        const authParams = await authResponse.json()

        // Import ImageKit dynamically to avoid SSR issues
        const { default: ImageKit } = await import('imagekit-javascript')
        
        const imagekit = new ImageKit({
          publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
          urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
        })

        imagekit.upload(
          {
            file: files[0],
            fileName: files[0].name,
            tags: [name],
            ...authParams,
          },
          (err: any, result: any) => {
            setUploading(prev => ({ ...prev, [name]: false }))
            if (err) {
              console.error('ImageKit upload error:', err)
              showErrorNotification('Image upload failed.')
            } else if (result) {
              setFormData(prev => ({ ...prev, [name]: result.url }))
              showSuccessNotification('Image uploaded successfully!')
            }
          }
        )
      } catch (error) {
        console.error('Image upload error:', error)
        setUploading(prev => ({ ...prev, [name]: false }))
        showErrorNotification('Upload failed. Please try again.')
      }
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Save vendor profile
      const response = await api.put('/vendors/profile', formData)
      if (response.data.success) {
        // Complete onboarding
        const onboardingResponse = await api.post('/vendors/complete-onboarding')
        if (onboardingResponse.data.success) {
          // Update user state
          dispatch(updateUser({ onboardingComplete: true }))
          showSuccessNotification('Welcome to Artisan Market! Your store is now live.')
          onComplete()
        }
      }
    } catch (error: any) {
      console.error('Onboarding error:', error)
      showErrorNotification(error.response?.data?.message || 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.storeName.trim() && formData.storeDescription.trim()
      case 2:
        return true // Images are optional
      case 3:
        return true // Contact details are optional
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Artisan Market!
            </h1>
            <p className="text-xl text-gray-600">
              Let's set up your store and get you started selling your amazing products.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-full border-2 flex items-center justify-center
                      ${currentStep > step.id ? 'bg-green-500 border-green-500 text-white' :
                        currentStep === step.id ? 'bg-amber-500 border-amber-500 text-white' :
                        'bg-white border-gray-300 text-gray-400'}
                    `}>
                      {currentStep > step.id ? (
                        <CheckIcon className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-24 h-1 mx-4 rounded
                      ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <Card.Content className="p-8">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Store Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Tell us about your store
                      </h2>
                      <p className="text-gray-600">
                        This information will help customers discover and connect with your brand.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Store Name *
                        </label>
                        <Input
                          name="storeName"
                          value={formData.storeName}
                          onChange={handleInputChange}
                          placeholder="Enter your store name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Store Slogan
                        </label>
                        <Input
                          name="slogan"
                          value={formData.slogan}
                          onChange={handleInputChange}
                          placeholder="A catchy tagline for your store (optional)"
                          maxLength={200}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This will be displayed prominently on your store page
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Store Description *
                        </label>
                        <textarea
                          name="storeDescription"
                          value={formData.storeDescription}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Describe what makes your store special, what you sell, and your story..."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <Input
                          name="business.address.city"
                          value={formData.business.address.city}
                          onChange={handleInputChange}
                          placeholder="City, State"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Store Appearance */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Make your store stand out
                      </h2>
                      <p className="text-gray-600">
                        Upload a logo and banner to give your store a professional look.
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* Preview */}
                      <div className="relative w-full mb-6 flex flex-col items-center">
                        <StoreBanner src={formData.banner} height="h-32 md:h-48 w-full" />
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2 z-10">
                          <StoreLogo src={formData.logo} />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mt-12">
                        <div className="flex flex-col items-center">
                          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                            Store Logo
                          </label>
                          <div className="flex items-center gap-2 justify-center">
                            <input
                              type="file"
                              name="logo"
                              accept="image/*"
                              id="logo-upload"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-lg shadow hover:bg-amber-200 focus:outline-none"
                              onClick={() => document.getElementById('logo-upload')?.click()}
                              disabled={uploading.logo}
                            >
                              {uploading.logo ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-700 mr-2"></div>
                              ) : (
                                <CameraIcon className="w-5 h-5 mr-2" />
                              )}
                              Upload Logo
                            </button>
                            {formData.logo && (
                              <button
                                type="button"
                                className="inline-flex items-center px-2 py-2 bg-red-100 text-red-600 rounded-lg shadow hover:bg-red-200 focus:outline-none"
                                onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                            Store Banner
                          </label>
                          <div className="flex items-center gap-2 justify-center">
                            <input
                              type="file"
                              name="banner"
                              accept="image/*"
                              id="banner-upload"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-lg shadow hover:bg-amber-200 focus:outline-none"
                              onClick={() => document.getElementById('banner-upload')?.click()}
                              disabled={uploading.banner}
                            >
                              {uploading.banner ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-700 mr-2"></div>
                              ) : (
                                <CameraIcon className="w-5 h-5 mr-2" />
                              )}
                              Upload Banner
                            </button>
                            {formData.banner && (
                              <button
                                type="button"
                                className="inline-flex items-center px-2 py-2 bg-red-100 text-red-600 rounded-lg shadow hover:bg-red-200 focus:outline-none"
                                onClick={() => setFormData(prev => ({ ...prev, banner: '' }))}
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        How can customers reach you?
                      </h2>
                      <p className="text-gray-600">
                        Provide contact information to build trust with your customers.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <PhoneIcon className="w-4 h-4 inline mr-1" />
                          Phone Number
                        </label>
                        <Input
                          name="contact.phone"
                          value={formData.contact.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <GlobeAltIcon className="w-4 h-4 inline mr-1" />
                          Website
                        </label>
                        <Input
                          name="contact.website"
                          value={formData.contact.website}
                          onChange={handleInputChange}
                          placeholder="https://yourstore.com"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        🎉 You're almost ready!
                      </h3>
                      <p className="text-blue-700">
                        Click "Complete Setup" to finish creating your store and start selling on Artisan Market.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? 'invisible' : ''}
                >
                  Back
                </Button>

                <div className="flex space-x-3">
                  {currentStep < steps.length ? (
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid(currentStep)}
                      className="min-w-[120px]"
                    >
                      Next
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || uploading.logo || uploading.banner}
                      className="min-w-[120px]"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Setting up...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <CheckIcon className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default VendorOnboarding
