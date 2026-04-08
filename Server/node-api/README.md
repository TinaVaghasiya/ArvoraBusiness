# Arvora Business - Server Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Firebase Admin SDK credentials

## Installation

1. **Install dependencies:**
   ```bash
   cd Server/node-api
   npm install
   ```

2. **Environment Configuration:**
   - Copy `.env.example` to `.env`
   - Update all environment variables with your actual values:
     ```
     PORT=5000
     SERVER_URL=http://your-server-url:5000
     MONGODB_URI=mongodb://username:password@host:port/database
     USER_NAME=your-email@gmail.com
     USER_PASSWORD=your-app-password
     JWT_SECRET=your-secret-key-here
     JWT_EXPIRES=7d
     ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
     ```

3. **Firebase Setup:**
   - Download your Firebase service account JSON file
   - Save it as `firebase-service-account.json` in the `Server/node-api/` directory
   - **IMPORTANT:** Never commit this file to version control

4. **Create Upload Directories:**
   ```bash
   mkdir -p uploads/business-cards
   mkdir -p uploads/advertisements
   ```

## Running the Server

**Development:**
```bash
npm run test
```

**Production:**
```bash
npm start
```

## Security Notes

⚠️ **IMPORTANT SECURITY REMINDERS:**

1. **Never commit sensitive files:**
   - `.env` file
   - `firebase-service-account.json`
   - Files in `uploads/` directory

2. **Update CORS origins:**
   - In production, update `ALLOWED_ORIGINS` in `.env` to only include your actual frontend URLs
   - Remove localhost origins in production

3. **Strong JWT Secret:**
   - Use a strong, random JWT_SECRET (minimum 32 characters)
   - Never share or expose this secret

4. **Database Security:**
   - Use strong MongoDB credentials
   - Enable MongoDB authentication
   - Use SSL/TLS for MongoDB connections in production

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify OTP

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profileupdate` - Update user profile

### Cards
- `GET /api/cards/get-cards` - Get all cards
- `POST /api/cards/save-card` - Save new card
- `PUT /api/cards/update-card/:id` - Update card
- `DELETE /api/cards/delete-card/:id` - Delete card

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/cards` - Get all cards

## Database Indexes

The following indexes are automatically created for optimal performance:

**User Model:**
- `email` (unique)
- `phone` (unique)
- `isActive`
- `createdAt`

**Card Model:**
- `user + isDeleted` (compound)
- `createdAt`

**Notification Model:**
- `userId + createdAt` (compound)
- `read`

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check connection string format
- Ensure network access is allowed

### Firebase Notification Issues
- Verify `firebase-service-account.json` exists
- Check Firebase project configuration
- Ensure FCM tokens are valid

### CORS Errors
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Restart the server after changing environment variables

## Support
For issues or questions, please contact the development team.
