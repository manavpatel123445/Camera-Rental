
import './App.css'
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './APP/admin/auth/AdminLogin';
import AdminRegister from './APP/admin/auth/AdminRegister';
import ProtectedRoute from './APP/admin/components/ProtectedRoute';
import Dashboard from './APP/admin/dashboard/Dashboard';
import ForgotPassword from './APP/admin/auth/ForgotPassword';
import ResetPassword from './APP/admin/auth/ResetPassword';
import ChangePassword from './APP/admin/auth/ChangePassword';
import AdminProfile from './APP/admin/auth/AdminProfile';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAdminProfile } from './APP/auth/authSlice';
import ProductList from './APP/admin/products/ProductList';
import AddProduct from './APP/admin/products/AddProduct';
import ProductDetail from './APP/admin/products/ProductDetail';
import { ThemeProvider } from './APP/admin/components/ThemeContext';
import Home from './Home';
import Login from './APP/Pages/Login';
import Register from './APP/Pages/Register';
import UserProfile from './APP/Pages/UserProfile';


function App() {
  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(fetchAdminProfile() as any);
  }, [dispatch]);
  return (
    <ThemeProvider>
      <Routes>
    
      <Route path="/admin/login" element={<AdminLogin />} />
    
      <Route path="/admin/register" element={<AdminRegister />} />
    
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
      <Route path="/profile" element={<UserProfile />} />

       
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    </ThemeProvider>
  );
}

export default App
