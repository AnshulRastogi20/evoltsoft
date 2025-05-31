# EVoltSoft - Electric Vehicle Charging Station Management System

A comprehensive full-stack web application for managing electric vehicle charging stations with real-time monitoring, location-based services, and user management.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication system
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt
- Rate limiting for security

### ⚡ Charging Station Management
- Complete CRUD operations for charging stations
- Real-time status monitoring (Active, Inactive, Maintenance)
- Location-based search and filtering
- Support for multiple connector types (Type 1, Type 2, CCS, CHAdeMO, Tesla)
- Power output and pricing management

### 🗺️ Interactive Map Features
- Real-time map visualization with Leaflet
- Click-to-add station coordinates
- Station markers with status indicators
- User location detection
- Directions integration with Google Maps
- Responsive design for mobile devices

### 📊 Dashboard & Analytics
- Statistics overview (total stations, active stations, etc.)
- Advanced filtering and search capabilities
- Bulk operations support
- Export functionality

### 👤 User Profile Management
- Personal information management
- Password change functionality
- Activity tracking
- Data export capabilities

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **express-rate-limit** for rate limiting
- **Joi** for input validation

### Frontend
- **Vue.js 3** with Composition API
- **Vue Router** for navigation
- **Pinia** for state management
- **Bootstrap 5** for UI components
- **Leaflet** for interactive maps
- **Axios** for API communication
- **Vue Toastification** for notifications

### DevOps & Deployment
- **Docker** & Docker Compose
- **Nginx** for frontend serving
- **MongoDB** containerized database
- Health checks and monitoring

## 📁 Project Structure

```
evoltsoft/
├── backend/                    # Node.js/Express API
│   ├── config/                # Database configuration
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   ├── seedDatabase.js        # Database seeding script
│   ├── server.js              # Main server file
│   ├── Dockerfile             # Backend containerization
│   └── .env                   # Environment variables
├── frontend/                   # Vue.js application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── views/             # Page components
│   │   ├── stores/            # Pinia stores
│   │   ├── services/          # API services
│   │   └── router/            # Vue Router config
│   ├── Dockerfile             # Frontend containerization
│   └── nginx.conf             # Nginx configuration
└── docker-compose.yml         # Multi-container setup
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 7.0+ (for local development)
- Docker & Docker Compose (for containerized deployment)
- Git

### System Requirements
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 2GB free space
- **OS:** Windows 10+, macOS 10.15+, or Linux Ubuntu 18.04+

## 🚀 Quick Start Options

### Option 1: Automated Setup (Recommended for beginners)

#### Windows:
```bash
git clone <repository-url>
cd evoltsoft
start-dev.bat
```

#### Linux/macOS:
```bash
git clone <repository-url>
cd evoltsoft
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd evoltsoft
   ```

2. **Install MongoDB locally** (if not using Docker)
   - Download from https://www.mongodb.com/try/download/community
   - Start MongoDB service on port 27017

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env file with these contents:
   echo "NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/charging-station-management
   JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
   JWT_EXPIRES_IN=24h" > .env
   
   npm run seed    # Seed database with sample data
   npm start       # Start backend server
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   # Create .env file with these contents:
   echo "VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_NAME=EVoltSoft Charging Station Manager
   VITE_APP_VERSION=1.0.0" > .env
   
   npm run dev     # Start development server
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs

### Option 3: Docker Deployment (Production)

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000

## 🔑 Default Test Accounts

After running the seed script, you can use these test accounts:

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@evoltsoft.com | admin123 |
| User  | user@evoltsoft.com | user123 |

## 📊 Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'user', 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

### Charging Station Model
```javascript
{
  name: String,
  location: {
    address: String,
    coordinates: [Number, Number] // [longitude, latitude]
  },
  status: String (enum: 'Active', 'Inactive', 'Maintenance'),
  powerOutput: Number, // in kW
  connectorType: String,
  pricePerKWh: Number,
  isAvailable: Boolean,
  description: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Charging Stations
- `GET /api/stations` - Get all stations (with filters)
- `POST /api/stations` - Create new station
- `GET /api/stations/:id` - Get station by ID
- `PUT /api/stations/:id` - Update station
- `DELETE /api/stations/:id` - Delete station
- `GET /api/stations/nearby` - Find nearby stations

## 🎨 Frontend Components

### Core Views
- **Login/Register** - Authentication forms
- **Dashboard** - Station management interface
- **MapView** - Interactive map with station markers
- **Profile** - User profile management

### Reusable Components
- **StationModal** - Add/Edit station form
- **DeleteConfirmModal** - Confirmation dialog
- **NavBar** - Navigation component
- **AppFooter** - Footer component

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** on both frontend and backend
- **CORS Protection** with allowed origins
- **Security Headers** using Helmet
- **Environment Variables** for sensitive data

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Progressive Web App capabilities

## 🚀 Deployment Options

### 1. Docker Deployment (Recommended for self-hosting)
```bash
# Production deployment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Production Cloud Deployment (Recommended)
**Stack**: MongoDB Atlas + Render + Vercel

**Quick deployment:**
1. Fork this repository
2. Follow the detailed [DEPLOYMENT.md](./DEPLOYMENT.md) guide
3. Deploy in this order:
   - Setup MongoDB Atlas (Database)
   - Deploy backend to Render
   - Deploy frontend to Vercel

**Live Demo**: [https://evoltsoft.vercel.app](https://evoltsoft.vercel.app) *(when deployed)*

### 3. Manual Deployment
- Setup MongoDB server
- Deploy backend to Node.js hosting (Heroku, DigitalOcean, AWS)
- Build and deploy frontend to static hosting (Netlify, Vercel, S3)

### 4. Alternative Cloud Options
- **Database**: MongoDB Atlas, AWS DocumentDB
- **Backend**: Heroku, Railway, DigitalOcean App Platform, AWS Elastic Beanstalk
- **Frontend**: Netlify, GitHub Pages, AWS S3 + CloudFront

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm run test

# E2E tests
npm run test:e2e
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. "Port 3000 already in use"
```bash
# Find process using port 3000
netstat -ano | findstr :3000
# Kill the process (Windows)
taskkill /PID <process_id> /F
# Kill the process (Linux/macOS)
kill -9 <process_id>
```

#### 2. "Cannot connect to MongoDB"
- Ensure MongoDB is running on port 27017
- Check firewall settings
- For Docker: `docker-compose logs mongodb`

#### 3. "Frontend shows blank page"
- Check browser console for JavaScript errors
- Verify backend is running on port 3000
- Clear browser cache and localStorage

#### 4. "CORS errors"
- Ensure frontend is running on port 5173
- Check `VITE_API_BASE_URL` in frontend/.env

#### 5. "Authentication not working"
- Check JWT_SECRET in backend/.env
- Clear browser localStorage
- Verify token expiration settings

### Debug Commands:
```bash
# Check backend status
curl http://localhost:3000/health

# Check API endpoints
curl http://localhost:3000/api/stations

# View backend logs
cd backend && npm run dev

# View frontend in debug mode
cd frontend && npm run dev -- --debug
```

## 📈 Performance Optimizations

- **Database Indexing** for geospatial queries
- **Image Optimization** and lazy loading
- **Code Splitting** in Vue.js
- **Gzip Compression** in production
- **CDN Integration** for static assets
- **Caching Strategies** for API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@evoltsoft.com
- 📖 Documentation: [docs.evoltsoft.com](https://docs.evoltsoft.com)
- 🐛 Issues: [GitHub Issues](https://github.com/evoltsoft/issues)

## 🙏 Acknowledgments

- Vue.js community for excellent documentation
- Leaflet for the amazing mapping library
- MongoDB for the flexible database solution
- All contributors and beta testers

---

Made with ❤️ by the EVoltSoft Team
