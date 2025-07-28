import React from 'react';
import { Container, Button } from '../components/ui';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const createPlaceholderPage = (name: string) => {
  const Component = () => {
    const navigate = useNavigate();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
        <Container>
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-400">{name.charAt(0)}</span>
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">{name} Page</h3>
            <p className="text-gray-600 mb-6">This page is under construction and will be available soon.</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </Container>
      </div>
    );
  };
  
  return Component;
};

export const Help = createPlaceholderPage('Help Center');
export const Shipping = createPlaceholderPage('Shipping Info');
export const Returns = createPlaceholderPage('Returns');
export const FAQ = createPlaceholderPage('FAQ');
export const Privacy = createPlaceholderPage('Privacy Policy');
export const Terms = createPlaceholderPage('Terms of Service');
export const Cookies = createPlaceholderPage('Cookie Policy');
