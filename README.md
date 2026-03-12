# AMG Motog Backend

A robust Node.js/Express backend API for **AMG AutoParts and Services** - managing bike part requests, customer contacts, and admin authentication.

## 📋 Project Overview

This backend serves the AMG AutoParts and Services platform, providing REST APIs for:

- **Admin Authentication & Authorization** - Admin registration, login, token management
- **Service Requests** - Handle bike part requests with image uploads to Cloudinary
- **Customer Contacts** - Manage customer inquiries and contact submissions
- **Admin Management** - Manage multiple admin accounts with role-based access

## 🛠️ Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js 5.x
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing
- **File Storage:** Cloudinary for image uploads
- **Email Service:** Nodemailer for notifications
- **Validation:** Joi for request validation
- **DevTools:** Nodemon, tsx for hot reloading

## 📦 Dependencies

```json
{
  "production": [
    "express ^5.2.1",
    "mongoose ^9.2.4",
    "jsonwebtoken ^9.0.3",
    "bcrypt ^6.0.0",
    "cloudinary ^1.41.3",
    "multer ^2.1.1",
    "multer-storage-cloudinary ^4.0.0",
    "nodemailer ^8.0.1",
    "joi ^18.0.2",
    "dotenv ^17.3.1",
    "cookie-parser ^1.4.7",
    "uuid ^13.0.0"
  ]
}
```

## 📁 Project Structure

```
amg_motog_backend/
├── src/
│   ├── server.ts                 # Express server setup & MongoDB connection
│   ├── controllers/
│   │   ├── AuthController.ts     # Admin auth logic (register, login, logout)
│   │   ├── requestController.ts  # Bike part request handling
│   │   └── contactControler.ts   # Contact form submissions
│   ├── routes/
│   │   ├── authRoutes.ts         # Admin authentication endpoints
│   │   ├── requestRoutes.ts      # Service request endpoints
│   │   └── contactRoutes.ts      # Contact endpoints
│   ├── models/
│   │   ├── adminSchema.ts        # Admin user schema
│   │   ├── requestSchema.ts      # Service request schema
│   │   ├── contactSchema.ts      # Contact submission schema
│   │   └── sessionSchema.ts      # Session tracking schema
│   ├── middleware/
│   │   ├── AuthMiddleware.ts     # JWT authentication middleware
│   │   └── cloudinaryConfig/
│   │       ├── cloudinaryConfig.ts  # Cloudinary setup
│   │       └── multerConfig.ts      # Image upload configuration
│   │   └── nodemailerConfig/
│   │       └── requestNotify.ts     # Email notification setup
│   ├── types/
│   │   └── express.d.ts          # TypeScript Express type definitions
│   └── validations/
│       ├── adminValidation.ts    # Joi validation schemas
│       └── contactValidation.ts  # Contact validation rules
├── package.json
├── tsconfig.json
└── readme.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- MongoDB instance (local or cloud)
- Cloudinary account for image storage
- Nodemailer-compatible email service

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd amg_motog_backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/amg_motog
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Nodemailer Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@amgautoparts.com
```

4. **Start development server**

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 🔧 Available Scripts

```bash
npm run dev       # Start development server with hot reload
npm run build     # Compile TypeScript to JavaScript
npm start         # Run compiled production build
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint      | Auth        | Description             |
| ------ | ------------- | ----------- | ----------------------- |
| POST   | `/register`   | ✅ Required | Register new admin      |
| POST   | `/login`      | ❌          | Admin login             |
| POST   | `/logout`     | ❌          | Admin logout            |
| POST   | `/refresh`    | ❌          | Refresh JWT token       |
| GET    | `/all-admins` | ✅ Required | Get all admins          |
| DELETE | `/:id`        | ✅ Required | Delete an admin         |
| GET    | `/get-logs`   | ✅ Required | Get login activity logs |

### Service Requests (`/api/requests`)

| Method | Endpoint | Auth        | Description                           |
| ------ | -------- | ----------- | ------------------------------------- |
| POST   | `/`      | ❌          | Create new service request with image |
| GET    | `/`      | ✅ Required | Get all requests                      |
| GET    | `/:id`   | ✅ Required | Get specific request                  |
| DELETE | `/:id`   | ✅ Required | Delete a request                      |

### Contact Submissions (`/api/contacts`)

| Method | Endpoint | Auth        | Description          |
| ------ | -------- | ----------- | -------------------- |
| POST   | `/`      | ❌          | Submit contact form  |
| GET    | `/`      | ✅ Required | Get all contacts     |
| GET    | `/:id`   | ✅ Required | Get specific contact |
| DELETE | `/:id`   | ✅ Required | Delete contact entry |

## 📊 Data Models

### Admin Schema

```typescript
{
  userName: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: "superadmin" | "admin")
}
```

### Service Request Schema

```typescript
{
  fullName: String (required),
  phone: String (required),
  bikeBrand: String (required),
  bikeModel: String (required),
  year: String (required),
  partName: String (required),
  condition: String (required),
  image: String (Cloudinary URL),
  imageId: String (Cloudinary ID),
  address: String (required),
  description: String (required)
}
```

### Contact Schema

```typescript
{
  name: String (required),
  email: String (required),
  subject: String (required),
  message: String (required)
}
```

## 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - bcrypt for secure password storage
- ✅ **Role-Based Access Control** - Admin/SuperAdmin roles
- ✅ **Input Validation** - Joi validation for all requests
- ✅ **Environment Variables** - Sensitive data management
- ✅ **CORS Ready** - Cookie-based session management

## 📝 Middleware

### AuthMiddleware

Validates JWT tokens and checks admin authorization for protected routes.

### Cloudinary & Multer

Handles image upload and storage to Cloudinary for service requests.

### Nodemailer

Sends email notifications for new service requests and inquiries.

## 🐛 Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Run Production Build

```bash
npm start
```

Ensure all environment variables are properly configured before deployment.

## 📧 Support & Contact

For issues or feature requests, please contact the development team.

## 📄 License

ISC License

---

**Version:** 1.0.0
