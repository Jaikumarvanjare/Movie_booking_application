# 🎬 Movie Booking Application (Full Stack)

This project is a **full-stack movie booking system** that allows users to browse movies, view theatres, and book tickets.

Currently, the **backend API is fully implemented**, and the **frontend interface will be developed next** to interact with these APIs.

The system is designed using **Node.js, Express, MongoDB, and JWT authentication**, following a clean backend architecture.

---

# 🛠 Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt (password hashing)

## Frontend (Planned)

* React.js
* Axios
* React Router
* TailwindCSS / CSS

---

# 📁 Project Structure

```
project-root
│
├── controllers
│
├── services
│
├── models
│
├── middlewares
│
├── routes
│
├── utils
│
├── config
│
└── server.js
```

Each layer has a specific responsibility.

---

# 🧠 Backend Architecture

The backend follows a **layered architecture** to maintain clean separation of concerns.

```
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

Handle request and response objects.

### Services

Contain business logic and interact with the database.

### Models

Define database schemas using Mongoose.

---

# 🔐 Authentication System

Authentication is implemented using **JWT tokens**.

### Signup Flow

```
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
User saved in database
```

---

### Signin Flow

```
Client → Login Request
        ↓
Validate email and password
        ↓
Fetch user from database
        ↓
Compare password using bcrypt
        ↓
Generate JWT token
        ↓
Return token to client
```

Token example:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 👤 User Roles

The system supports role-based access control.

```
CUSTOMER
ADMIN
CLIENT
```

Authorization middleware ensures that certain APIs are accessible only to specific roles.

Example:

* Admin → manage movies and theatres
* Customer → browse and book tickets

---

# 🎥 Movie Module

Movies can be created, updated, deleted, and fetched.

Movie schema includes:

* name
* description
* casts
* trailerUrl
* language
* releaseDate
* director
* releaseStatus

Example movie document:

```
{
  name: "Avengers",
  description: "Marvel superhero movie",
  casts: ["Robert Downey Jr"],
  releaseDate: "2019",
  director: "Russo Brothers"
}
```

---

# 🎭 Theatre Module

Theatre schema includes:

* name
* city
* pincode
* address
* movies (array of movie IDs)

Example:

```
{
  name: "PVR Cinemas",
  city: "Delhi",
  pincode: 110001,
  movies: [movieId1, movieId2]
}
```

Movies can be added or removed using MongoDB operators.

```
$addToSet
$pull
```

---

# 🔎 Filtering and Pagination

Theatres can be filtered using query parameters.

Example:

```
GET /theatres?city=Delhi
GET /theatres?pincode=110001
GET /theatres?movieId=abc123
```

Pagination example:

```
GET /theatres?limit=5&skip=1
```

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

## Theatre Movies

```
PATCH /mba/api/v1/theatres/:id/movies
GET   /mba/api/v1/theatres/:id/movies
GET   /mba/api/v1/theatres/:theatreId/movies/:movieId
```

---

# 💻 Frontend (Upcoming)

The frontend will be built using **React.js** and will interact with the backend APIs.

Planned features:

* User authentication UI
* Browse movies
* Browse theatres
* Movie details page
* Booking interface
* Admin dashboard
* Seat selection system

Frontend will communicate with backend APIs using **Axios**.

---

# 🚀 Running the Backend

### Install dependencies

```
npm install
```

---

### Setup environment variables

Create `.env`

```
PORT=3000
MONGO_URI=your_mongodb_connection
AUTH_KEY=your_secret_key
```

---

### Start server

```
npm start
```

Server runs on:

```
http://localhost:3000
```

---

# 📌 Current Features

✔ User signup
✔ User login
✔ JWT authentication
✔ Role-based authorization
✔ Movie CRUD APIs
✔ Theatre CRUD APIs
✔ Assign movies to theatres
✔ Filtering and pagination

---

# 🔮 Future Improvements

Planned backend features:

* Show model (movie show timings)
* Seat management
* Booking system
* Payment integration
* Logging system
* Centralized error handling

---

# 📚 Learning Goals

This project helped in learning:

* REST API design
* Backend architecture
* Authentication and authorization
* MongoDB schema design
* Middleware usage
* Full-stack development
