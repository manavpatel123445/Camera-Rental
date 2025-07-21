# Modern UI Components & 3D Integration

This document explains how to use the new modern UI components and 3D integration features in your camera rental application.

## 🎨 Modern UI Components

### Button Component
A versatile button component with multiple variants and states.

```tsx
import { Button } from './components/ui';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="gradient" size="lg" loading={true}>
  Loading...
</Button>

// Available variants: default, destructive, outline, secondary, ghost, link, gradient
// Available sizes: default, sm, lg, icon
```

### Card Component
Modern card layout with header, content, and footer sections.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input Component
Enhanced input field with icon support and error states.

```tsx
import { Input } from './components/ui';
import { FaSearch } from 'react-icons/fa';

<Input
  type="text"
  placeholder="Search..."
  leftIcon={<FaSearch />}
  error={hasError}
/>
```

### ProductCard Component
Complete product display card with 3D model support.

```tsx
import { ProductCard } from './components/ui';

<ProductCard
  product={{
    id: '1',
    name: 'Canon EOS R5',
    category: 'Camera',
    pricePerDay: 150,
    description: 'Professional mirrorless camera',
    imageUrl: 'https://example.com/image.jpg',
    splineUrl: 'https://spline.design/your-3d-model',
    quantity: 3
  }}
  onRent={(productId) => console.log('Renting:', productId)}
  onView={(productId) => console.log('Viewing:', productId)}
/>
```

### HeroSection Component
Full-screen hero section with 3D model background.

```tsx
import { HeroSection } from './components/ui';

<HeroSection
  title="Professional Camera Rental"
  subtitle="High-quality equipment for your creative projects"
  description="Rent professional cameras, lenses, and equipment"
  primaryAction={{
    label: "Browse Equipment",
    onClick: () => console.log('Browse clicked')
  }}
  secondaryAction={{
    label: "Learn More",
    onClick: () => console.log('Learn more clicked')
  }}
  splineUrl="https://spline.design/your-hero-model"
/>
```

## 🎮 3D Integration with Spline

### ProductShowcase Component
Displays 3D models from Spline with fallback to images.

```tsx
import { ProductShowcase } from './components/3D/ProductShowcase';

<ProductShowcase
  splineUrl="https://spline.design/your-3d-model"
  fallbackImage="https://example.com/fallback.jpg"
  productName="Camera Model"
  onLoad={() => console.log('3D model loaded')}
  onError={() => console.log('3D model failed to load')}
/>
```

### Setting up Spline Integration

1. **Create 3D Models in Spline**
   - Go to [Spline Design](https://spline.design)
   - Create your 3D camera models
   - Export and get the scene URL

2. **Add Spline URLs to Products**
   ```tsx
   // In your product data
   const product = {
     name: 'Canon EOS R5',
     splineUrl: 'https://spline.design/your-camera-model',
     // ... other properties
   };
   ```

3. **Update AddProduct Form**
   The form now includes a field for Spline URLs:
   ```tsx
   <Input
     type="text"
     name="splineUrl"
     placeholder="https://spline.design/your-3d-model"
     leftIcon={<FaImage />}
   />
   ```

## 🚀 Usage Examples

### Complete Product Listing Page
```tsx
import React, { useState } from 'react';
import { ProductCard, Input, Button } from './components/ui';
import { FaSearch } from 'react-icons/fa';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([/* your products */]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<FaSearch />}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onRent={(id) => handleRent(id)}
            onView={(id) => handleView(id)}
          />
        ))}
      </div>
    </div>
  );
};
```

### Landing Page with 3D Hero
```tsx
import React from 'react';
import { HeroSection } from './components/ui';

const LandingPage = () => {
  return (
    <div>
      <HeroSection
        title="Professional Camera Rental"
        subtitle="High-quality equipment for your creative projects"
        description="Rent professional cameras, lenses, and equipment for photography and videography projects."
        primaryAction={{
          label: "Browse Equipment",
          onClick: () => navigate('/products')
        }}
        secondaryAction={{
          label: "Learn More",
          onClick: () => navigate('/about')
        }}
        splineUrl="https://spline.design/your-hero-camera-model"
      />
      
      {/* Rest of your landing page content */}
    </div>
  );
};
```

## 🎯 Best Practices

### 3D Model Optimization
1. **Keep models lightweight** - Optimize polygon count for web
2. **Use appropriate textures** - Compress textures for faster loading
3. **Test on different devices** - Ensure performance on mobile devices
4. **Provide fallback images** - Always have a 2D image as backup

### Component Styling
1. **Use Tailwind classes** - All components are built with Tailwind CSS
2. **Customize with className** - Pass custom classes for specific styling
3. **Maintain consistency** - Use the same color scheme and spacing
4. **Responsive design** - Components are mobile-first and responsive

### Performance Tips
1. **Lazy load 3D models** - Only load when needed
2. **Use Suspense boundaries** - Wrap 3D components in Suspense
3. **Optimize images** - Use WebP format and appropriate sizes
4. **Cache components** - Use React.memo for expensive components

## 🔧 Customization

### Adding New Button Variants
```tsx
// In Button.tsx, add to buttonVariants
variants: {
  variant: {
    // ... existing variants
    custom: "bg-custom-color text-white hover:bg-custom-color-dark",
  },
}
```

### Customizing Card Styles
```tsx
<Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
  <CardContent>
    Custom styled card
  </CardContent>
</Card>
```

### Extending ProductShowcase
```tsx
// Add new props to ProductShowcaseProps interface
interface ProductShowcaseProps {
  // ... existing props
  customControls?: boolean;
  autoRotate?: boolean;
}
```

## 📚 Resources

- [React Components Library](http://reactcomponents.com) - Inspiration for UI components
- [Spline Design](https://spline.design) - 3D model creation platform
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## 🐛 Troubleshooting

### 3D Model Not Loading
1. Check if the Spline URL is correct
2. Ensure the model is published and accessible
3. Check browser console for errors
4. Verify network connectivity

### Component Styling Issues
1. Check if Tailwind CSS is properly configured
2. Verify className props are being passed correctly
3. Check for CSS conflicts with existing styles
4. Ensure responsive classes are applied correctly

### Performance Issues
1. Optimize 3D model file sizes
2. Use lazy loading for non-critical components
3. Implement proper error boundaries
4. Monitor bundle size and optimize imports 