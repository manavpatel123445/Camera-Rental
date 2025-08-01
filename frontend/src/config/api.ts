// API Configuration
const API_BASE_URL = (import.meta as any)?.env?.VITE_API_URL || 'https://camera-rental-ndr0.onrender.com';

export const API_ENDPOINTS = {
  // Productsxsd
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_BY_ID: (id: string) => `${API_BASE_URL}/api/products/${id}`,
  
  // User Authentication
  USER_LOGIN: `${API_BASE_URL}/api/user/login`,
  USER_REGISTER: `${API_BASE_URL}/api/user/register`,
  USER_PROFILE: `${API_BASE_URL}/api/user/profile`,
  USER_PROFILE_AVATAR: `${API_BASE_URL}/api/user/profile/avatar`,
  USER_ORDERS: `${API_BASE_URL}/api/user/orders`,
  USER_ORDER_CANCEL: (orderId: string) => `${API_BASE_URL}/api/user/orders/${orderId}/cancel`,
  
  // Admin
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_REGISTER: `${API_BASE_URL}/api/admin/register`,
  ADMIN_PROFILE: `${API_BASE_URL}/api/admin/profile`,
  ADMIN_PROFILE_IMAGE: `${API_BASE_URL}/api/admin/profile/image`,
  ADMIN_FORGOT_PASSWORD: `${API_BASE_URL}/api/admin/forgot-password`,
  ADMIN_RESET_PASSWORD: `${API_BASE_URL}/api/admin/reset-password`,
  ADMIN_CHANGE_PASSWORD: `${API_BASE_URL}/api/admin/change-password`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_USER_STATUS: (userId: string) => `${API_BASE_URL}/api/admin/users/${userId}/status`,
  ADMIN_ORDERS: `${API_BASE_URL}/api/admin/orders`,
  ADMIN_ORDER_BY_ID: (orderId: string) => `${API_BASE_URL}/api/admin/orders/${orderId}`,
  ADMIN_ORDER_STATUS: (orderId: string) => `${API_BASE_URL}/api/admin/orders/${orderId}/status`,
  ADMIN_ANALYTICS_DASHBOARD: `${API_BASE_URL}/api/admin/analytics/dashboard`,
  ADMIN_ANALYTICS_USERS: (period: string) => `${API_BASE_URL}/api/admin/analytics/users?period=${period}`,
  ADMIN_ANALYTICS_ORDERS: (period: string) => `${API_BASE_URL}/api/admin/analytics/orders?period=${period}`,
  
  // Product Stats
  PRODUCT_STATS: `${API_BASE_URL}/api/products/stats`,
  
  // File URLs
  UPLOAD_URL: (filename: string) => `${API_BASE_URL}/${filename}`,
};

export default API_BASE_URL; 