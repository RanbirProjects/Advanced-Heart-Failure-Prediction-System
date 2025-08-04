# Heart Failure Prediction System - Deployment Guide

This guide will help you deploy the Heart Failure Prediction System to production.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd heart-failure-prediction-system
   ```

2. **Run the deployment script**
   ```bash
   ./deploy.sh
   ```

3. **Follow the setup instructions below**

## 📋 Prerequisites

- Node.js 16 or higher
- npm or yarn
- MongoDB database (local or cloud)
- Git
- Python 3.8+ (for ML model)

## 🛠️ Backend Setup

### 1. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cp backend/env.example backend/.env
```

Edit `backend/.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heart_failure_db
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Database Setup

#### Option A: MongoDB Atlas (Recommended for production)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

#### Option B: Local MongoDB

```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### 3. ML Model Setup

Install Python dependencies:

```bash
cd backend/ml
pip install -r requirements.txt
cd ../..
```

### 4. Backend Deployment

#### Option A: Heroku

1. Install Heroku CLI
2. Create a new Heroku app:
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```

4. Deploy:
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

#### Option B: Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically

#### Option C: DigitalOcean App Platform

1. Create a new app in DigitalOcean
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

## 🎨 Frontend Setup

### 1. Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### 2. Build the Application

```bash
cd frontend
npm run build
```

### 3. Frontend Deployment

#### Option A: Netlify (Recommended)

1. **Using Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   cd frontend
   netlify deploy --prod --dir=build
   ```

2. **Using Netlify Dashboard:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `frontend/build`
   - Add environment variables

3. **Update netlify.toml:**
   Replace `https://your-backend-url.com` with your actual backend URL

#### Option B: Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel --prod
   ```

#### Option C: GitHub Pages

1. Add to `package.json`:
   ```json
   {
     "homepage": "https://your-username.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

2. Deploy:
   ```bash
   npm run deploy
   ```

## 🔧 Configuration

### CORS Settings

Update CORS origin in your backend `.env`:

```env
CORS_ORIGIN=https://your-frontend-domain.com
```

### API URL Configuration

Update the API URL in your frontend `.env`:

```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### End-to-End Testing

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Test the application at `http://localhost:3000`

## 📊 Monitoring

### Health Check

Your backend includes a health check endpoint:

```
GET https://your-backend-url.com/api/health
```

### Logs

- **Heroku:** `heroku logs --tail`
- **Railway:** View logs in dashboard
- **Netlify:** View logs in dashboard

## 🔒 Security

### Environment Variables

Never commit sensitive information to Git:

- JWT secrets
- Database credentials
- API keys

### SSL/HTTPS

Ensure your production deployment uses HTTPS:

- Netlify provides SSL automatically
- Heroku provides SSL automatically
- Configure SSL for custom domains

## 🚀 Performance Optimization

### Frontend

1. **Code Splitting:** Already configured in React
2. **Image Optimization:** Use WebP format
3. **Caching:** Configured in `netlify.toml`

### Backend

1. **Database Indexing:** Already configured in models
2. **Rate Limiting:** Configured in server
3. **Compression:** Enabled with helmet

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          npm install
          cd backend && npm install
          cd ../frontend && npm install
          
      - name: Build frontend
        run: cd frontend && npm run build
        
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './frontend/build'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check CORS_ORIGIN in backend .env
   - Ensure frontend URL is correct

2. **Database Connection:**
   - Verify MongoDB URI
   - Check network connectivity

3. **Build Failures:**
   - Check Node.js version
   - Clear npm cache: `npm cache clean --force`

4. **ML Model Issues:**
   - Install Python dependencies
   - Check Python version (3.8+)

### Support

- Check the logs for error messages
- Verify environment variables
- Test locally first
- Check network connectivity

## 📈 Scaling

### Database

- Use MongoDB Atlas for automatic scaling
- Implement database connection pooling
- Add read replicas for high traffic

### Application

- Use load balancers
- Implement caching (Redis)
- Use CDN for static assets

## 🔄 Updates

### Backend Updates

1. Update code
2. Test locally
3. Deploy to staging
4. Deploy to production

### Frontend Updates

1. Update code
2. Build and test
3. Deploy to Netlify

### Database Migrations

1. Create migration scripts
2. Test on staging
3. Apply to production

## 📞 Support

For issues and questions:

1. Check the README.md
2. Review the API documentation
3. Check the logs
4. Create an issue in the repository

---

**Happy Deploying! 🚀** 