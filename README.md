# 🎬 Movie Booking Application

A backend system that allows users to browse movies, view theatres, book tickets, and complete payments.
The system is built using **Node.js, Express, MongoDB**, and follows a clean **layered backend architecture**.

This project also integrates a **Notification Microservice** that sends booking confirmation emails asynchronously.

---

# 🚀 Project Overview

The Movie Booking Application provides APIs for managing:

* Users
* Movies
* Theatres
* Shows
* Bookings
* Payments

After a successful payment, the system sends a request to the **Notification Service**, which sends a confirmation email to the user.

---

# 🛠 Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt
* Axios (service communication)

## Microservices

Notification system implemented as a **separate service**.

Notification Service Repository:

https://github.com/Jaikumarvanjare/NotificationService

---

# 🧠 Backend Architecture

The backend follows a **layered architecture**.

```text
Client
   │
   ▼
Routes
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Model
   │
   ▼
MongoDB
```

### Routes

Define API endpoints and connect them to controllers.

### Middleware

Handles validation, authentication, and authorization.

### Controllers

Handle HTTP requests and responses.

### Services

Contain the main business logic.

### Models

Define MongoDB schemas.

---

# 🔐 Authentication System

Authentication uses **JWT tokens**.

### Signup Flow

```text
Client → Signup Request
        ↓
Validation Middleware
        ↓
Controller
        ↓
Service
        ↓
User Model
        ↓
Password hashed using bcrypt
        ↓
User stored in MongoDB
```

### Signin Flow

```text
Client → Login Request
        ↓
Verify credentials
        ↓
Generate JWT token
        ↓
Return token
```

Token example:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 👤 User Roles

Role-based access control is implemented.

Roles supported:

```
CUSTOMER
ADMIN
CLIENT
```

Example permissions:

Admin:

* Create movies
* Manage theatres
* Manage shows

Customer:

* Browse movies
* Book tickets
* Make payments

---

# 🎥 Movie Module

Handles movie management.

Features:

* Create movie
* Update movie
* Delete movie
* Fetch movie list

Movie schema example:

```json
{
  "name": "Avengers",
  "description": "Marvel superhero movie",
  "casts": ["Robert Downey Jr"],
  "releaseDate": "2019",
  "director": "Russo Brothers"
}
```

---

# 🎭 Theatre Module

Stores theatre information.

Fields include:

* theatre name
* city
* pincode
* address
* available movies

Example:

```json
{
  "name": "PVR Cinemas",
  "city": "Delhi",
  "pincode": 110001
}
```

Movies can be attached to theatres using MongoDB operators.

```
$addToSet
$pull
```

---

# 🎬 Show Module

Represents movie show timings.

Each show connects:

```
Movie
Theatre
Timing
Seat configuration
```

Shows help determine seat availability and pricing.

---

# 🎟 Booking Module

Handles ticket booking.

Booking includes:

* movieId
* theatreId
* timing
* seat selection
* number of seats
* total cost
* booking status

Example booking:

```json
{
  "movieId": "6996c60706c06f11bc76d95b",
  "theatreId": "699850ff8cb91b62e4233133",
  "timing": "23:30",
  "noOfSeats": 3,
  "totalCost": 909,
  "status": "SUCCESSFULL"
}
```

---

# 💳 Payment Module

Handles payment processing.

Features:

* Create payment
* Validate payment amount
* Update booking status
* Reduce theatre seat availability

Payment success triggers a **notification email**.

---

# 📧 Notification Service Integration

After successful payment, the Movie Booking service calls the Notification Service.

```text
Payment Success
      │
      ▼
Call Notification API
      │
      ▼
Notification Service
      │
      ▼
Queue (BullMQ)
      │
      ▼
Worker
      │
      ▼
Email Sent
```

Notification Service Repo:

https://github.com/Jaikumarvanjare/NotificationService

This service handles:

* asynchronous email sending
* retry logic
* background workers
* queue monitoring

---

# 📡 API Endpoints

## Authentication

```
POST   /mba/api/v1/auth/signup
POST   /mba/api/v1/auth/signin
PATCH  /mba/api/v1/auth/reset
```

---

## Movies

```
POST   /mba/api/v1/movies
GET    /mba/api/v1/movies
GET    /mba/api/v1/movies/:id
PATCH  /mba/api/v1/movies/:id
DELETE /mba/api/v1/movies/:id
```

---

## Theatres

```
POST   /mba/api/v1/theatres
GET    /mba/api/v1/theatres
GET    /mba/api/v1/theatres/:id
PATCH  /mba/api/v1/theatres/:id
DELETE /mba/api/v1/theatres/:id
```

---

## Bookings

```
POST   /mba/api/v1/bookings
GET    /mba/api/v1/bookings
GET    /mba/api/v1/bookings/:id
```

---

## Payments

```
POST   /mba/api/v1/payments
GET    /mba/api/v1/payments/:id
GET    /mba/api/v1/payments
```

---

## Profile And Account

Authenticated profile management endpoints for the mobile app:

```
GET    /mba/api/v1/users/me
PATCH  /mba/api/v1/users/me
POST   /mba/api/v1/auth/change-password
POST   /mba/api/v1/auth/logout
```

Rules:

* `Authorization: Bearer <token>` is required on all four routes
* `PATCH /users/me` only allows updating `name`
* `email`, `role`, `status`, and `createdAt` are read-only in profile responses
* `POST /auth/change-password` is the logged-in password flow
* `PATCH /auth/reset` remains the existing password reset flow
* `POST /auth/logout` is a stateless JWT acknowledgement endpoint in the current backend

Profile response shape returned to mobile:

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER",
      "status": "APPROVED",
      "createdAt": "2026-04-24T10:00:00.000Z"
    }
  },
  "err": {}
}
```

Update profile request:

```json
{
  "name": "Updated User Name"
}
```

Change password request:

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

Validation notes:

* `name` is required, trimmed, and must be at least 2 characters
* profile updates reject restricted fields such as `email`, `role`, `status`, and `password`
* `newPassword` must be at least 6 characters for the new logged-in change-password route

---

# 🚀 Running the Backend

Install dependencies:

```
npm install
```

Create `.env`

```
PORT=3000
DB_URL=your_mongodb_connection
AUTH_KEY=your_secret_key
NOTI_SERVICE=http://localhost:3001
```

Start server:

```
npm start
```

Server runs on:

```
http://localhost:3000
```

---

# 📌 Current Features

✔ User authentication
✔ JWT authorization
✔ Movie CRUD APIs
✔ Theatre CRUD APIs
✔ Show management
✔ Seat management
✔ Booking system
✔ Payment system
✔ Email notifications after successful booking

---

# 🔮 Future Improvements

Planned improvements:

* Frontend using React
* Seat selection UI
* Payment gateway integration
* Admin dashboard
* Analytics dashboard

---

# 📚 Learning Outcomes

This project demonstrates understanding of:

* REST API design
* Backend architecture
* Authentication and authorization
* MongoDB schema design
* Microservice integration
* Asynchronous processing
* Queue-based systems
