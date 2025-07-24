import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import CommonNavbar from '../../components/ui/CommonNavbar';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-red-400">Product not found.</div>;

  // Example discount logic
  const originalPrice = product.originalPrice || (product.pricePerDay ? Math.round(product.pricePerDay * 1.6) : 0);
  const discount = product.pricePerDay && originalPrice ? Math.round(100 - (product.pricePerDay / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!pickupDate || !dropoffDate) {
      alert('Please select pickup and drop-off dates.');
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
  };

  const handleRentNow = () => {
    if (!pickupDate || !dropoffDate) {
      alert('Please select pickup and drop-off dates.');
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
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#181622] flex flex-col  ">
      <CommonNavbar />
      <div className="w-full min-h-[70vh] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 py-8 md:py-0">
        {/* Image */}
        <div className="flex-1 flex items-center justify-center w-full max-w-lg">
          <img
            src={product.image?.startsWith('http') ? product.image : `http://localhost:3000/${product.image}`}
            alt={product.name}
            className="rounded-xl bg-white w-full max-w-xs h-80 object-contain border"
          />
        </div>
        {/* Details */}
        <div className="flex-1 flex flex-col gap-4 w-full max-w-xl">
          <div className="mb-2">
            <span className="text-xs text-gray-400 font-mono">ID: {product._id || 'N/A'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 uppercase leading-tight">{product.name}</h1>
          <div className="text-white text-base font-bold mb-4 leading-relaxed">{product.description}</div>
          <div className="flex items-center gap-4 mb-2">
            {discount > 0 && (
              <span className="text-purple-400 font-bold text-lg">-{discount}%</span>
            )}
            <span className="text-2xl font-bold text-white">₹{product.pricePerDay}</span>
            {originalPrice > product.pricePerDay && (
              <span className="text-gray-400 line-through text-lg font-bold">₹{originalPrice}</span>
            )}
          </div>
          
          {/* Date Pickers */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex flex-col w-full">
              <label className="text-white text-sm font-bold mb-1">Pickup Date</label>
              <input type="date" className="border border-[#232136] bg-[#1E293B] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-white text-sm font-bold mb-1">Drop-off Date</label>
              <input type="date" className="border border-[#232136] bg-[#1E293B] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" value={dropoffDate} onChange={e => setDropoffDate(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full">
            <Button className="bg-[#232136] hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg text-lg flex-1" onClick={handleRentNow}>
             Rent Now
            </Button>
            <Button className="bg-[#232136] hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg text-lg flex-1" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
          <Button className="mt-4 text-gray-400 hover:text-purple-400 underline w-max" onClick={() => navigate(-1)}>
            &larr; Back to Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 