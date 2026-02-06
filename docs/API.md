# SkillSwap API Documentation

Base URL: `http://localhost:5000/api/v1`

All endpoints return JSON responses. Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "creditBalance": 10
  }
}
```

### Login

**POST** `/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "creditBalance": 10
  }
}
```

---

## Skills

### Get All Skills

**GET** `/skills`

Retrieve paginated skills with optional filters.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `search` (string) - Search in title and description
- `category` (string) - Filter by category
- `level` (enum) - Filter by level: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
- `sortBy` (string) - Sort field: createdAt, credits, title
- `order` (string) - Sort order: asc, desc

**Example:**
```
GET /skills?search=react&category=Programming&level=INTERMEDIATE&page=1&limit=10
```

**Response (200):**
```json
{
  "skills": [
    {
      "id": 1,
      "title": "Web Development with React",
      "category": "Programming",
      "level": "INTERMEDIATE",
      "description": "Learn modern React development...",
      "duration": 10,
      "credits": 5,
      "owner": {
        "id": 2,
        "name": "Alice Johnson",
        "email": "alice@example.com"
      },
      "averageRating": 4.5,
      "reviewCount": 2,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Get Skill by ID

**GET** `/skills/:id`

Get detailed information about a specific skill.

**Response (200):**
```json
{
  "id": 1,
  "title": "Web Development with React",
  "category": "Programming",
  "level": "INTERMEDIATE",
  "description": "Learn modern React development...",
  "duration": 10,
  "credits": 5,
  "owner": {
    "id": 2,
    "name": "Alice Johnson",
    "email": "alice@example.com"
  },
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent teacher!",
      "exchange": {
        "learner": {
          "id": 3,
          "name": "Bob Smith"
        }
      }
    }
  ],
  "averageRating": 5.0,
  "reviewCount": 1
}
```

### Create Skill

**POST** `/skills` 🔒

Create a new skill (requires authentication).

**Request Body:**
```json
{
  "title": "Guitar Lessons for Beginners",
  "category": "Music",
  "level": "BEGINNER",
  "description": "Learn basic chords and strumming patterns",
  "duration": 5,
  "credits": 3
}
```

**Response (201):**
```json
{
  "message": "Skill created successfully",
  "skill": {
    "id": 10,
    "title": "Guitar Lessons for Beginners",
    "category": "Music",
    "level": "BEGINNER",
    "description": "Learn basic chords and strumming patterns",
    "duration": 5,
    "credits": 3,
    "ownerId": 1,
    "owner": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Update Skill

**PUT** `/skills/:id` 🔒

Update an existing skill (owner or admin only).

**Request Body:**
```json
{
  "title": "Advanced Guitar Techniques",
  "credits": 5
}
```

**Response (200):**
```json
{
  "message": "Skill updated successfully",
  "skill": { /* updated skill object */ }
}
```

### Delete Skill

**DELETE** `/skills/:id` 🔒

Delete a skill (owner or admin only).

**Response (200):**
```json
{
  "message": "Skill deleted successfully"
}
```

---

## Exchanges

### Create Exchange Request

**POST** `/exchanges` 🔒

Request to learn a skill from another user.

**Request Body:**
```json
{
  "skillId": 1,
  "duration": 10
}
```

**Response (201):**
```json
{
  "message": "Exchange request created successfully",
  "exchange": {
    "id": 1,
    "teacherId": 2,
    "learnerId": 1,
    "skillId": 1,
    "duration": 10,
    "credits": 5,
    "status": "PENDING",
    "teacher": { /* teacher info */ },
    "learner": { /* learner info */ },
    "skill": { /* skill info */ }
  }
}
```

### Get User Exchanges

**GET** `/exchanges` 🔒

Get all exchanges for the authenticated user (as teacher or learner).

**Response (200):**
```json
{
  "exchanges": [
    {
      "id": 1,
      "teacherId": 2,
      "learnerId": 1,
      "skillId": 1,
      "duration": 10,
      "credits": 5,
      "status": "PENDING",
      "teacher": { /* teacher info */ },
      "learner": { /* learner info */ },
      "skill": { /* skill info */ },
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### Update Exchange Status

**PATCH** `/exchanges/:id/status` 🔒

Accept, reject, or complete an exchange.

**Request Body:**
```json
{
  "status": "ACCEPTED"
}
```

Valid status values:
- `ACCEPTED` - Teacher accepts the request (credits transferred)
- `REJECTED` - Teacher rejects the request
- `COMPLETED` - Either party marks exchange as complete

**Response (200):**
```json
{
  "message": "Exchange accepted successfully",
  "exchange": { /* updated exchange object */ }
}
```

---

## Users

### Get Profile

**GET** `/users/profile` 🔒

Get current user's profile.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "creditBalance": 15,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Dashboard

**GET** `/users/dashboard` 🔒

Get comprehensive dashboard data for the user.

**Response (200):**
```json
{
  "creditBalance": 15,
  "skills": [ /* user's skills */ ],
  "exchangesAsTeacher": [ /* exchanges where user is teaching */ ],
  "exchangesAsLearner": [ /* exchanges where user is learning */ ],
  "stats": {
    "totalSkills": 3,
    "totalExchangesAsTeacher": 5,
    "totalExchangesAsLearner": 2,
    "pendingRequests": 1
  }
}
```

---

## Admin

All admin endpoints require authentication with ADMIN role.

### Get All Users

**GET** `/admin/users` 🔒👑

Get all users in the system.

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "creditBalance": 15,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "skills": 3,
        "exchangesAsTeacher": 5,
        "exchangesAsLearner": 2
      }
    }
  ]
}
```

### Delete User

**DELETE** `/admin/users/:id` 🔒👑

Delete a user and all their associated data.

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

### Delete Skill

**DELETE** `/admin/skills/:id` 🔒👑

Delete any skill (admin override).

**Response (200):**
```json
{
  "message": "Skill deleted successfully"
}
```

---

## Error Responses

All endpoints may return error responses:

**400 Bad Request:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid token",
  "message": "The provided token is invalid"
}
```

**403 Forbidden:**
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "error": "Not found",
  "message": "The requested resource was not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Flow

1. Register or login to receive a JWT token
2. Include the token in the Authorization header for protected endpoints
3. Token expires after 7 days (configurable)
4. If token expires, login again to get a new token

---

## Credit System

- New users start with 10 credits
- When an exchange is **ACCEPTED**, credits are transferred from learner to teacher
- Credits are only transferred once (on acceptance)
- Rejected exchanges don't transfer credits
- Completed exchanges don't transfer additional credits

---

🔒 = Requires authentication  
👑 = Requires ADMIN role
