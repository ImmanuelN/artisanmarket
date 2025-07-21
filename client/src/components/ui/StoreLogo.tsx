import React from 'react';
import { Building } from 'lucide-react';

interface StoreLogoProps {
  src?: string | null;
  className?: string;
  sizeClass?: string;
}

const StoreLogo: React.FC<StoreLogoProps> = ({ src, className = '', sizeClass = 'w-24 h-24' }) => (
  <div className={`${sizeClass} bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden border-4 border-white ${className}`}>
    {src ? (
      <img src={src} alt="Store Logo" className="w-full h-full object-cover object-center" />
    ) : (
      <span className="text-4xl font-bold text-amber-400 flex items-center justify-center">
        <Building className="w-1/2 h-1/2" />
      </span>
    )}
  </div>
);

export default StoreLogo; 