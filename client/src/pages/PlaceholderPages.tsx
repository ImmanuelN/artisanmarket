// Create placeholder pages for development
const placeholderPages = [
  'Checkout',
  'About',
  'Contact',
  'Profile',
  'VendorDashboard',
  'AdminDashboard'
]

const createPlaceholderPage = (name: string) => {
  const Component = () => {
    return (
      <div className="min-h-screen py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{name}</h1>
          <p className="text-gray-600">{name} page coming soon...</p>
        </div>
      </div>
    )
  }
  
  Component.displayName = name
  return Component
}

export const Checkout = createPlaceholderPage('Checkout')
export const About = createPlaceholderPage('About')
export const Contact = createPlaceholderPage('Contact')
export const Profile = createPlaceholderPage('Profile')
export const VendorDashboard = createPlaceholderPage('Vendor Dashboard')
export const AdminDashboard = createPlaceholderPage('Admin Dashboard')
