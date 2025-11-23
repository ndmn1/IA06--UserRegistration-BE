# User Registration Backend with Drizzle ORM

A simple NestJS backend for user registration with PostgreSQL (Neon) database using Drizzle ORM.

## Features

- ✅ User registration with email and password
- ✅ Password hashing with bcrypt
- ✅ Input validation with class-validator
- ✅ Unique email constraint
- ✅ CORS enabled for frontend integration
- ✅ Error handling with meaningful messages
- ✅ Drizzle ORM for type-safe database operations
- ✅ Neon PostgreSQL support

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   Update the `.env` file with your Neon PostgreSQL database URL:
   ```env
   DATABASE_URL=your_neon_postgres_database_url_here
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   ```

3. **Database setup:**
   ```bash
   # Push schema to database (creates tables)
   npm run db:push
   
   # Or generate and run migrations
   npm run db:generate
   npm run db:migrate
   ```

4. **Run the application:**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## Database Scripts

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema directly to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

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
  "message": ["Please provide a valid email address", "Password must be at least 6 characters long"]
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

**Users Table (PostgreSQL):**
```sql
CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "email" text NOT NULL UNIQUE,
  "password" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
```

## Technology Stack

- **Framework:** NestJS
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Validation:** class-validator
- **Authentication:** bcryptjs for password hashing
- **Environment:** dotenv for configuration

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 10
- Input validation using class-validator decorators
- CORS configured for frontend origins
- Environment variables for sensitive configuration
- SQL injection protection via Drizzle ORM

## Project Structure

```
src/
├── db/
│   ├── schema.ts           # Database schema definition
│   ├── drizzle.module.ts   # Drizzle module for NestJS
│   └── migrations/         # Generated migration files
├── user/
│   ├── dto/               # Data Transfer Objects
│   ├── user.controller.ts # API endpoints
│   ├── user.service.ts    # Business logic
│   └── user.module.ts     # User module
├── filters/
│   └── all-exceptions.filter.ts # Global error handling
├── app.module.ts          # Main app configuration
└── main.ts               # Application bootstrap
```

## Testing

Test the API using the included test file:
```bash
node test-drizzle-api.mjs
```

Or use curl/Postman:
```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```