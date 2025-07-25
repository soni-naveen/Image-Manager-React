# Image Manager

A full-stack web application that enables users to register, create nested folders (similar to Google Drive), upload images into those folders, and search for their images by name. Each user's data is isolated and secure.

Try it here : [imagemanagerapp.vercel.app](https://imagemanagerapp.vercel.app/)

---

## 🚀 Features

- 🔐 **Authentication**
  - Signup
  - Login
  - Logout

- 📂 **Folder Management**
  - Create folders and subfolders (nested structure)
  - Organized like Google Drive

- 🖼️ **Image Upload**
  - Upload images with a name and image file
  - Associate images with folders

- 👤 **User-Specific Access**
  - Users can only view and manage their own folders and images

- 🔍 **Search**
  - Search images by name
  - Results are scoped to the logged-in user's data

---

## 🛠️ Tech Stack

**Frontend:**
- ReactJS
- TailwindCSS

**Backend:**
- NodeJS
- ExpressJS
- MongoDB (via Mongoose)

---

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/soni-naveen/Image-Manager-React
```

### Install Dependencies
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### Configure Environment
Create a `.env` file in the root directory and server directory and add your configuration:

#### Frontend
```bash
VITE_REACT_BASE_URL = your_backend_url

```
#### Backend
```bash

MONGODB_URI = your_mongodb_connection_string 

JWT_SECRET = your_jwt_secret
CORS_ORIGIN = your_frontend_url

PORT=4000
CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret
```

### Start development servers

```bash

# In one terminal for frontend
npm run dev

# In another terminal for backend
cd server
npm run dev


```

Open http://localhost:5173 with your browser to see the result.
