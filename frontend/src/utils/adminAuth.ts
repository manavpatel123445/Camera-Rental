// Admin Authentication Utility Functions

export const getAdminToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

export const removeAdminToken = (): void => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminProfile');
};

export const isAdminAuthenticated = (): boolean => {
  const token = getAdminToken();
  return !!token;
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAdminToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getAuthHeadersForFormData = (): Record<string, string> => {
  const token = getAdminToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }
  
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const handleAuthError = (error: any, navigate?: (path: string) => void): void => {
  console.error('Authentication error:', error);
  
  if (error.message?.includes('token') || error.status === 401) {
    removeAdminToken();
    if (navigate) {
      navigate('/admin/login');
    } else {
      window.location.href = '/admin/login';
    }
  }
}; 