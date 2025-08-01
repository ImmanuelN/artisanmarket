import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import VendorOnboarding from './VendorOnboarding'

interface OnboardingGuardProps {
  children: React.ReactNode
}

const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth)

  // Show onboarding for vendors who haven't completed it
  if (user?.role === 'vendor' && !user?.onboardingComplete) {
    return (
      <VendorOnboarding 
        onComplete={() => {
          // The onboarding component handles the completion,
          // the auth state will be updated automatically
          window.location.reload()
        }} 
      />
    )
  }

  // For completed vendors and other users, show normal content
  return <>{children}</>
}

export default OnboardingGuard
