# 🐾 PawKeep Backend

A complete REST API backend for the PawKeep pet care management application.
Built with Node.js, Express, and MongoDB Atlas.

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Team](#team)

---

## 📌 About The Project

PawKeep is a pet care management application that helps pet owners:

- Manage pet profiles
- Book and track vet appointments
- Log vaccinations and health records
- Set reminders for medicines and vaccines
- View a dashboard with all pet statistics

This repository contains the complete backend REST API.

The frontend is a separate static website built with HTML, CSS, and JavaScript.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | Object Document Mapper |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Cloudinary | Image storage |
| Multer | File upload handling |
| CORS | Cross origin requests |
| dotenv | Environment variables |

---

## 📁 Project Structure
backend/
│
├── config/
│ ├── db.js # MongoDB Atlas connection
│ └── cloudinary.js # Cloudinary configuration
│
├── controllers/
│ ├── authController.js # Register, Login, Get Profile
│ ├── petController.js # Pet CRUD operations
│ ├── appointmentController.js # Appointment CRUD operations
│ ├── vaccinationController.js # Vaccination CRUD operations
│ ├── healthRecordController.js# Health Record CRUD operations
│ ├── reminderController.js # Reminder CRUD operations
│ ├── dashboardController.js # Dashboard statistics
│ └── uploadController.js # Image upload
│
├── middleware/
│ ├── authMiddleware.js # JWT token verification
│ └── uploadMiddleware.js # Multer file handling
│
├── models/
│ ├── User.js # User schema and model
│ ├── Pet.js # Pet schema and model
│ ├── Appointment.js # Appointment schema and model
│ ├── Vaccination.js # Vaccination schema and model
│ ├── HealthRecord.js # Health Record schema and model
│ └── Reminder.js # Reminder schema and model
│
├── routes/
│ ├── authRoutes.js # /api/auth endpoints
│ ├── petRoutes.js # /api/pets endpoints
│ ├── appointmentRoutes.js # /api/appointments endpoints
│ ├── vaccinationRoutes.js # /api/vaccinations endpoints
│ ├── healthRecordRoutes.js # /api/health-records endpoints
│ ├── reminderRoutes.js # /api/reminders endpoints
│ ├── dashboardRoutes.js # /api/dashboard endpoints
│ └── uploadRoutes.js # /api/upload endpoints
│
├── utils/
│ └── sendResponse.js # Standard API response helper
│
├── .env # Environment variables (not in git)
├── .gitignore # Files to ignore in git
├── package.json # Project dependencies
├── package-lock.json # Dependency lock file
└── server.js # Main entry point

text


---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- Node.js v22 or higher
- npm v11 or higher
- MongoDB Atlas account
- Cloudinary account

### Installation

**Step 1 — Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/pawkeep-backend.git
Step 2 — Go to project folder

Bash

cd pawkeep-backend
Step 3 — Install dependencies

Bash

npm install
Step 4 — Create environment file

Create a .env file in the root folder.

See Environment Variables section below.

Step 5 — Start development server

Bash

npm run dev
Step 6 — Verify server is running

Open browser and go to:

text

http://localhost:5000
You should see:

text

Welcome to PawKeep Backend
🔐 Environment Variables
Create a .env file in the root of your backend folder.

Add these variables:

env

# Server
PORT=5000

# MongoDB Atlas
MONGO_URI=mongodb://username:password@host/pawkeep

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
How To Get These Values
Variable	Where To Get It
MONGO_URI	MongoDB Atlas → Connect → Connect your application
JWT_SECRET	Choose any long random string
JWT_EXPIRE	7d means 7 days
CLOUDINARY_CLOUD_NAME	Cloudinary Dashboard
CLOUDINARY_API_KEY	Cloudinary Dashboard
CLOUDINARY_API_SECRET	Cloudinary Dashboard
📡 API Documentation
Base URL
text

Development:  http://localhost:5000/api
Production:   https://pawkeep-backend.onrender.com/api
Authentication Header
All protected routes require this header:

text

Authorization: Bearer YOUR_JWT_TOKEN
