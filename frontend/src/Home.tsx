import React, { useEffect, useState } from 'react';
import { Button } from './components/ui/Button';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './APP/store';
import { useNavigate } from 'react-router-dom';
import CartModal from './components/ui/CartModal';
import CommonNavbar from './components/ui/CommonNavbar';
import { addToCart, removeFromCart, updateQuantity } from './APP/cart/cartSlice';
import Footer from './components/ui/Footer';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        } else {
          setError(data.message || 'Failed to fetch products.');
        }
      } catch (err) {
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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

  const handleRemoveFromCart = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success('Removed from cart!');
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    dispatch(updateQuantity({ id, quantity: qty }));
  };

  const cart = useSelector((state: RootState) => state.cart.items);
  const cartTotal = cart.reduce((sum, item) => sum + (item.pricePerDay || 0) * item.quantity * (item.rentalDays || 1), 0);

  return (
    <div className="min-h-screen bg-[#181622] text-white flex flex-col">
      <CommonNavbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-8 py-8 md:py-16 
       gap-8 md:gap-12">
        <div className="flex-1 flex justify-center mb-6 md:mb-0 w-full">
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&crop=center"
            alt="Camera Hero"
            className="rounded-xl shadow-2xl w-full max-w-xs md:max-w-[340px] h-auto object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start gap-6 text-center md:text-left w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-2">Capture Your Vision<br />with <span className="text-purple-400">Premium Gear</span></h1>
          <p className="text-base sm:text-lg md:text-lg text-gray-300 mb-4">Rent top-tier cameras and equipment for your next project. Unleash your creativity with our curated selection.</p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg text-base md:text-lg w-full sm:w-auto">Rent the Best Cameras Today</Button>
        </div>
      </section>

      {/* Featured Gear */}
      <section className="px-4 sm:px-6 md:px-8 py-8 md:py-12 bg-[#232136] flex flex-col gap-8">
        <h2 className="text-2xl font-bold mb-4">Featured Gear</h2>
        {loading ? (
          <div className="text-white">Loading products...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product: any) => (
              <div key={product._id} className="bg-[#1E293B] rounded-2xl shadow p-6 flex flex-col items-start w-full">
                <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-white flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                  <img
                    src={product.image?.startsWith('http') ? product.image : `http://localhost:3000/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-contain"
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
        )}
      </section>

      {/* Footer */}
      <Footer />

      <CartModal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={handleRemoveFromCart}
        total={cartTotal}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};

export default Home; 