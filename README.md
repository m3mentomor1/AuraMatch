<div align="center">
  <h1>AuraMatch ---> Backend</h1>
</div>

This is the server/api side of AuraMatch built with Node.js, Express, PostgreSQL, and Supabase.

This backend and its database is currently deployed on Render. Click to check status: https://auramatch-oaij.onrender.com

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)

---

## Features

- **User Authentication**: Sign up, sign in with JWT-based authentication
- **User Profile Management**: Update profile information, profile pictures, and location
- **User Discovery**: Browse available users with filtering (age, distance, gender)
- **Swipe System**: Like or pass on users, automatic match detection
- **Real-time Messaging**: Send and receive messages with match partners
- **Location-based Matching**: Distance calculation using Haversine formula
- **Unread Message Tracking**: Track unread messages across conversations

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Storage**: Supabase (for profile pictures)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **CORS**: Enabled for cross-origin requests

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Supabase Account** - [Sign up](https://supabase.com/)

---

## Installation & Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/m3mentomor1/AuraMatch.git
cd AuraMatch

# Switch to the backend branch
git checkout backend
```

**Note:** The backend code is in the `backend` branch, not `main`.

### 2. Install Dependencies

**This step is required!** Install all project dependencies:

```bash
npm install
```

This will install all packages listed in `package.json`:

- `express` - Web framework
- `pg` - PostgreSQL client
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `multer` - File upload handling
- `@supabase/supabase-js` - Supabase client

If `package.json` doesn't exist, create it with:

```bash
npm init -y
npm install express pg cors dotenv jsonwebtoken bcryptjs multer @supabase/supabase-js
```

### 3. Supabase Storage Setup

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project (or use an existing one)
3. Navigate to **Storage** in the left sidebar
4. Create a new bucket named `profile-pictures`
5. Set the bucket to **Public** (Settings → Make public)
6. Copy your:
   - Project URL (found in Settings → API)
   - Anon/Public Key (found in Settings → API)

---

## Database Setup

### Schema Overview

<img width="898" height="749" alt="ERD" src="https://github.com/user-attachments/assets/ad6bfffa-f24a-4b84-a006-919242ff9493" />

The AuraMatch database consists of 4 main tables with the following relationships:

1. Tables:

- users: Stores user accounts and profile information
- matches: Bidirectional records of matched users
- swipes: Records of user swipe actions (like/pass)
- messages: Chat messages between matched users

2. Key Relationships:

- One user can have many matches (one-to-many)
- One user can have many swipes (one-to-many)
- One match can have many messages (one-to-many)
- Matches are bidirectional (each match creates two records)

### 1. Create the Database

Open your PostgreSQL client (psql, pgAdmin, or any SQL client):

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE auramatch;

# Exit psql
\q
```

### 2. Run the Schema

Navigate to your backend directory and run:

```bash
# Using psql
psql -U postgres -d auramatch -f schema.sql

# Or connect to the database first
psql -U postgres -d auramatch
# Then run: \i schema.sql
```

The schema creates:

- **users**: User account information and profiles
- **matches**: Bidirectional match records
- **swipes**: User swipe history (like/pass)
- **messages**: Chat messages between matched users
- **indexes**: Performance optimization for queries

### 3. Verify Database Setup

```bash
psql -U postgres -d auramatch

# List all tables
\dt

# You should see: users, matches, swipes, messages
```

---

## Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
touch .env
```

Add the following configuration (update with your actual values):

```properties
# Server Configuration
PORT=5000

# JWT Secret (Change this to a random secure string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=auramatch
DB_PASSWORD=your_database_password
DB_PORT=5432

# Supabase Configuration (Get from Supabase Dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_BUCKET_NAME=profile-pictures
```

**Important Security Notes:**

- Never commit `.env` to version control (already in `.gitignore`)
- Use a strong, random JWT_SECRET in production
- Keep your Supabase keys secure

---

## Running the Application

### Development Mode

```bash
npm run dev
# or
npm start
# or
node server.js
```

**Note:** If `npm run dev` doesn't work, you may need to add a dev script to your `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

For auto-restart on file changes, install nodemon:

```bash
npm install --save-dev nodemon
```

The server will start on `http://localhost:5000`

You should see:

```
Database connected successfully
Server running on port 5000
```

### Health Check

Test if the server is running:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## API Endpoints

### Authentication

#### Sign Up

```http
POST /api/auth/signup
Content-Type: multipart/form-data

Body (form-data):
- email: string (required)
- password: string (required)
- firstName: string (required)
- lastName: string (optional)
- age: number (required)
- gender: string (required) - "male", "female", or "other"
- bio: string (optional)
- profilePicture: file (required) - image file (jpg, png, gif)
```

Response:

```json
{
  "message": "Account created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "age": 25,
    "gender": "male",
    "bio": "Hello!",
    "profilePicture": "https://..."
  }
}
```

#### Sign In

```http
POST /api/auth/signin
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Signed in successfully",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### User Profile Management

#### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (form-data):
- firstName: string (required)
- lastName: string (optional)
- age: number (required)
- gender: string (optional)
- bio: string (optional)
- profilePicture: file (optional) - replaces existing picture
```

#### Update Location

```http
PUT /api/auth/location
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "latitude": 14.5995,
  "longitude": 120.9842,
  "locationCity": "Manila",
  "locationCountry": "Philippines"
}
```

#### Get Location

```http
GET /api/auth/location
Authorization: Bearer <token>
```

---

### User Discovery & Matching

#### Get Available Users

```http
GET /api/users?minAge=18&maxAge=35&maxDistance=50&genders=male,female
Authorization: Bearer <token>

Query Parameters:
- minAge: number (optional)
- maxAge: number (optional)
- maxDistance: number in km (optional, default 500)
- genders: comma-separated (optional, default "male,female,other")
```

Response:

```json
[
  {
    "id": 2,
    "firstName": "Jane",
    "lastName": "Smith",
    "age": 24,
    "gender": "female",
    "bio": "Adventure seeker",
    "profilePicture": "https://...",
    "distance": 15,
    "locationCity": "Quezon City",
    "locationCountry": "Philippines"
  }
]
```

#### Record Swipe

```http
POST /api/swipes
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "swipedUserId": 2,
  "swipeType": "like"  // or "pass"
}
```

Response:

```json
{
  "message": "Swipe recorded successfully",
  "isMatch": true,
  "matchId": 5
}
```

#### Get Matches

```http
GET /api/matches
Authorization: Bearer <token>
```

Response:

```json
[
  {
    "id": 2,
    "matchId": 5,
    "firstName": "Jane",
    "lastName": "Smith",
    "age": 24,
    "gender": "female",
    "bio": "Adventure seeker",
    "profilePicture": "https://...",
    "matchedAt": "2025-10-30T10:00:00.000Z",
    "unreadCount": 2,
    "lastMessage": "Hey there!",
    "lastMessageTime": "2025-10-30T15:30:00.000Z"
  }
]
```

#### Unmatch User

```http
DELETE /api/matches/:matchId
Authorization: Bearer <token>
```

---

### Messaging

#### Get Messages

```http
GET /api/matches/:matchId/messages
Authorization: Bearer <token>
```

Response:

```json
[
  {
    "id": 1,
    "message": "Hello!",
    "senderId": 1,
    "senderName": "John",
    "senderPicture": "https://...",
    "createdAt": "2025-10-30T10:00:00.000Z",
    "read": true
  }
]
```

#### Send Message

```http
POST /api/matches/:matchId/messages
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "message": "Hello! How are you?"
}
```

#### Get Unread Count

```http
GET /api/messages/unread-count
Authorization: Bearer <token>
```

Response:

```json
{
  "unreadCount": 5
}
```

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Lifecycle

- Tokens expire after **7 days**
- Include the token in every authenticated request
- Tokens are returned upon signup and signin

---

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message here"
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created (signup, message sent)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (access denied)
- **404**: Not Found
- **500**: Server Error

---

## Project Structure

```
backend/
├── src/
│   ├── Messaging-Chat/
│   │   ├── controller.js      # Message handling logic
│   │   └── routes.js           # Message routes
│   ├── User-Discovery-and-Matching/
│   │   ├── controller.js      # Matching logic
│   │   └── routes.js           # Matching routes
│   ├── User-Profile-Management/
│   │   ├── controller.js      # Profile logic
│   │   └── routes.js           # Profile routes
│   └── User-Registration-and-Login/
│       ├── controller.js      # Auth logic
│       ├── middleware.js      # JWT & Multer middleware
│       └── routes.js           # Auth routes
├── .env                        # Environment variables
├── .gitignore                 # Git ignore rules
├── db.js                      # Database connection
├── package.json               # Dependencies
├── schema.sql                 # Database schema
├── server.js                  # Express app entry point
└── supabase.js                # Supabase client & helpers
```

---

## Development Tips

### Testing with cURL

**Sign Up:**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -F "email=test@example.com" \
  -F "password=password123" \
  -F "firstName=John" \
  -F "age=25" \
  -F "gender=male" \
  -F "profilePicture=@/path/to/image.jpg"
```

**Sign In:**

```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get Users (with token):**

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the endpoints listed above
2. Set up environment variables for `baseUrl` and `token`
3. Use the Authorization tab for Bearer token
4. Use form-data for file uploads

### Database Queries

**View all users:**

```sql
SELECT id, email, first_name, age FROM users;
```

**View matches:**

```sql
SELECT m.id, u1.first_name as user1, u2.first_name as user2
FROM matches m
JOIN users u1 ON m.user_id = u1.id
JOIN users u2 ON m.matched_user_id = u2.id;
```

**View messages:**

```sql
SELECT m.message, u.first_name as sender, m.created_at
FROM messages m
JOIN users u ON m.sender_id = u.id
ORDER BY m.created_at DESC;
```

---

## Troubleshooting

### Database Connection Issues

**Error: "Database connection error"**

- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -l | grep auramatch`

### Supabase Upload Failures

**Error: "Failed to upload file"**

- Verify SUPABASE_URL and SUPABASE_KEY are correct
- Ensure bucket `profile-pictures` exists and is public
- Check file size (max 5MB)
- Verify file type (jpg, png, gif only)

### JWT Token Issues

**Error: "Invalid or expired token"**

- Token expired (7-day lifetime)
- Get a new token by signing in again
- Ensure token is in header: `Authorization: Bearer <token>`

### Port Already in Use

**Error: "Port 5000 already in use"**

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=3000
```

---

## Security Best Practices

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens expire after 7 days
- ✅ File uploads are validated (type, size)
- ✅ SQL injection protection via parameterized queries
- ✅ CORS enabled for controlled access
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Add rate limiting for production
- ⚠️ Implement refresh tokens for better security

---
