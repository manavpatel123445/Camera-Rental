# Camera Rental Website Deployment Guide

## Backend Deployment (Render)

### Step 1: Prepare Backend
1. Add start script to `backend/package.json` (already done)
2. Create `.env` file in backend directory with:
   ```
   MONGODB_URL=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/camera_rental
   JWT_SECRET=your_jwt_secret_key_here
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   ```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file
6. Add environment variables in Render dashboard:
   - `MONGODB_URL`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `CORS_ORIGIN`: Your frontend URL (update after frontend deployment)

### Step 3: Get Backend URL
- Render will provide a URL like: `https://your-app-name.onrender.com`
- Update your frontend API calls to use this URL

## Frontend Deployment (Vercel)

### Step 1: Update API URLs
Replace all `https://camera-rental-ndr0.onrender.com` with your Render backend URL in:
- `frontend/src/Home.tsx`
- `frontend/src/APP/Pages/ProductDetail.tsx`
- Any other files making API calls

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Set root directory to `frontend`
6. Build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Step 3: Update CORS
After getting your Vercel URL, update the `CORS_ORIGIN` in Render to include your Vercel domain.

## Alternative Backend Hosting Options

### Railway
- Free tier available
- Easy deployment from GitHub
- Automatic HTTPS

### Heroku
- Free tier discontinued
- Paid plans available
- Very reliable

### DigitalOcean App Platform
- Good performance
- Reasonable pricing
- Easy scaling

## Environment Variables Setup

### Backend (.env)
```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secure_jwt_secret
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Frontend (Vercel)
Add environment variable in Vercel dashboard:
- `VITE_API_URL`: Your backend URL (e.g., `https://your-app.onrender.com`)

Note: In Vite projects, environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

## Database Setup (MongoDB Atlas)
1. Go to [mongodb.com](https://mongodb.com)
2. Create free cluster
3. Get connection string
4. Add to backend environment variables

## Post-Deployment Checklist
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] API calls working between frontend and backend
- [ ] Database connected and working
- [ ] File uploads working (if applicable)
- [ ] Authentication working
- [ ] CORS properly configured 