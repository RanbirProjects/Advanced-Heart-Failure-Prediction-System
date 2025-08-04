# Heart Failure Prediction System

A comprehensive web application for predicting heart failure risk using machine learning algorithms. Built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a modern UI with animations.

## Features

- 🫀 **Heart Failure Risk Prediction**: Advanced ML model for risk assessment
- 🎨 **Modern UI/UX**: Beautiful interface with smooth animations
- 📊 **Data Visualization**: Interactive charts and graphs
- 🔐 **User Authentication**: Secure login and registration
- 📱 **Responsive Design**: Works on all devices
- 🚀 **Real-time Predictions**: Instant risk assessment
- 📈 **Patient History**: Track and manage patient records

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Chart.js for data visualization
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

### Machine Learning
- Python with scikit-learn
- Heart failure prediction model
- REST API integration

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Python 3.8+ (for ML model)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd heart-failure-prediction-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment

### Netlify Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `frontend/build`
   - Add environment variables in Netlify dashboard

 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Predictions
- `POST /api/predictions` - Create new prediction
- `GET /api/predictions` - Get user predictions
- `GET /api/predictions/:id` - Get specific prediction

### Patients
- `POST /api/patients` - Add new patient
- `GET /api/patients` - Get all patients
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@heartfailureprediction.com or create an issue in the repository. 