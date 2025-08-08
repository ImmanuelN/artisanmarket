import React, { useState } from 'react';
import logoNoBackground from '../../assets/logos/logo-no-background.svg';
import artisanMarketLogo from '../../assets/logos/logo-no-background.svg';

interface LogoProps {
  variant?: 'full' | 'small' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size = 'md', 
  className = '',
  showText = true 
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  // Use PNG logos as they're more reliable
  const getLogoSrc = () => {
    switch (variant) {
      case 'small':
      case 'icon':
        return artisanMarketLogo; // Use the main logo as icon
      default:
        return logoNoBackground || artisanMarketLogo;
    }
  };

  const logoSrc = getLogoSrc();

  const handleImageError = () => {
    setImageError(true);
  };

  // If it's icon variant or showText is false, and we have an image error, show a compact logo
  if ((variant === 'icon' || !showText) && imageError) {
    return (
      <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm ${className}`}>
        <span className="text-white font-bold text-lg">AM</span>
      </div>
    );
  }

  if (variant === 'icon' || !showText) {
    return (
      <div className={`flex items-center ${className}`}>
        {!imageError && (
          <img 
            src={logoSrc}
            alt="ArtisanMarket" 
            className={`${sizeClasses[size]} object-contain`}
            onError={handleImageError}
          />
        )}
        {imageError && (
          <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm`}>
            <span className="text-white font-bold text-lg">AM</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {!imageError && (
        <img 
          src={logoSrc}
          alt="ArtisanMarket" 
          className={`${sizeClasses[size]} object-contain`}
          onError={handleImageError}
        />
      )}
      {imageError && (
        <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm`}>
          <span className="text-white font-bold text-lg">AM</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
