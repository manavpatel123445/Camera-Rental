import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import ProductShowcase from '../3D/ProductShowcase';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    category: string;
    pricePerDay: number;
    description?: string;
    imageUrl?: string;
    splineUrl?: string;
    quantity: number;
  };
  onRent?: (productId: string) => void;
  onView?: (productId: string) => void;
  className?: string;
  loading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onRent,
  onView,
  className,
  loading = false
}) => {
  return (
    <div className={cn(
      "group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300",
      className
    )}>
      {/* 3D Model or Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 rounded-t-xl flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <ProductShowcase
            splineUrl={product.splineUrl}
            fallbackImage={product.imageUrl}
            productName={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 left-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {product.category}
        </span>
      </div>
      
      {/* Quantity Badge */}
      <div className="absolute top-3 right-3">
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          product.quantity > 0 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        )}>
          {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              ${product.pricePerDay}
            </span>
            <span className="text-sm text-gray-500 ml-1">/day</span>
          </div>
          
          <div className="flex gap-2">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(product.id)}
              >
                View
              </Button>
            )}
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              variant="gradient"
              size="sm"
              onClick={() => onRent ? onRent(product.id) : null}
              disabled={product.quantity <= 0}
            >
              Rent Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 