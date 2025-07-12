# Skill Swap Platform API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. User Authentication

#### Register User
```http
POST /users/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": "New York, NY"
}
```

**Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "John Doe",
  "email": "john@example.com",
  "location": "New York, NY",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "John Doe",
  "email": "john@example.com",
  "location": "New York, NY",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. User Management

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "John Doe",
  "email": "john@example.com",
  "location": "New York, NY",
  "profilePhoto": "https://example.com/photo.jpg",
  "skillsOffered": [
    {
      "name": "JavaScript",
      "description": "Frontend and backend development",
      "level": "advanced"
    }
  ],
  "skillsWanted": [
    {
      "name": "Python",
      "description": "Data science and machine learning",
      "level": "beginner"
    }
  ],
  "availability": {
    "weekdays": true,
    "weekends": false,
    "evenings": true,
    "customSchedule": "Weekdays 6-8 PM"
  },
  "isPublic": true,
  "role": "user",
  "rating": {
    "average": 4.5,
    "count": 10
  },
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "location": "Los Angeles, CA",
  "skillsOffered": [
    {
      "name": "React",
      "description": "Frontend development with React",
      "level": "expert"
    }
  ],
  "skillsWanted": [
    {
      "name": "Node.js",
      "description": "Backend development",
      "level": "intermediate"
    }
  ],
  "availability": {
    "weekdays": true,
    "weekends": true,
    "evenings": false,
    "customSchedule": "Weekends only"
  },
  "isPublic": false
}
```

#### Get Public Users
```http
GET /users?skill=javascript&location=New York&page=1&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "users": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "location": "New York, NY",
      "profilePhoto": "https://example.com/photo.jpg",
      "skillsOffered": [...],
      "skillsWanted": [...],
      "availability": {...},
      "rating": {
        "average": 4.5,
        "count": 10
      }
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

### 3. Swap Requests

#### Create Swap Request
```http
POST /swaps
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "recipientId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "skillOffered": {
    "name": "JavaScript",
    "description": "Frontend development",
    "level": "advanced"
  },
  "skillRequested": {
    "name": "Python",
    "description": "Data analysis",
    "level": "beginner"
  },
  "message": "I can help you with JavaScript in exchange for Python lessons",
  "proposedSchedule": "Weekends 2-4 PM"
}
```

**Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
  "requester": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "recipient": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "skillOffered": {...},
  "skillRequested": {...},
  "status": "pending",
  "message": "I can help you with JavaScript in exchange for Python lessons",
  "proposedSchedule": "Weekends 2-4 PM",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Get Swap Requests
```http
GET /swaps?status=pending&type=sent&page=1&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "swapRequests": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "requester": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "John Doe",
        "email": "john@example.com",
        "profilePhoto": "https://example.com/photo.jpg"
      },
      "recipient": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "profilePhoto": "https://example.com/photo2.jpg"
      },
      "skillOffered": {...},
      "skillRequested": {...},
      "status": "pending",
      "message": "I can help you with JavaScript in exchange for Python lessons",
      "proposedSchedule": "Weekends 2-4 PM",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1
}
```

#### Update Swap Status
```http
PUT /swaps/60f7b3b3b3b3b3b3b3b3b3b5/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "accepted"
}
```

#### Add Feedback
```http
POST /swaps/60f7b3b3b3b3b3b3b3b3b3b5/feedback
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great learning experience! Very patient and knowledgeable."
}
```

### 4. Admin Routes

#### Get Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "stats": {
    "totalUsers": 150,
    "bannedUsers": 3,
    "totalSwaps": 45,
    "pendingSwaps": 12,
    "completedSwaps": 28,
    "activeMessages": 2
  },
  "recentActivity": {
    "users": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "isBanned": false
      }
    ],
    "swaps": [...]
  }
}
```

#### Create Admin Message
```http
POST /admin/messages
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Platform Maintenance",
  "content": "We will be performing maintenance on Sunday from 2-4 AM EST.",
  "type": "warning",
  "priority": "high",
  "expiresAt": "2024-01-20T00:00:00.000Z"
}
```

### 5. Public Routes

#### Get Platform Messages
```http
GET /messages
```

**Response:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b6",
    "title": "Platform Maintenance",
    "content": "We will be performing maintenance on Sunday from 2-4 AM EST.",
    "type": "warning",
    "priority": "high",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "error": "Name is required, Email must be valid",
  "statusCode": 400
}
```

### Authentication Error
```json
{
  "success": false,
  "error": "Not authorized, token failed",
  "statusCode": 401
}
```

### Not Found Error
```json
{
  "success": false,
  "error": "User not found",
  "statusCode": 404
}
```

### Server Error
```json
{
  "success": false,
  "error": "Server error",
  "statusCode": 500
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Applies to all `/api/` routes

## CORS

- Development: `http://localhost:3000`, `http://localhost:5173`
- Production: Configure your frontend domain 