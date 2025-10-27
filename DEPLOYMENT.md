# Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **MongoDB Atlas Account**: Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Render Account**: Sign up at [render.com](https://render.com)
4. **RapidAPI Account**: Sign up and subscribe to JSearch API (optional, app works with mock data)

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ats-resume-scorer
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JSEARCH_API_KEY=your-rapidapi-key-here
JSEARCH_API_HOST=jsearch.p.rapidapi.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-api.onrender.com/api
```

## MongoDB Atlas Setup

1. **Create a Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new free cluster
   - Choose your preferred region

2. **Create Database User**
   - Go to Database Access
   - Add a new database user
   - Remember username and password

3. **Whitelist IP Addresses**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allows access from anywhere)
   - For production, use specific IPs

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Backend Deployment (Render)

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Service**
   - Name: `ats-resume-scorer-api`
   - Environment: `Node`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Choose Free plan

3. **Add Environment Variables**
   - Go to Environment tab
   - Add all required variables from above
   - Click "Save Changes"

4. **Deploy**
   - Service will auto-deploy
   - Copy the service URL (e.g., `https://ats-resume-scorer-api.onrender.com`)

## Frontend Deployment (Vercel)

1. **Install Vercel CLI** (Optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: `Create React App`
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `build`

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = Your Render backend URL + `/api`
   - Example: `https://ats-resume-scorer-api.onrender.com/api`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Visit your live site!

## Alternative: Deploy via CLI

### Vercel CLI Deployment
```bash
# Navigate to client directory
cd client

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variable
vercel env add REACT_APP_API_URL production

# Deploy to production
vercel --prod
```

## Post-Deployment Steps

1. **Update CORS Settings** (if needed)
   - In `server/server.js`, update CORS origin to your Vercel URL

2. **Test the Application**
   - Register a new user
   - Upload a resume
   - Check ATS scoring
   - Search for jobs
   - Apply to jobs

3. **Monitor Logs**
   - Render: Check logs in Render Dashboard
   - Vercel: Check deployment logs in Vercel Dashboard

## Troubleshooting

### Backend Issues

1. **Database Connection Failed**
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

2. **Module Not Found**
   - Run `npm install` in server directory
   - Check package.json dependencies

3. **API Endpoints Not Working**
   - Check Render logs for errors
   - Verify all environment variables are set
   - Test endpoints with Postman

### Frontend Issues

1. **API Calls Failing**
   - Verify `REACT_APP_API_URL` is correct
   - Check CORS settings in backend
   - Open browser console for errors

2. **Build Failures**
   - Check for syntax errors
   - Run `npm run build` locally
   - Review build logs in Vercel

3. **Blank Page**
   - Check browser console
   - Verify all routes are configured
   - Test locally first

## Local Testing Before Deployment

```bash
# Test backend
cd server
npm install
npm start

# In another terminal, test frontend
cd client
npm install
npm start
```

## Security Notes

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Rotate API keys regularly**
4. **Review MongoDB access rules**
5. **Enable HTTPS only** (handled by Vercel/Render)

## Performance Tips

1. **Render Free Tier** sleeps after inactivity
   - First request may take 30-60 seconds
   - Consider upgrading for production

2. **Optimize Images**
   - Use WebP format
   - Compress images

3. **Enable Caching**
   - Configure in Vercel settings
   - Use CDN for assets

## Cost Estimates

- **MongoDB Atlas**: Free (512MB)
- **Render**: Free tier available (sleeps after inactivity)
- **Vercel**: Free (hobby projects)
- **RapidAPI JSearch**: Free tier with limits

Total: **$0/month** for development and testing!

## Support

If you encounter issues:
1. Check application logs
2. Review this guide
3. Open an issue on GitHub
4. Check Render/Vercel documentation
