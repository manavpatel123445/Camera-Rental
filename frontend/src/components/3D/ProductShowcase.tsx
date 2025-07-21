import React, { useEffect, useRef, Suspense } from 'react';
import { cn } from '../../utils/cn';
import Spline from '@splinetool/react-spline';

interface ProductShowcaseProps {
  className?: string;
  splineUrl?: string;
  fallbackImage?: string;
  productName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  className,
  splineUrl,
  fallbackImage,
  productName,
  onLoad,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  useEffect(() => {
    if (!splineUrl) {
      setIsLoading(false);
    }
  }, [splineUrl]);

  if (hasError && fallbackImage) {
    return (
      <div className={cn("relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden", className)}>
        <img
          src={fallbackImage}
          alt={productName || 'Product'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <p className="text-white text-sm">3D Model unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden", className)}>
      {splineUrl ? (
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Loading 3D Model...</p>
            </div>
          </div>
        }>
          <Spline
            scene={splineUrl}
            onLoad={() => {
              setIsLoading(false);
              onLoad?.();
            }}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
              onError?.();
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      ) : fallbackImage ? (
        <img
          src={fallbackImage}
          alt={productName || 'Product'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No 3D model available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductShowcase; 