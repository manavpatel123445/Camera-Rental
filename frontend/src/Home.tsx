import React, { useEffect, useState } from 'react';
import { Button } from './components/ui/Button';
import ProductCard from './components/ui/ProductCard';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './APP/store';
import { logout } from './APP/userAuth/userAuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#181622] text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-[#181622] relative">
        <span className="text-2xl font-bold tracking-tight">LensRentals</span>
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="hover:text-purple-400 transition">Home</Link>
          <Link to="/cameras" className="hover:text-purple-400 transition">Cameras</Link>
          <Link to="/lenses" className="hover:text-purple-400 transition">Lenses</Link>
          <Link to="/accessories" className="hover:text-purple-400 transition">Accessories</Link>
          <Link to="/support" className="hover:text-purple-400 transition">Support</Link>
        </div>
        {/* Burger Icon */}
        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-[#232136] flex flex-col items-center gap-6 py-6 z-50 md:hidden">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-purple-400 transition">Home</Link>
            <Link to="/cameras" onClick={() => setMenuOpen(false)} className="hover:text-purple-400 transition">Cameras</Link>
            <Link to="/lenses" onClick={() => setMenuOpen(false)} className="hover:text-purple-400 transition">Lenses</Link>
            <Link to="/accessories" onClick={() => setMenuOpen(false)} className="hover:text-purple-400 transition">Accessories</Link>
            <Link to="/support" onClick={() => setMenuOpen(false)} className="hover:text-purple-400 transition">Support</Link>
            {user ? (
              <>
                <span className="text-purple-300 font-semibold">{user.username}</span>
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center ml-2">
                  <span className="font-bold text-lg">P</span>
                </div>
                <Button
                  className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-6 py-2 rounded-lg"
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-6 py-2 rounded-lg"
                  onClick={() => { setMenuOpen(false); handleLogin(); }}
                >
                  Login
                </Button>
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center ml-2">
                  <span className="font-bold text-lg">P</span>
                </div>
              </>
            )}
          </div>
        )}
        {/* Desktop User/Actions */}
        <div className="hidden md:flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search"
            className="bg-[#232136] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
          />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg">Rent Now</Button>
          {user ? (
            <>
              <span className="text-purple-300 font-semibold">{user.username}</span>
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center ml-2">
                <span className="font-bold text-lg">P</span>
              </div>
              <Button
                className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-6 py-2 rounded-lg"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-6 py-2 rounded-lg"
                onClick={handleLogin}
              >
                Login
              </Button>
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center ml-2">
                <span className="font-bold text-lg">P</span>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-8 md:py-16 bg-[#181622] gap-8 md:gap-12">
        <div className="flex-1 flex justify-center mb-6 md:mb-0">
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&crop=center"
            alt="Camera Hero"
            className="rounded-xl shadow-2xl w-full max-w-xs md:max-w-[340px] h-auto object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start gap-6 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-2">Capture Your Vision<br />with <span className="text-purple-400">Premium Gear</span></h1>
          <p className="text-base md:text-lg text-gray-300 mb-4">Rent top-tier cameras and equipment for your next project. Unleash your creativity with our curated selection.</p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg text-base md:text-lg">Rent the Best Cameras Today</Button>
        </div>
      </section>

      {/* Featured Gear */}
      <section className="px-4 md:px-8 py-8 md:py-12 bg-[#232136] flex flex-col gap-8">
        <h2 className="text-2xl font-bold mb-4">Featured Gear</h2>
        {loading ? (
          <div className="text-white">Loading products...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product: any) => (
              <ProductCard key={product._id} product={{
                id: product._id,
                name: product.name,
                category: product.category,
                pricePerDay: product.pricePerDay,
                description: product.description,
                imageUrl: product.image,
                quantity: product.quantity,
              }} />
            ))}
          </div>
        )}
        <Button className="mt-6 w-max bg-[#232136] border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-semibold px-6 py-2 rounded-lg">View All Gear</Button>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#181622] py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4 border-t border-[#232136]">
        <div className="flex gap-6">
          <a href="#" className="hover:text-purple-400 transition">About</a>
          <a href="#" className="hover:text-purple-400 transition">Contact</a>
          <a href="#" className="hover:text-purple-400 transition">FAQ</a>
          <a href="#" className="hover:text-purple-400 transition">Terms of Service</a>
        </div>
        <div>&copy; {new Date().getFullYear()} LensRentals. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Home; 