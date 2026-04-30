# Team Task Manager

A full-stack project management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Role-Based Access Control**: Admin and Member roles.
- **Projects**: Create projects and add members.
- **Tasks**: Create tasks within projects, assign users, and track status via a Kanban-style board.
- **Dashboard**: Real-time statistics of projects and tasks.
- **Modern UI**: Clean, responsive interface built with Tailwind CSS.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), bcrypt

---

## Local Development Setup

### 1. Clone/Download the Repository
Make sure you are in the root directory `Proj` which contains `backend` and `frontend`.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Update `MONGO_URI` with your MongoDB connection string.
   - Update `JWT_SECRET` with a secure random string.
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *(Ensure you add `"dev": "node server.js"` or use `nodemon` in `package.json` scripts)*

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Ensure `VITE_API_URL` points to your backend (default is `http://localhost:5000/api`).
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Deployment Guide

### Deploying the Backend (Railway)
1. Push your code to GitHub.
2. Log in to [Railway](https://railway.app/).
3. Click **New Project** > **Deploy from GitHub repo**.
4. Select your repository.
5. Railway will automatically detect the Node.js environment.
6. **Important**: Go to the **Variables** tab in Railway and add:
   - `MONGO_URI`: Your MongoDB Atlas production connection string.
   - `JWT_SECRET`: A secure random string for production.
   - `PORT`: (Railway sets this automatically, but you can define it if needed).
7. Change the root directory settings in Railway if it doesn't automatically detect the `backend` folder (Settings > Service > Root Directory = `/backend`).
8. Deploy and copy the generated public URL.

### Deploying the Frontend (Vercel or Railway)
**Using Vercel (Recommended for Frontend):**
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New Project** and select your GitHub repository.
3. Configure the project:
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
4. Expand **Environment Variables** and add:
   - Name: `VITE_API_URL`
   - Value: `[YOUR_RAILWAY_BACKEND_URL]/api` (e.g., `https://my-backend.up.railway.app/api`)
5. Click **Deploy**.

**Using Railway (Alternative):**
1. Follow similar steps as the backend deployment.
2. Set the Root Directory to `/frontend`.
3. Add the `VITE_API_URL` variable.
4. Add a custom start command for production: `npm run build && npm run preview` (or configure a static site deployment).

---

## Usage Guide
1. **Register**: Create a new account. By default, new users are created as `Members`. If you want an `Admin` user, you can manually update the `role` field in your MongoDB database to `"Admin"`.
2. **Projects**: Admins can create projects and view them on the Dashboard.
3. **Tasks**: Inside a project, Admins can create tasks. Both Admins and Members can update task statuses.
