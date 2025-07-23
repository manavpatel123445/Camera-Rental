import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../store';
import { clearCart, updateQuantity, updateRentalDays } from "../cart/cartSlice";
import { 
  ShoppingCart, 
  CreditCard, 
  Calendar, 
  User, 
  MapPin, 
  Shield,
  Check,
  ArrowLeft,
  AlertCircle,
  Edit,
  ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CommonNavbar from "../../components/ui/CommonNavbar";

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  insurance: boolean;
  expeditedShipping: boolean;
  specialInstructions: string;
}

export default function Checkout() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    startDate: "",
    endDate: "",
    address: "",
    city: "",
    state: "gujarat",
    zipCode: "",
    country: "india",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    insurance: false,
    expeditedShipping: false,
    specialInstructions: ""
  });

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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
            <p className="text-xl text-gray-300 mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link to="/">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                <ArrowLeft className="h-5 w-5 mr-2" />
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
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setOrderComplete(true);
    dispatch(clearCart());
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.pricePerDay || 0) * item.quantity * (item.rentalDays || 1), 0);
  const insurance = formData.insurance ? subtotal * 0.1 : 0;
  const expeditedShipping = formData.expeditedShipping ? 25 : 15;
  const tax = (subtotal + insurance + expeditedShipping) * 0.08;
  const total = subtotal + insurance + expeditedShipping + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-8">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h2>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-auto mb-8">
              <p className="text-white font-semibold">Order Number</p>
              <p className="text-purple-400 text-lg">#LR-{Date.now().toString().slice(-6)}</p>
            </div>
            <div className="space-x-4">
              <Link to="/">
                <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                  Continue Shopping
                </Button>
              </Link>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
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
        <nav className="flex text-sm text-gray-400">
          <Link to="/" className="hover:text-purple-400">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/cart" className="hover:text-purple-400">Cart</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Checkout</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Checkout</h1>
          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-8 max-w-2xl">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Product Details & Rental Period */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <ShoppingCart className="h-6 w-6 mr-2 text-purple-400" />
                    Your Equipment ({totalItems} items)
                  </span>
                  <Link to="/cart">
                    <Button variant="outline" size="sm" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Cart
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item: any) => (
                  <div key={item._id} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-2">{item.name}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
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
                              ${(item.pricePerDay * item.quantity * item.rentalDays).toFixed(2)}
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
                  <Calendar className="h-6 w-6 mr-2 text-purple-400" />
                  Rental Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
                {formData.startDate && formData.endDate && (
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Rental Duration:</span>
                      <span className="text-white font-semibold">
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({totalItems} items):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {formData.insurance && (
                    <div className="flex justify-between text-gray-300">
                      <span>Equipment Insurance:</span>
                      <span>${insurance.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping:</span>
                    <span>${expeditedShipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-600 pt-2">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-center text-green-400 text-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Secure SSL encrypted checkout</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Step-by-Step Forms */}
          <div className="space-y-6">
            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="h-6 w-6 mr-2 text-purple-400" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      disabled={!canProceedToStep2}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="h-6 w-6 mr-2 text-purple-400" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="border-slate-600 text-gray-300 hover:bg-slate-700"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(3)}
                      disabled={!canProceedToStep3}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
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
                    <CreditCard className="h-6 w-6 mr-2 text-purple-400" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        required
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="insurance"
                        checked={formData.insurance}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-600"
                      />
                      <span className="text-gray-300">Add equipment insurance (10% of rental cost)</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="expeditedShipping"
                        checked={formData.expeditedShipping}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-600"
                      />
                      <span className="text-gray-300">Expedited shipping (+$10)</span>
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="border-slate-600 text-gray-300 hover:bg-slate-700"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(4)}
                      disabled={!canProceedToStep4}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
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
                    <Shield className="h-6 w-6 mr-2 text-purple-400" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Customer Information</h4>
                    <div className="bg-slate-700 rounded-lg p-4 text-gray-300">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Delivery Address</h4>
                    <div className="bg-slate-700 rounded-lg p-4 text-gray-300">
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Payment Method</h4>
                    <div className="bg-slate-700 rounded-lg p-4 text-gray-300">
                      <p>**** **** **** {formData.cardNumber.slice(-4)}</p>
                      <p>{formData.cardholderName}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                      className="border-slate-600 text-gray-300 hover:bg-slate-700"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmitOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
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