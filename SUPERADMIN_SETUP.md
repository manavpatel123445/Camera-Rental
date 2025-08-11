# Super Admin Setup Guide

## Overview
This guide explains how to set up the superadmin system for the Camera Rental application.

## Backend Setup

### 1. Create Initial Super Admin
Run the setup script to create the first superadmin:

```bash
cd backend
node scripts/createSuperAdmin.js
```

This will create a superadmin with:
- **Email**: superadmin@camerarental.com
- **Password**: SuperAdmin@123

### 2. Environment Variables
Ensure your `.env` file has the correct MongoDB connection string:

```env
MONGO_URI=mongodb://localhost:27017/camera-rental
JWT_SECRET=your-secret-key-here
```

## Frontend Access

### 1. Login as Super Admin
- Navigate to the admin login page
- Use the superadmin credentials created above
- After login, you'll see a "Manage Admins" button in the dashboard

### 2. Creating New Admins
- Click "Manage Admins" to open the Super Admin Panel
- Use the "Create New Admin" form to add new administrators
- Set roles as either:
  - **admin**: Regular admin access
  - **superadmin**: Full super admin access

## API Endpoints

### Super Admin Only Endpoints
- `POST /api/admin/super/create-admin` - Create new admin
- `GET /api/admin/super/admins` - Get all admins
- `PATCH /api/admin/super/admins/:id/role` - Update admin role
- `DELETE /api/admin/super/admins/:id` - Delete admin

### Authentication
All super admin endpoints require:
- Valid JWT token in Authorization header
- User must have `superadmin` role

## Security Features

1. **Role-based Access Control**
   - Only superadmins can access admin management
   - Regular admins cannot create/modify other admins

2. **Self-Deletion Prevention**
   - Superadmins cannot delete their own account

3. **Secure Password Hashing**
   - All passwords are hashed using bcrypt

4. **JWT Token Validation**
   - Tokens include role information
   - Tokens expire after 24 hours

## Manual Admin Creation (Alternative)

If you prefer to create admins manually via database:

```javascript
// In MongoDB shell
use camera-rental;
db.admins.insertOne({
  username: "adminname",
  email: "admin@example.com",
  password: "$2a$12$...", // bcrypt hashed password
  role: "superadmin",
  createdAt: new Date()
});
```

## Troubleshooting

1. **Permission Denied**: Ensure the logged-in user has `superadmin` role
2. **Token Expired**: Re-login to get fresh token
3. **Database Connection**: Check MongoDB is running and connection string is correct

## Best Practices

1. **Change Default Password**: Always change the default superadmin password after first login
2. **Limit Superadmins**: Keep the number of superadmins minimal
3. **Regular Review**: Periodically review admin accounts and remove unnecessary ones
4. **Secure Environment**: Never commit superadmin credentials to version control