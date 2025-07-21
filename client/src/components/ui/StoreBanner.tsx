import React from 'react';

interface StoreBannerProps {
  src?: string | null;
  height?: string;
  className?: string;
}

const StoreBanner: React.FC<StoreBannerProps> = ({ src, height = 'h-56 md:h-72', className = '' }) => (
  <div className={`relative w-full ${height} bg-gray-200 ${className}`}>
    {src ? (
      <img
        src={src}
        alt="Store Banner"
        className="w-full h-full object-cover object-center shadow-md"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-amber-200 to-orange-200 shadow-md">
        <span className="text-3xl text-amber-400 font-bold">No Banner</span>
      </div>
    )}
  </div>
);

export default StoreBanner; 