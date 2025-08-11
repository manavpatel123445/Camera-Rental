const axios = require('axios');

const testAdminLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'superadmin@camerarental.com',
      password: 'SuperAdmin@123'
    });
    
    console.log('Login successful:', response.data);
  } catch (error) {
    console.log('Login failed:', error.response?.data || error.message);
  }
};

testAdminLogin();