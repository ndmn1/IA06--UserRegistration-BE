# User Registration Backend

NestJS backend with JWT authentication, PostgreSQL, and Drizzle ORM.

## Quick Start

1. **Install:**

   ```bash
   npm install
   ```

2. **Environment (.env):**

   ```env
   DATABASE_URL=your_postgresql_url
   JWT_SECRET=your_secret
   CORS_ORIGINS=http://localhost:5173
   ```
  - **Note**: If you don't have a PostgreSQL instance, you can create a free Neon database — see [Neon](https://neon.tech/). After creating a project, copy the connection string from the Neon dashboard and paste it into DATABASE_URL in your .env.

3. **Database:**

   ```bash
   npm run db:push
   ```

4. **Run:**

   ```bash
   npm run start:dev
   ```

5. **API Docs:** http://localhost:3000/api/docs

## Scripts

- `npm run start:dev` - Development server
- `npm run db:push` - Setup database
- `npm run db:studio` - Database GUI

## API Endpoints

- `POST /user/register` - Register user
- `POST /user/login` - Login user
- `GET /user/profile` - Get profile (JWT required)

## Tech Stack

NestJS • PostgreSQL • Drizzle ORM • JWT • Swagger
