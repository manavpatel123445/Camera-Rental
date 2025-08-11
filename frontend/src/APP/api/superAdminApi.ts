import { API_ENDPOINTS } from '../../config/api';

export interface CreateAdminData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'admin' | 'superadmin';
}

export interface Admin {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
}

export const superAdminApi = {
  createAdmin: async (adminData: CreateAdminData): Promise<{ message: string; admin: Admin }> => {
    const response = await fetch(`${API_ENDPOINTS.ADMIN_BASE}/super/create-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
      body: JSON.stringify(adminData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create admin');
    }
    
    return response.json();
  },

  getAllAdmins: async (): Promise<{ admins: Admin[] }> => {
    const response = await fetch(`${API_ENDPOINTS.ADMIN_BASE}/super/admins`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch admins');
    }
    
    return response.json();
  },

  updateAdminRole: async (adminId: string, role: 'admin' | 'superadmin'): Promise<{ message: string; admin: Admin }> => {
    const response = await fetch(`${API_ENDPOINTS.ADMIN_BASE}/super/admins/${adminId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
      body: JSON.stringify({ role }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update admin role');
    }
    
    return response.json();
  },

  deleteAdmin: async (adminId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_ENDPOINTS.ADMIN_BASE}/super/admins/${adminId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete admin');
    }
    
    return response.json();
  },
};