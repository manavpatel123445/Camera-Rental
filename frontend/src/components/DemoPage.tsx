import React, { useState } from 'react';
import { 
  HeroSection, 
  ProductCard, 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Input 
} from './ui';
import { FaCamera, FaVideo, FaLightbulb } from 'react-icons/fa';

const DemoPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample products data
  const sampleProducts = [
    {
      id: '1',
      name: 'Canon EOS R5',
      category: 'Camera',
      pricePerDay: 150,
      description: 'Professional mirrorless camera with 45MP sensor and 8K video recording capabilities.',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      splineUrl: '', // Add your Spline URL here
      quantity: 3
    },
    {
      id: '2',
      name: 'Sony FE 24-70mm f/2.8 GM',
      category: 'Lens',
      pricePerDay: 80,
      description: 'Professional zoom lens with constant f/2.8 aperture for stunning portraits and landscapes.',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
      splineUrl: '', // Add your Spline URL here
      quantity: 2
    },
    {
      id: '3',
      name: 'DJI RS 3 Pro',
      category: 'Video Camera',
      pricePerDay: 120,
      description: 'Professional 3-axis gimbal stabilizer for smooth cinematic footage.',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      splineUrl: '', // Add your Spline URL here
      quantity: 1
    }
  ];

  const handleRent = (productId: string) => {
    console.log('Renting product:', productId);
    // Add your rental logic here
  };

  const handleView = (productId: string) => {
    console.log('Viewing product:', productId);
    // Add your view logic here
  };

  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection
        title="Professional Camera Rental"
        subtitle="High-quality equipment for your creative projects"
        description="Rent professional cameras, lenses, and equipment for photography and videography projects. Affordable daily rates with flexible rental periods."
        primaryAction={{
          label: "Browse Equipment",
          onClick: () => console.log('Browse clicked')
        }}
        secondaryAction={{
          label: "Learn More",
          onClick: () => console.log('Learn more clicked')
        }}
        // Add your Spline URL here for 3D hero model
        // splineUrl="https://spline.design/your-hero-model"
      />

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Your Perfect Equipment
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Search through our extensive collection of professional camera equipment
            </p>
          </div>
          
          <div className="max-w-md mx-auto mb-12">
            <Input
              type="text"
              placeholder="Search cameras, lenses, equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<FaCamera className="w-4 h-4" />}
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRent={handleRent}
                onView={handleView}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <FaCamera className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Rental Service?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional equipment, flexible rental periods, and excellent customer support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FaCamera className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Professional Equipment</CardTitle>
                <CardDescription>
                  High-quality cameras, lenses, and accessories from top brands
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FaVideo className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Flexible Rental</CardTitle>
                <CardDescription>
                  Daily, weekly, and monthly rental options to suit your needs
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FaLightbulb className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Expert Support</CardTitle>
                <CardDescription>
                  Technical support and guidance for your creative projects
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Browse our equipment and start creating amazing content today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={() => console.log('Get started clicked')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => console.log('Contact us clicked')}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage; 