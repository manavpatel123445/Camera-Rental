import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../APP/store';
import { FaShoppingCart, FaListAlt, FaBars, FaTimes } from 'react-icons/fa';
import CartModal from './CartModal';
import { removeFromCart, updateQuantity, clearCart } from '../../APP/cart/cartSlice';
import { logout as userLogout } from '../../APP/userAuth/userAuthSlice';
import logo from '../../assets/logo2.png';

interface NavLink {
  label: string;
  href: string;
}

interface CommonNavbarProps {
  navLinks?: NavLink[];
  showRentNow?: boolean;
  showSearch?: boolean;
  className?: string;
}

const CommonNavbar: React.FC<CommonNavbarProps> = ({
  navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Cameras', href: '/cameras' },
    { label: 'Lenses', href: '/lenses' },
    { label: 'Accessories', href: '/accessories' },
    { label: 'Support', href: '/support' },
  ],
  showRentNow = true,
  className = '',
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state: RootState) => state.userAuth.user);
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [cartOpen, setCartOpen] = useState(false);
  const cartTotal = cart.reduce((sum, item) => sum + (item.pricePerDay || 0) * item.quantity * (item.rentalDays || 1), 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const handleStorage = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleLogout = () => {
    // First dispatch the logout action which will handle localStorage cleanup
    dispatch(userLogout());
    // Then clear cart data
    localStorage.removeItem('cart');
    dispatch(clearCart());
    setIsLoggedIn(false);
    toast.success('Logged out successfully!');
    // The redirect is now handled in the userLogout action
  };

  const handleRemoveFromCart = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success('Removed from cart!');
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    dispatch(updateQuantity({ id, quantity: qty }));
  };

  return (
    <nav className={`flex items-center justify-between px-4 md:px-8 py-4 bg-[#181622] ${className}`}>
      {/* Left: Logo */}
      <span className="text-2xl font-bold tracking-tight text-white cursor-pointer flex-shrink-0" onClick={() => window.location.href = '/'}>
        <img src={logo} alt="LensRentals" className="w-30 h-15" />
      </span>
      {/* Center: Desktop Nav Links */}
      <div className="hidden md:flex gap-8 items-center flex-1 justify-center">
        {navLinks.map(link => (
          <Link key={link.href} to={link.href} className="hover:text-purple-400 transition text-white">
            {link.label}
          </Link>
        ))}
      </div>
      {/* Right: Profile, Cart, Hamburger */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Cart Icon */}
        <button
          className="relative text-2xl text-white hover:text-purple-400 transition"
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
        >
          <FaShoppingCart />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 font-bold">
              {cart.length}
            </span>
          )}
        </button>
        {/* Profile/Orders */}
        {user && (
          <>
            <button
              className="relative text-2xl text-white hover:text-purple-400 transition mr-1 md:mr-2"
              onClick={() => {
                window.location.href = '/orders';
              }}
              aria-label="Order List"
            >
              <FaListAlt />
            </button>
            <Link to="/profile">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-600 flex items-center justify-center ml-1 md:ml-2 cursor-pointer overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar.startsWith('http') ? user.avatar : `https://camera-rental-ndr0.onrender.com/${user.avatar}`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-lg text-white">P</span>
                )}
              </div>
            </Link>
          </>
        )}
        {/* Login/Logout Button (desktop only) */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <Button
              className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-4 md:px-6 py-2 rounded-lg"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-4 md:px-6 py-2 rounded-lg"
              onClick={handleLogin}
            >
              Login
            </Button>
          )}
        </div>
        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden text-2xl text-white ml-2"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex flex-col">
          <div className="flex justify-between items-center px-4 py-4 bg-[#181622]">
            <span className="text-2xl font-bold tracking-tight text-white">LensRentals</span>
            <button
              className="text-2xl text-white"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex flex-col gap-6 px-8 py-8 bg-[#181622] flex-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="text-white text-lg font-semibold hover:text-purple-400 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-col gap-4">
              {isLoggedIn ? (
                <Button
                  className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-4 py-2 rounded-lg"
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-4 py-2 rounded-lg"
                  onClick={() => { setMobileMenuOpen(false); handleLogin(); }}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      <CartModal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={handleRemoveFromCart}
        total={cartTotal}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </nav>
  );
};

export default CommonNavbar;