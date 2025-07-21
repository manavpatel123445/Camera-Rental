import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import ProductShowcase from '../3D/ProductShowcase';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  splineUrl?: string;
  fallbackImage?: string;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  splineUrl,
  fallbackImage,
  className
}) => {
  return (
    <div className={cn(
      "relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      {/* 3D Model Background */}
      {splineUrl && (
        <div className="absolute inset-0 opacity-20">
          <ProductShowcase
            splineUrl={splineUrl}
            fallbackImage={fallbackImage}
            className="w-full h-full"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-4">
              {subtitle}
            </h2>
            {description && (
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                {description}
              </p>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {primaryAction && (
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={primaryAction.onClick}
                  className="text-lg px-8 py-4"
                >
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={secondaryAction.onClick}
                  className="text-lg px-8 py-4"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          </div>
          
          {/* 3D Model Showcase */}
          <div className="relative">
            {splineUrl ? (
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <ProductShowcase
                  splineUrl={splineUrl}
                  fallbackImage={fallbackImage}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-700">Professional Camera Equipment</p>
                  <p className="text-sm text-gray-500 mt-2">High-quality gear for your creative projects</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 