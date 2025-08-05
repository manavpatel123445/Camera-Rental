import React, { useEffect, useState } from 'react';
import CommonNavbar from '../../components/ui/CommonNavbar';
import { Button } from '../../components/ui/Button';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';
import toast from 'react-hot-toast';
import CartModal from '../../components/ui/CartModal';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/ui/Footer';

interface Product {
  _id: string;
  name: string;
  image: string;
  pricePerDay?: number;
  rating?: number;
  description?: string;
  category: string;
  brand?: string;
  inStock?: boolean;
  quantity?: number;
  isPremium?: boolean;
  isPopular?: boolean;
}

const LensProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const dispatch = useDispatch();
  const [cartOpen, setCartOpen] = useState(false);
  const [showCartButton, setShowCartButton] = useState(false);
  const cart = useSelector((state: RootState) => state.cart.items);
  const cartTotal = cart.reduce((sum, item) => sum + (item.pricePerDay || 0) * item.quantity * (item.rentalDays || 1), 0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://camera-rental-ndr0.onrender.com/api/products');
        const data = await res.json();
        setProducts(data.filter((p: Product) => p.category?.toLowerCase().includes('lens')));
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowCartButton(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sortOptions = [
    { value: 'priceLowHigh', label: 'Price: Low to High' },
    { value: 'priceHighLow', label: 'Price: High to Low' },
    { value: 'nameAZ', label: 'Name: A-Z' },
    { value: 'nameZA', label: 'Name: Z-A' },
  ];

  let filteredProducts = products.filter(product =>
    (!searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  if (sortBy === 'priceLowHigh') filteredProducts = filteredProducts.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
  if (sortBy === 'priceHighLow') filteredProducts = filteredProducts.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
  if (sortBy === 'nameAZ') filteredProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'nameZA') filteredProducts = filteredProducts.sort((a, b) => b.name.localeCompare(a.name));

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      pricePerDay: product.pricePerDay,
      quantity: 1,
      image: product.image,
      rentalDays: 1,
    }));
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-[#181622] text-white">
      <CommonNavbar />
      <div className="max-w-7xl mx-auto py-10 px-4 gap-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search lenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                Filters
              </Button>
              {/* Only Price Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-white rounded px-3 py-1"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">
                {filteredProducts.length} lenses found
              </span>
              <div className="flex border border-slate-600 rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-slate-700' : ''}
                >
                  Grid
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-slate-700' : ''}
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Product Grid */}
        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Popular Lenses</h1>
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-400">No lenses found.</div>
          ) : (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {filteredProducts.slice(0, 8).map((product: any) => (
                  <div key={product._id} className="bg-[#1E293B] rounded-2xl shadow p-6 flex flex-col items-start">
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-white flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                      <img
                        src={product.image?.startsWith('http') ? product.image : `https://camera-rental-ndr0.onrender.com/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2 w-full">
                      <h3 className="text-lg font-bold flex-1 text-white truncate" title={product.name}>{product.name}</h3>
                      <span className="px-3 py-1 rounded-full bg-purple-400 text-purple-700 text-xs font-semibold capitalize">
                        {product.category}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm mb-4 truncate max-w-full" title={product.description}>{product.description}</div>
                    <div className="flex items-center justify-between w-full mb-4">
                      <span className="text-2xl font-bold text-white">${product.pricePerDay}</span>
                      <span className="text-gray-400 text-xs">/day</span>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg w-full" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredProducts.map((product: any) => (
                  <div key={product._id} className="bg-[#1E293B] rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 flex-shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden mb-4 md:mb-0">
                      <img
                        src={product.image?.startsWith('http') ? product.image : `https://camera-rental-ndr0.onrender.com/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-2 w-full">
                      <div className="font-bold text-white text-lg mb-1">{product.name}</div>
                      <div className="text-gray-400 text-sm mb-2 truncate max-w-full" title={product.description}>{product.description}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                      <div className="font-bold text-white text-xl mb-2">${product.pricePerDay}<span className="text-sm text-gray-400">/day</span></div>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </main>
      </div>
      {/* Cart Icon Button */}
      {showCartButton && (
        <button
          className="fixed top-6 right-8 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-3xl"
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
        >
          🛒
        </button>
      )}
      
      <Footer/>
    </div>
  );
};

export default LensProducts; 