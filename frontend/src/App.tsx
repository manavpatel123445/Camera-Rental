
import './App.css'
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './APP/admin/auth/AdminLogin';

import ProtectedRoute from './APP/admin/components/ProtectedRoute';
import UserProtectedRoute from './APP/components/UserProtectedRoute';
import Dashboard from './APP/admin/dashboard/Dashboard';
import ForgotPassword from './APP/admin/auth/ForgotPassword';
import ResetPassword from './APP/admin/auth/ResetPassword';
import ChangePassword from './APP/admin/auth/ChangePassword';
import AdminProfile from './APP/admin/auth/AdminProfile';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './APP/userAuth/userAuthSlice';
import { fetchAdminProfile } from './APP/auth/authSlice';
import { type AppDispatch,type  RootState } from './APP/store';
import ProductList from './APP/admin/products/ProductList';
import AddProduct from './APP/admin/products/AddProduct';
import ProductDetail from './APP/Pages/ProductDetail';

import Home from './Home';
import Login from './APP/Pages/Login';
import Register from './APP/Pages/Register';
import UserProfile from './APP/Pages/UserProfile';
import CameraProducts from './APP/Pages/CameraProducts';
import LensProducts from './APP/Pages/LensProducts';
import AccessoryProducts from './APP/Pages/AccessoryProducts';
import Checkout from './APP/Pages/Checkout';
import UsersList from './APP/admin/users/UsersList';
import UserOrders from './APP/Pages/UserOrders';
import OrdersList from './APP/admin/orders/OrdersList';
import Support from './APP/Pages/Support';


function App() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.userAuth?.user);
  
  useEffect(() => {
    dispatch(fetchAdminProfile());
    
    // Check for token-user consistency on app load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    // If no token but user in Redux, logout
    if (!token && user) {
      dispatch(logout());
    }
    
    // If no token but user in localStorage, clear localStorage
    if (!token && storedUser) {
      localStorage.removeItem('user');
    }
    
    // If token but no user in localStorage or Redux, clear token
    if (token && (!storedUser || !user)) {
      localStorage.removeItem('token');
    }
  }, [dispatch, user]);
  return (
  
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        
        <Route path="/admin/change-password" element={<ChangePassword />} />
        
        <Route path="/admin/profile" element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        } />
      
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <UsersList />
        </ProtectedRoute>
      } />
    
      <Route path="/admin/products" element={
        <ProtectedRoute>
          <ProductList />
        </ProtectedRoute>
      } />
      <Route path="/admin/addproduct" element={
        <ProtectedRoute>
          <AddProduct />
        </ProtectedRoute>
      } />
      <Route path="/admin/products/:id" element={
        <ProtectedRoute>
          <ProductDetail />
        </ProtectedRoute>
      } />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cameras" element={<CameraProducts />} />
      <Route path="/lenses" element={<LensProducts />} />
      <Route path="/accessories" element={<AccessoryProducts />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={
        <UserProtectedRoute>
          <UserProfile />
        </UserProtectedRoute>
      } />
      <Route path="/orders" element={<UserOrders />} />
      <Route path="/support" element={<Support />} />
     
      <Route path="/admin/orders" element={
        <ProtectedRoute>
          <OrdersList />
        </ProtectedRoute>
      } />

       
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>

  );
}

export default App
