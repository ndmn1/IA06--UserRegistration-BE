# User Registration Backend

A simple NestJS backend for user registration with PostgreSQL (Neon) database.

## Features

- User registration with email and password
- Password hashing with bcrypt
- Input validation
- Unique email constraint
- CORS enabled for frontend integration
- Error handling with meaningful messages

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment configuration:**
   Update the `.env` file with your Neon PostgreSQL database URL:

   ```
   DATABASE_URL=your_neon_postgres_database_url_here
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   ```

3. **Run the application:**

   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## API Endpoints

### POST /user/register

Register a new user.

**Request body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2025-11-23T10:00:00.000Z"
  }
}
```

**Error Responses:**

- **400 Bad Request** (Validation errors):

```json
{
  "statusCode": 400,
  "timestamp": "2025-11-23T10:00:00.000Z",
  "path": "/user/register",
  "message": [
    "Email is required",
    "Password must be at least 6 characters long"
  ]
}
```

- **409 Conflict** (Email already exists):

```json
{
  "statusCode": 409,
  "timestamp": "2025-11-23T10:00:00.000Z",
  "path": "/user/register",
  "message": "User with this email already exists"
}
```

## Database Schema

**User Table:**

- `id` (Primary Key, Auto-increment)
- `email` (String, Unique, Required)
- `password` (String, Hashed, Required)
- `createdAt` (Timestamp, Auto-generated)

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 10
- Input validation using class-validator
- CORS configured for frontend origins
- Environment variables for sensitive configuration
