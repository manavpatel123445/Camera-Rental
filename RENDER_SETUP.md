# 🚀 Render Deployment Setup

## ✅ What's Ready
- ✅ `render.yaml` file created
- ✅ Backend package.json has start script
- ✅ CORS configuration updated
- ✅ Environment variables configured

## 🎯 Next Steps

### 1. Commit and Push to GitHub
```bash
git add .
git commit -m "Add render.yaml for deployment"
git push origin main
```

### 2. Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Blueprint"
4. Connect your repository: `manavpatel123445/Camera-Rental`
5. Render will automatically detect the `render.yaml` file
6. Click "Create Blueprint"

### 3. Add Environment Variables
In the Render dashboard, add these environment variables:
- `MONGODB_URL`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string (you can generate one at https://generate-secret.vercel.app/32)
- `CORS_ORIGIN`: `http://localhost:5173` (temporary, will update after frontend deployment)

### 4. Get Your Backend URL
After deployment, you'll get a URL like: `https://camera-rental-backend.onrender.com`

### 5. Update Frontend
Run this command with your backend URL:
```bash
node update-api-urls.js https://your-backend-url.onrender.com
```

## 🔧 Environment Variables Example
```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/camera_rental
JWT_SECRET=your_32_character_random_string_here
CORS_ORIGIN=http://localhost:5173
```

## 🆘 Troubleshooting
- **"No render.yaml found"**: Make sure you pushed the `render.yaml` file to GitHub
- **Build fails**: Check that your backend has all dependencies in package.json
- **Database connection fails**: Verify your MongoDB Atlas connection string
- **CORS errors**: Update CORS_ORIGIN after frontend deployment

## 📞 Support
- Render Docs: [docs.render.com](https://docs.render.com)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com) 