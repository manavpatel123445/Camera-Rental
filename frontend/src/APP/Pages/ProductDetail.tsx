/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import CommonNavbar from '../../components/ui/CommonNavbar';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';
import Footer from '../../components/ui/Footer';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://camera-rental-ndr0.onrender.com/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        
        // Fetch related products
        const relatedRes = await fetch(`https://camera-rental-ndr0.onrender.com/api/products?category=${data.category}&limit=4`);
        const relatedData = await relatedRes.json();
        setRelatedProducts(relatedData.filter((p: any) => p._id !== id));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
    
    // Initialize dates from localStorage with better validation
    const initializeDates = () => {
      const storedPickup = localStorage.getItem('pickupDate');
      const storedDropoff = localStorage.getItem('dropoffDate');
      const today = new Date().toISOString().split('T')[0];
      
      // Set pickup date (use stored or default to today)
      if (storedPickup && storedPickup >= today) {
        setPickupDate(storedPickup);
      } else {
        setPickupDate(today);
        localStorage.setItem('pickupDate', today);
      }
      
      // Set dropoff date (use stored or default to tomorrow)
      if (storedDropoff && storedDropoff > (storedPickup || today)) {
        setDropoffDate(storedDropoff);
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        setDropoffDate(tomorrowStr);
        localStorage.setItem('dropoffDate', tomorrowStr);
      }
    };
    
    initializeDates();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-red-400">Product not found.</div>;

  // Example discount logic
  const originalPrice = product.originalPrice || (product.pricePerDay ? Math.round(product.pricePerDay * 1.6) : 0);
  const discount = product.pricePerDay && originalPrice ? Math.round(100 - (product.pricePerDay / originalPrice) * 100) : 0;

  const handleAddToCart = async () => {
    if (!pickupDate || !dropoffDate) {
      alert('Please select pickup and drop-off dates.');
      return;
    }
    
    try {
      // Validate stock availability
      const response = await fetch(`https://camera-rental-ndr0.onrender.com/api/products/${product._id}`);
      if (!response.ok) throw new Error('Failed to check stock');
      
      const currentProduct = await response.json();
      
      if (currentProduct.quantity <= 0) {
        alert('This product is currently out of stock.');
        return;
      }
      
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item: any) => item._id === product._id);
      const currentCartQuantity = existingItem ? existingItem.quantity : 0;
      
      if (currentCartQuantity >= currentProduct.quantity) {
        alert(`Cannot add more. Only ${currentProduct.quantity} ${currentProduct.quantity === 1 ? 'unit' : 'units'} available.`);
        return;
      }
      
      // Calculate rental days
      const days = Math.max(1, Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24)));
      dispatch(addToCart({
        _id: product._id,
        name: product.name,
        pricePerDay: product.pricePerDay,
        quantity: 1,
        image: product.image,
        rentalDays: days,
        pickupDate,
        dropoffDate,
      }));
      alert('Added to cart!');
    } catch (error) {
      console.error('Error checking stock:', error);
      alert('Unable to check stock availability. Please try again.');
    }
  };

  const handleRentNow = async () => {
    if (!pickupDate || !dropoffDate) {
      alert('Please select pickup and drop-off dates.');
      return;
    }
    
    try {
      // Validate stock availability
      const response = await fetch(`https://camera-rental-ndr0.onrender.com/api/products/${product._id}`);
      if (!response.ok) throw new Error('Failed to check stock');
      
      const currentProduct = await response.json();
      
      if (currentProduct.quantity <= 0) {
        alert('This product is currently out of stock.');
        return;
      }
      
      const days = Math.max(1, Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24)));
      
      dispatch(addToCart({
        _id: product._id,
        name: product.name,
        pricePerDay: product.pricePerDay,
        quantity: 1,
        image: product.image,
        rentalDays: days,
        pickupDate,
        dropoffDate,
      }));
      
      navigate('/checkout');
    } catch (error) {
      console.error('Error checking stock:', error);
      alert('Unable to check stock availability. Please try again.');
    }
  };

  // When date pickers change, save to localStorage
  const handlePickupDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPickupDate = e.target.value;
    setPickupDate(newPickupDate);
    localStorage.setItem('pickupDate', newPickupDate);
    
    // If dropoffDate is before new pickupDate, reset dropoffDate to pickupDate + 1 day
    if (dropoffDate && newPickupDate >= dropoffDate) {
      const newDropoffDate = new Date(newPickupDate);
      newDropoffDate.setDate(newDropoffDate.getDate() + 1);
      const newDropoffDateStr = newDropoffDate.toISOString().split('T')[0];
      setDropoffDate(newDropoffDateStr);
      localStorage.setItem('dropoffDate', newDropoffDateStr);
    }
  };
  
  const handleDropoffDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDropoffDate = e.target.value;
    setDropoffDate(newDropoffDate);
    localStorage.setItem('dropoffDate', newDropoffDate);
  };

  // Function to reset dates to default values
  // const resetDates = () => {
  //   const today = new Date().toISOString().split('T')[0];
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
  //   setPickupDate(today);
  //   setDropoffDate(tomorrowStr);
  //   localStorage.setItem('pickupDate', today);
  //   localStorage.setItem('dropoffDate', tomorrowStr);
  // };
  // Today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];

  // Mock specifications and features
  const specifications = [
    { label: 'Brand', value: product.brand || 'Professional' },
    { label: 'Model', value: product.name.split(' ').slice(-2).join(' ') || 'Standard' },
    { label: 'Resolution', value: '4K Ultra HD' },
    { label: 'Sensor Type', value: 'CMOS' },
    { label: 'Weight', value: '2.5 kg' },
    { label: 'Battery Life', value: '8 hours' },
  ];

  const features = [
    '4K Video Recording',
    'Image Stabilization',
    'WiFi Connectivity',
    'Touch Screen Display',
    'Weather Sealed',
    'Professional Audio Inputs',
    'Multiple Recording Formats',
    'Advanced Autofocus System'
  ];

  return (
    <div className="min-h-screen bg-[#181622] flex flex-col">
      <CommonNavbar />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex text-sm text-gray-400">
          <button onClick={() => navigate('/')} className="hover:text-purple-400">Home</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate(-1)} className="hover:text-purple-400">Products</button>
          <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </nav>
      </div>

      <div className="w-full  mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <div className=" rounded-2xl p-2 flex items-center justify-center">
              <img
                src={product.image?.startsWith('http') ? product.image : `https://camera-rental-ndr0.onrender.com/${product.image}`}
                alt={product.name}
                className="w-full max-w-md h-96 object-contain"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full font-semibold">
                  {product.category}
                </span>
                <span className={`px-3 py-1 text-white text-xs rounded-full font-semibold ${
                  product.quantity === 0 ? 'bg-red-600' :
                  product.quantity <= 5 ? 'bg-orange-600' :
                  'bg-green-600'
                }`}>
                  {product.quantity === 0 ? 'Out of Stock' :
                   product.quantity <= 5 ? `Only ${product.quantity} Left` :
                   'Available'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-gray-400 text-lg">{product.description}</p>
            </div>

            {/* Price Section */}
            <div className="bg-[#232136] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                {discount > 0 && (
                  <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full font-semibold">
                    -{discount}% OFF
                  </span>
                )}
                <span className="text-3xl font-bold text-white">${product.pricePerDay}</span>
                <span className="text-gray-400">/day</span>
                {originalPrice > product.pricePerDay && (
                  <span className="text-gray-400 line-through">${originalPrice}</span>
                )}
              </div>
              
              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">Pickup Date</label>
                  
                  <input 
                    type="date" 
                    className="w-full border border-gray-600 bg-[#1E293B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    value={pickupDate} 
                    onChange={handlePickupDateChange} 
                    min={today} 
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">Drop-off Date</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-600 bg-[#1E293B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    value={dropoffDate} 
                    onChange={handleDropoffDateChange} 
                    min={pickupDate || today} 
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {product.quantity === 0 ? (
                  <div className="text-center">
                    <p className="text-red-400 font-semibold mb-2">This product is currently out of stock</p>
                    <Button 
                      className="w-full bg-gray-600 text-gray-400 font-semibold py-3 px-6 rounded-lg text-lg cursor-not-allowed" 
                      disabled
                    >
                      🚀 Rent Now
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-lg" 
                    onClick={handleRentNow}
                  >
                    🚀 Rent Now
                  </Button>
                )}
                {product.quantity === 0 ? (
                  <Button 
                    className="w-full bg-[#1E293B] text-gray-400 font-semibold py-3 px-6 rounded-lg text-lg border border-gray-600 cursor-not-allowed" 
                    disabled
                  >
                    🛒 Add to Cart
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-[#1E293B] hover:bg-[#2D3748] text-white font-semibold py-3 px-6 rounded-lg text-lg border border-gray-600" 
                    onClick={handleAddToCart}
                  >
                    🛒 Add to Cart
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#232136] rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">📦</div>
                <div className="text-white font-semibold">Free Delivery</div>
                <div className="text-gray-400 text-sm">Within 24 hours</div>
              </div>
              <div className="bg-[#232136] rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">🛡️</div>
                <div className="text-white font-semibold">Insurance</div>
                <div className="text-gray-400 text-sm">Full coverage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              {[
                { id: 'details', label: 'Details', icon: '📋' },
                { id: 'specs', label: 'Specifications', icon: '⚙️' },
                { id: 'features', label: 'Features', icon: '✨' },
                { id: 'related', label: 'Related Products', icon: '🔗' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'details' && (
              <div className="bg-[#232136] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Product Details</h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">What's Included</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Camera Body</li>
                      <li>• Battery & Charger</li>
                      <li>• Memory Card</li>
                      <li>• Carrying Case</li>
                      <li>• User Manual</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Rental Terms</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Minimum 1 day rental</li>
                      <li>• Free pickup & delivery</li>
                      <li>• Full insurance coverage</li>
                      <li>• 24/7 support</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="bg-[#232136] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">{spec.label}</span>
                      <span className="text-white font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="bg-[#232136] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'related' && (
              <div className="bg-[#232136] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Related Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedProducts.slice(0, 4).map((relatedProduct) => (
                    <div key={relatedProduct._id} className="bg-[#1E293B] rounded-lg p-4 cursor-pointer hover:border-purple-500 border-2 border-transparent transition-colors">
                      <img
                        src={relatedProduct.image?.startsWith('http') ? relatedProduct.image : `https://camera-rental-ndr0.onrender.com/${relatedProduct.image}`}
                        alt={relatedProduct.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="text-white font-semibold text-sm mb-1">{relatedProduct.name}</h4>
                      <p className="text-purple-400 font-bold">₹{relatedProduct.pricePerDay}/day</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetail;