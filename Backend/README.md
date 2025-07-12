# Skill Swap Platform - Backend

A Node.js/Express backend for the Skill Swap Platform with MongoDB Atlas integration.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: Registration, login, profile management
- **Skill Swapping**: Create, manage, and track swap requests
- **Admin Panel**: User management, platform messages, analytics
- **Rating System**: User feedback and rating system
- **Security**: Rate limiting, CORS, helmet security headers

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Validation**: express-validator

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `env.example` to `.env`
   - Update the following variables:
     ```env
     # MongoDB Atlas Connection
     MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/skill_swap_db?retryWrites=true&w=majority
     
     # JWT Configuration
     JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
     
     # Server Configuration
     PORT=5000
     NODE_ENV=development
     ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### User Management
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `GET /api/users` - Get public users (Protected)
- `GET /api/users/:id` - Get user by ID (Protected)
- `PUT /api/users/:id/ban` - Ban/Unban user (Admin)

### Swap Requests
- `POST /api/swaps` - Create swap request (Protected)
- `GET /api/swaps` - Get user's swap requests (Protected)
- `GET /api/swaps/:id` - Get swap request by ID (Protected)
- `PUT /api/swaps/:id/status` - Update swap status (Protected)
- `PUT /api/swaps/:id/cancel` - Cancel swap request (Protected)
- `POST /api/swaps/:id/feedback` - Add feedback (Protected)

### Admin Routes
- `GET /api/admin/dashboard` - Get admin dashboard stats (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `GET /api/admin/swaps` - Get all swap requests (Admin)
- `POST /api/admin/messages` - Create admin message (Admin)
- `GET /api/admin/messages` - Get admin messages (Admin)
- `PUT /api/admin/messages/:id` - Update admin message (Admin)
- `DELETE /api/admin/messages/:id` - Delete admin message (Admin)

### Public Routes
- `GET /api/messages` - Get platform messages (Public)
- `GET /health` - Health check (Public)

## Database Models

### User Model
- Basic info: name, email, password, location, profile photo
- Skills: offered and wanted skills with descriptions and levels
- Availability: weekdays, weekends, evenings, custom schedule
- Privacy: public/private profile setting
- Rating system: average rating and count
- Admin features: role, ban status

### SwapRequest Model
- Requester and recipient references
- Skills offered and requested
- Status: pending, accepted, rejected, cancelled, completed
- Message and proposed schedule
- Feedback system with ratings and comments

### AdminMessage Model
- Platform-wide messages from admins
- Message types: info, warning, alert, update
- Priority levels and expiration dates
- Active/inactive status

## Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse with express-rate-limit
- **CORS**: Configured for frontend integration
- **Helmet**: Security headers for protection
- **Input Validation**: Express-validator for data validation

## Error Handling

- Centralized error handling middleware
- Consistent error response format
- Mongoose error handling (validation, duplicate keys, etc.)
- Unhandled promise rejection handling

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration time

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set strong JWT secret
4. Configure CORS origins for production domain
5. Set up proper logging and monitoring

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Write clear commit messages
5. Test all endpoints before submitting

## License

MIT License 