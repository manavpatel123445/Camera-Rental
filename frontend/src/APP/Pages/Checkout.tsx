import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../store';
import type { CartItem } from '../cart/cartSlice';
import { clearCart } from "../cart/cartSlice";
import { fetchUserProfile } from "../userAuth/userAuthSlice";
import { 
  ShoppingCart, 
  CreditCard, 
  Calendar, 
  User, 
  MapPin, 
  Shield,
  Check,
  ArrowLeft,
  Edit,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CommonNavbar from "../../components/ui/CommonNavbar";

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  startDate: string;
  endDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
  cardNumber: number;
  expiryDate: string;
  cvv: number;
  cardholderName: string;
  insurance: boolean;
  expeditedShipping: boolean;
  specialInstructions: string;
  cart: any;
  items: any;
}

export default function Checkout() {
  const cart = useSelector((state: RootState) => state.cart.items) as CartItem[];
  const user = useSelector((state: RootState) => state.userAuth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: 0,
    startDate: localStorage.getItem('pickupDate') || "",
    endDate: localStorage.getItem('dropoffDate') || "",
    address: "",
    city: "",
    state: "gujarat",
    zipCode: 0,
    country: "india",
    cardNumber: 0,
    expiryDate: "",
    cvv: 0,
    cardholderName: "",
    insurance: false,
    expeditedShipping: false,
    specialInstructions: "",
    cart: [],
    items: [],
  });

  // Fetch user profile on component mount
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchUserProfile() as any);
    }
  }, [dispatch, user?.token]);

  // Auto-fill form with user profile data when available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.username?.split(' ')[0] || prev.firstName,
        lastName: user.username?.split(' ').slice(1).join(' ') || prev.lastName,
        email: user.email || prev.email,
        phone: user.contact ? parseInt(user.contact) || 0 : prev.phone,
      }));
    }
  }, [user]);

  // Function to use profile address
  const useProfileAddress = () => {
    if (user?.address) {
      setFormData(prev => ({
        ...prev,
        address: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zip ? parseInt(user.address.zip) || 0 : 0,
        country: user.address?.country || "",
      }));
    }
  };

  // Function to use profile information
  const useProfileInfo = () => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.username?.split(' ')[0] || "",
        lastName: user.username?.split(' ').slice(1).join(' ') || "",
        email: user.email || "",
        phone: user.contact ? parseInt(user.contact) || 0 : 0,
      }));
    }
  };

  // Redirect to cart if empty
  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-slate-900">
        <header className="bg-slate-800 shadow-sm border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-white">
                  LensRentals
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-6 sm:mb-8" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link to="/">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-base">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               name === 'phone' || name === 'zipCode' || name === 'cardNumber' || name === 'cvv' ? 
               parseInt(value) || 0 : value
    }));
  };

  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    // Create order in backend
    try {
      const token = localStorage.getItem('token');
      await fetch('https://camera-rental-ndr0.onrender.com/api/user/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            product: item._id,
            name: item.name,
            pricePerDay: item.pricePerDay,
            quantity: item.quantity,
            image: item.image,
          })),
          total: total,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      });
    } catch (err) {
      // Optionally show error
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setOrderComplete(true);
    dispatch(clearCart());
    
    // Clear the dates from localStorage after successful order completion only
    // This ensures dates persist for future rentals until order is completed
    localStorage.removeItem('pickupDate');
    localStorage.removeItem('dropoffDate');
  };

  // Calculate totals
  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + (item.pricePerDay || 0) * item.quantity * (item.rentalDays || 1), 0);
  const insurance = formData.insurance ? subtotal * 0.1 : 0;
  const expeditedShipping = formData.expeditedShipping ? 25 : 15;
  const tax = (subtotal + insurance + expeditedShipping) * 0.08;
  const total = subtotal + insurance + expeditedShipping + tax;
  const totalItems = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-900">
        <header className="bg-slate-800 shadow-sm border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-white">
                  LensRentals
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-600 rounded-full mb-6 sm:mb-8">
              <Check className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Order Confirmed!</h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 sm:p-6 max-w-md mx-auto mb-6 sm:mb-8">
              <p className="text-white font-semibold">Order Number</p>
              <p className="text-purple-400 text-lg">#LR-{Date.now().toString().slice(-6)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700 w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
                onClick={() => navigate('/orders')}
              >
                Track Your Order
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const steps = [
    { id: 1, name: "Customer Info", icon: User },
    { id: 2, name: "Delivery Address", icon: MapPin },
    { id: 3, name: "Payment", icon: CreditCard },
    { id: 4, name: "Review", icon: Shield }
  ];

  const canProceedToStep2 = formData.firstName && formData.lastName && formData.email && formData.phone;
  const canProceedToStep3 = canProceedToStep2 && formData.address && formData.city && formData.state && formData.zipCode;
  const canProceedToStep4 = canProceedToStep3 && formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardholderName;

  return (
    <div className="min-h-screen bg-[#181622]">
      {/* Header */}
      <CommonNavbar/>
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm text-gray-400 overflow-x-auto">
          <Link to="/" className="hover:text-purple-400 whitespace-nowrap">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/a" className="hover:text-purple-400 whitespace-nowrap">Cart</Link>
          <span className="mx-2">/</span>
          <span className="text-white whitespace-nowrap">Checkout</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Checkout</h1>
          
          {/* Progress Steps - Mobile Responsive */}
          <div className="mb-6 sm:mb-8">
            {/* Desktop Steps */}
            <div className="hidden md:flex justify-between items-center max-w-2xl">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted 
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : isActive 
                          ? 'border-purple-600 text-purple-400'
                          : 'border-slate-600 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.name}
                    </span>
                    {index < steps.length - 1 && (
                      <ChevronRight className={`ml-4 h-4 w-4 ${
                        isCompleted ? 'text-purple-600' : 'text-slate-600'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Mobile Steps */}
            <div className="md:hidden">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400">Step {currentStep} of {steps.length}</span>
                <span className="text-sm text-white font-medium">{steps[currentStep - 1].name}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column: Product Details & Rental Period */}
          <div className="space-y-4 sm:space-y-6 order-2 xl:order-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="flex items-center">
                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-400" />
                    Your Equipment ({totalItems} items)
                  </span>
                  <Link to="/cart">
                    <Button variant="outline" size="sm" className="border-slate-600 text-gray-300 hover:bg-slate-700 text-xs sm:text-sm">
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Edit Cart
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {cart.map((item: CartItem) => (
                  <div key={item._id} className="bg-slate-700 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold mb-2 text-sm sm:text-base truncate">{item.name}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                          <div>
                            <span className="text-gray-400">Quantity:</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-white">{item.quantity}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Rental Days:</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-white">{item.rentalDays} days</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Daily Rate:</span>
                            <span className="text-white ml-2">${item.pricePerDay}/day</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Subtotal:</span>
                            <span className="text-purple-400 font-semibold ml-2">
                              ${(item.pricePerDay * item.quantity * (item.rentalDays || 1)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Rental Period */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-400" />
                  Rental Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      value={formData.endDate}
                      onChange={handleInputChange}
                      min={formData.startDate}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>
                </div>
                {formData.startDate && formData.endDate && (
                  <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Rental Duration:</span>
                      <span className="text-white font-semibold text-sm">
                        {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300 text-sm">
                    <span>Subtotal ({totalItems} items):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {formData.insurance && (
                    <div className="flex justify-between text-gray-300 text-sm">
                      <span>Equipment Insurance:</span>
                      <span>${insurance.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300 text-sm">
                    <span>Shipping:</span>
                    <span>${expeditedShipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 text-sm">
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-600 pt-2">
                    <div className="flex justify-between text-white font-bold text-base sm:text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-center text-green-400 text-xs sm:text-sm">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    <span>Secure SSL encrypted checkout</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Step-by-Step Forms */}
          <div className="space-y-4 sm:space-y-6 order-1 xl:order-2">
            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="flex items-center">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-400" />
                      Customer Information
                    </span>
                    {user && (
                      <Button
                        onClick={useProfileInfo}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-gray-300 hover:bg-slate-700 text-xs sm:text-sm"
                      >
                        <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Use Profile Info
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="number"
                      name="phone"
                      required
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>

                  <div className="pt-3 sm:pt-4">
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      disabled={!canProceedToStep2}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base"
                    >
                      Continue to Delivery Address
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Delivery Address */}
            {currentStep === 2 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="flex items-center">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-400" />
                      Delivery Address
                    </span>
                    {user?.address && (
                      <Button
                        onClick={useProfileAddress}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-gray-300 hover:bg-slate-700 text-xs sm:text-sm"
                      >
                        <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Use Profile Address
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="number"
                      name="zipCode"
                      required
                      value={formData.zipCode || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="border-slate-600 text-gray-300 hover:bg-slate-700 text-sm sm:text-base"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(3)}
                      disabled={!canProceedToStep3}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment Information */}
            {currentStep === 3 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-400" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      required
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="number"
                      name="cardNumber"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        required
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVV *
                      </label>
                      <input
                        type="number"
                        name="cvv"
                        required
                        placeholder="123"
                        value={formData.cvv || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 sm:pt-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="insurance"
                        checked={formData.insurance}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-600 mt-0.5"
                      />
                      <span className="text-gray-300 text-sm">Add equipment insurance (10% of rental cost)</span>
                    </label>
                    
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="expeditedShipping"
                        checked={formData.expeditedShipping}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-600 mt-0.5"
                      />
                      <span className="text-gray-300 text-sm">Expedited shipping (+$10)</span>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="border-slate-600 text-gray-300 hover:bg-slate-700 text-sm sm:text-base"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(4)}
                      disabled={!canProceedToStep4}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base"
                    >
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Review Order */}
            {currentStep === 4 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-400" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-3 text-sm sm:text-base">Customer Information</h4>
                    <div className="bg-slate-700 rounded-lg p-3 sm:p-4 text-gray-300 text-sm">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.email}</p>
                      <p>{formData.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3 text-sm sm:text-base">Delivery Address</h4>
                    <div className="bg-slate-700 rounded-lg p-3 sm:p-4 text-gray-300 text-sm">
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.state} {formData.zipCode || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3 text-sm sm:text-base">Payment Method</h4>
                    <div className="bg-slate-700 rounded-lg p-3 sm:p-4 text-gray-300 text-sm">
                      <p>**** **** **** {formData.cardNumber.toString().slice(-4)}</p>
                      <p>{formData.cardholderName}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                      className="border-slate-600 text-gray-300 hover:bg-slate-700 text-sm sm:text-base"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmitOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base"
                    >
                      {isProcessing ? "Processing..." : `Complete Order - $${total.toFixed(2)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 