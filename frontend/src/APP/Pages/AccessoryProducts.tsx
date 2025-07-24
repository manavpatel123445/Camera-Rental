import React, { useEffect, useState } from 'react';
import CommonNavbar from '../../components/ui/CommonNavbar';
import { Button } from '../../components/ui/Button';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';
import toast from 'react-hot-toast';
import CartModal from '../../components/ui/CartModal';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

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
}

const AccessoryProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [cartOpen, setCartOpen] = useState(false);
  const [showCartButton, setShowCartButton] = useState(false);
  const cart = useSelector((state: RootState) => state.cart.items);
  const cartTotal = cart.reduce((sum, item) => sum + (item.pricePerDay || 0) * item.quantity * (item.rentalDays || 1), 0);
  const navigate = useNavigate();
  const [viewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();
        // Filter for category containing 'accessor' or 'light' (case-insensitive)
        setProducts(data.filter((p: Product) => {
          const cat = p.category?.toLowerCase() || '';
          return cat.includes('accessor') || cat.includes('light');
        }));
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

  // Split products into accessories and lighting
  const accessories = products.filter(p => (p.category?.toLowerCase() || '').includes('accessor'));
  const lighting = products.filter(p => (p.category?.toLowerCase() || '').includes('light'));

  return (
    <div className="min-h-screen bg-[#181622] text-white">
      <CommonNavbar />
      <div className="max-w-7xl mx-auto py-10 px-4 gap-8">
        {/* Filter Bar (horizontal, like LensProducts) */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search accessories..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                Filters
              </Button>
              <select
                className="bg-slate-800 border border-slate-600 text-white rounded px-3 py-1"
              >
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="nameAZ">Name: A-Z</option>
                <option value="nameZA">Name: Z-A</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">
                {accessories.length + lighting.length} accessories found
              </span>
            </div>
          </div>
        </div>
        {/* Product Grid */}
        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Popular Accessories</h1>
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-400">No accessories found.</div>
          ) : (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {accessories.slice(0, 8).map((product: any) => (
                  <div key={product._id} className="bg-[#1E293B] rounded-2xl shadow p-6 flex flex-col items-start">
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-white flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                      <img
                        src={product.image?.startsWith('http') ? product.image : `http://localhost:3000/${product.image}`}
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
                {accessories.map((product: any) => (
                  <div key={product._id} className="bg-[#1E293B] rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 flex-shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden mb-4 md:mb-0">
                      <img
                        src={product.image?.startsWith('http') ? product.image : `http://localhost:3000/${product.image}`}
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
      {showCartButton && (
        <button
          className="fixed top-6 right-8 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-3xl"
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
        >
          🛒
        </button>
      )}
      <CartModal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={() => {}}
        total={cartTotal}
        onUpdateQuantity={() => {}}
        
      />
    </div>
  );
};

export default AccessoryProducts; 