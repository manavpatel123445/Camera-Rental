# 🚀 Camera Rental Website Deployment Checklist

## Phase 1: Backend Deployment (Render)

### ✅ Pre-deployment Setup
- [ ] Backend package.json has start script
- [ ] CORS configuration updated to use environment variables
- [ ] MongoDB Atlas database created
- [ ] MongoDB connection string ready
- [ ] JWT secret generated

### 🔧 Deploy to Render
1. [ ] Go to [render.com](https://render.com)
2. [ ] Sign up with GitHub
3. [ ] Click "New" → "Blueprint"
4. [ ] Connect your GitHub repository
5. [ ] Render will automatically detect the `render.yaml` file
6. [ ] Add environment variables:
   - [ ] `MONGODB_URL` = your MongoDB connection string
   - [ ] `JWT_SECRET` = your secure JWT secret
   - [ ] `CORS_ORIGIN` = http://localhost:5173 (temporary)
7. [ ] Deploy and get backend URL (e.g., `https://your-app.onrender.com`)

### ✅ Backend Verification
- [ ] Backend URL is accessible
- [ ] API endpoints respond correctly
- [ ] Database connection working
- [ ] File uploads working (if applicable)

---

## Phase 2: Frontend Deployment (Vercel)

### 🔧 Update Frontend API URLs
1. [ ] Run the update script:
   ```bash
   node update-api-urls.js https://your-backend-url.onrender.com
   ```
2. [ ] Test frontend locally with new backend URL
3. [ ] Verify all API calls work

### 🚀 Deploy to Vercel
1. [ ] Go to [vercel.com](https://vercel.com)
2. [ ] Sign up with GitHub
3. [ ] Create new project
4. [ ] Import your repository
5. [ ] Configure build settings:
   - [ ] Root Directory: `frontend`
   - [ ] Framework Preset: Vite
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
   - [ ] Install Command: `npm install`
6. [ ] Deploy and get frontend URL

### ✅ Frontend Verification
- [ ] Frontend loads correctly
- [ ] API calls to backend work
- [ ] Authentication working
- [ ] All features functional

---

## Phase 3: Final Configuration

### 🔧 Update CORS Settings
1. [ ] Go back to Render dashboard
2. [ ] Update `CORS_ORIGIN` to include your Vercel domain
3. [ ] Redeploy backend if needed

### ✅ Final Testing
- [ ] Test complete user flow
- [ ] Test admin panel
- [ ] Test file uploads
- [ ] Test authentication
- [ ] Test payment flow (if applicable)

---

## 🎯 Your Live URLs
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`
- **Database**: MongoDB Atlas

---

## 📝 Environment Variables Summary

### Backend (Render)
```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://camera-rental-one.vercel.app/
```

### Frontend (Vercel)
```
VITE_API_URL= https://camera-rental-ndr0.onrender.com
```

---

## 🆘 Troubleshooting

### Common Issues:
1. **CORS errors**: Update CORS_ORIGIN in backend
2. **API not found**: Check backend URL in frontend
3. **Database connection**: Verify MongoDB connection string
4. **Build errors**: Check Node.js version compatibility

### Support:
- Render: [docs.render.com](https://docs.render.com)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com) 