import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../APP/store';
import { FaShoppingCart, FaListAlt } from 'react-icons/fa';
import CartModal from './CartModal';
import { removeFromCart, updateQuantity, updateRentalDays, clearCart } from '../../APP/cart/cartSlice';
import { logout as userLogout } from '../../APP/userAuth/userAuthSlice';

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
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    dispatch(clearCart());
    dispatch(userLogout());
    setIsLoggedIn(false);
    toast.success('Logged out successfully!');
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

  return (
    <nav className={`flex items-center justify-between px-8 py-4 bg-[#181622] ${className}`}>
      <span className="text-2xl font-bold tracking-tight text-white cursor-pointer" onClick={() => window.location.href = '/'}>
        LensRentals
      </span>
      <div className="flex gap-8 items-center">
        {navLinks.map(link => (
          <Link key={link.href} to={link.href} className="hover:text-purple-400 transition text-white">
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-4 items-center">
       
      
        {isLoggedIn ? (
          <Button
            className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-6 py-2 rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            className="border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white font-semibold px-6 py-2 rounded-lg"
            onClick={handleLogin}
          >
            Login
          </Button>
        )}
        {user && (
          <>
            <button
              className="relative text-2xl text-white hover:text-purple-400 transition mr-2"
              onClick={() => {
                window.location.href = '/orders';
              }}
              aria-label="Order List"
            >
              <FaListAlt />
            </button>
            <Link to="/profile">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center ml-2 cursor-pointer overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:3000/${user.avatar}`}
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
        {/* Cart Icon and Modal remain unchanged */}
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
        <CartModal
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          onRemove={id => dispatch(removeFromCart(id))}
          total={cartTotal}
          onUpdateQuantity={(id, qty) => dispatch(updateQuantity({ id, quantity: qty }))}
         
        />
      </div>
    </nav>
  );
};

export default CommonNavbar;