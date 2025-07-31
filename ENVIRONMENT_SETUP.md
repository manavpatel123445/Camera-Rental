# 🔧 Environment Variables Setup Guide

## Backend Environment Variables (Render)

### Required Variables
```bash
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/camera_rental
JWT_SECRET=your_secure_jwt_secret_here
CORS_ORIGIN=http://localhost:5173
```

### How to Set in Render
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add each variable:
   - `MONGODB_URL`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a secure random string
   - `CORS_ORIGIN`: `http://localhost:5173` (update after frontend deployment)

## Frontend Environment Variables (Vercel)

### Required Variables
```bash
VITE_API_URL=https://your-backend.onrender.com
```

### How to Set in Vercel
1. Go to your Vercel dashboard
2. Select your frontend project
3. Go to "Settings" → "Environment Variables"
4. Add:
   - `VITE_API_URL`: Your backend URL from Render

## ⚠️ Important Notes

### Vite vs React Environment Variables
- **Vite projects** use `import.meta.env.VITE_*`
- **Create React App** uses `process.env.REACT_APP_*`
- Your project uses **Vite**, so all environment variables must be prefixed with `VITE_`

### Local Development
Create a `.env` file in your frontend directory:
```bash
# frontend/.env
VITE_API_URL=http://localhost:3000
```

### Production Deployment
1. **Backend**: Set environment variables in Render dashboard
2. **Frontend**: Set environment variables in Vercel dashboard
3. **Update CORS**: After frontend deployment, update `CORS_ORIGIN` in Render to include your Vercel domain

## 🔍 Testing Environment Variables

### Backend Test
```javascript
console.log('MongoDB URL:', process.env.MONGODB_URL);
console.log('JWT Secret:', process.env.JWT_SECRET);
console.log('CORS Origin:', process.env.CORS_ORIGIN);
```

### Frontend Test
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

## 🆘 Common Issues

1. **"Cannot find name 'process'"**: You're using Vite, use `import.meta.env` instead
2. **Environment variable not found**: Make sure it's prefixed with `VITE_` for frontend
3. **CORS errors**: Update `CORS_ORIGIN` to include your frontend domain
4. **API calls failing**: Check that `VITE_API_URL` is set correctly in Vercel 