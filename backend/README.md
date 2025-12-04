# Taxi Booking System - Backend

A modern, real-time taxi booking backend built with Node.js, Express, MongoDB, and TypeScript.

## Features

- ✅ User Authentication (Signup/Signin with JWT)
- ✅ Role-based Access Control (Rider, Driver, Admin)
- ✅ MongoDB integration with Mongoose
- ✅ Password hashing with bcrypt
- ✅ Input validation with Joi
- ✅ Real-time updates with Socket.io
- ✅ TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:

```bash
cd backend
npm install
```

2. Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

3. Update `.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taxi_booking_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

## Running the Server

Development mode (with hot reload):

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## API Endpoints

### Authentication

#### Signup

- **POST** `/api/auth/signup`
- **Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210",
  "role": "rider" // or "driver"
}
```

#### Signin

- **POST** `/api/auth/signin`
- **Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)

- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer {token}`

## Response Format

### Success Response

```json
{
  "message": "Success message",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "9876543210",
    "role": "rider",
    "isVerified": false
  }
}
```

### Error Response

```json
{
  "error": "Error message"
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts           # MongoDB connection
│   ├── controllers/
│   │   └── authController.ts     # Auth logic
│   ├── middleware/
│   │   └── authMiddleware.ts     # JWT verification
│   ├── models/
│   │   └── User.ts               # User schema
│   ├── routes/
│   │   └── authRoutes.ts         # Auth endpoints
│   ├── validations/
│   │   └── authValidation.ts     # Input validation
│   └── index.ts                  # Server entry point
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

## Next Tasks

- [ ] Create Ride booking endpoints
- [ ] Implement geolocation services
- [ ] Add real-time tracking with Socket.io
- [ ] Create driver acceptance/rejection logic
- [ ] Implement fare calculation
- [ ] Add ride history endpoints
- [ ] Admin dashboard APIs
- [ ] Payment integration

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Validation:** Joi
- **Language:** TypeScript
- **Real-time:** Socket.io (for future implementation)

## License

MIT
