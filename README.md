# CineVerse 🎬

**CineVerse** is a modern, full-stack web application designed for movie enthusiasts. It allows users to explore movies, manage bookings, and interact with a dynamic movie database. This project serves as the final assignment for the Web Technologies and Services course.

## 🚀 Tech Stack

### Backend (Server-side)
- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: PostgreSQL
- **ORM/Query Builder**: Knex.js
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Validation**: Zod
- **API Documentation**: Swagger UI Express
- **File Handling**: Multer (for avatar/image uploads)

### Frontend (Client-side)
- **Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Data Fetching**: TanStack Query (Vue Query)
- **Styling**: Bootstrap 5, FontAwesome
- **Routing**: Vue Router
- **HTTP Client**: Axios

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (running instance)
- **npm** or **yarn**

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CineVerse.git
cd CineVerse-master
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:

```bash
cd backend-api
npm install
```

**Configuration:**
Create a `.env` file in the `backend-api` directory based on your environment needs. Example variables typically include:
```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=cineverse_db
JWT_SECRET=your_jwt_secret_key
```

**Database Migration:**
Run migrations to set up the database schema (ensure your Postgres server is running):
```bash
# Verify knex commands in package.json or run directly if installed globally
npx knex migrate:latest
npx knex seed:run # If seeds are available
```

**Start the Server:**
```bash
npm run dev
# Server generally runs at http://localhost:3000
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend-spa
npm install
```

**Start the Application:**
```bash
npm run dev
# Application usually runs at http://localhost:5173
```

---

## 📚 API Documentation

Once the backend server is running, you can access the full API documentation via Swagger UI:
- **URL**: `http://localhost:3000/api-docs` (Default path, may vary based on `server.js` config)

---

## ✨ Key Features

- **User Authentication**: Secure registration and login using JWT.
- **Movie Management**: Browse, search, and view movie details.
- **Responsive UI**: Built with Bootstrap 5 for mobile and desktop compatibility.
- **Optimized Data Fetching**: Utilizes Vue Query for caching and efficient server state management.
- **Interactive Components**: Dynamic user interface powered by Vue 3.

---

## 📄 License

This project is for educational purposes.
