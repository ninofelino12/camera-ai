# Quick Start Guide

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
- Your Neon database URL
- A secret key for NEXTAUTH_SECRET
- Google OAuth credentials (optional)

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Test the Application

#### Demo Login (No Setup Required)
1. Click **Continue as Demo User**
2. Access the dashboard
3. Try adding camera data

#### Google Login (Optional)
1. Set up Google OAuth credentials
2. Add them to `.env.local`
3. Click **Sign in with Google**

## Project Structure

```
camera-ai/
├── src/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── auth/         # NextAuth authentication
│   │   │   ├── camera-data/  # Camera data CRUD
│   │   │   └── web/          # Public web service
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── login/            # Login page
│   │   └── page.tsx          # Home page (redirects)
│   ├── components/           # React components
│   └── lib/                  # Utilities & database
│       └── db/               # Database functions
├── .env.local                # Environment variables
├── .env.example              # Example environment
└── README.md                 # Full documentation
```

## Key Features

### Dashboard
- View statistics (total, today, this week)
- Recent camera data table
- Navigate between sections

### Camera Data Management
- Add new records with date, GPS, email, photo URL
- View all your data in a table
- Delete records

### Web Service API
Public endpoint for external applications:
```
GET /api/web/camera-data
```

Query parameters:
- `id` - Get specific record
- `limit` - Number of records
- `offset` - Pagination

### Authentication
- **Google OAuth**: Full authentication with Google
- **Demo Login**: Quick access without setup

## API Examples

### Get All Camera Data
```bash
curl http://localhost:3000/api/web/camera-data
```

### Get Specific Record
```bash
curl http://localhost:3000/api/web/camera-data?id=1
```

### Add New Record (Authenticated)
```bash
curl -X POST http://localhost:3000/api/camera-data \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "captured_date": "2026-03-24T10:30:00Z",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "email": "user@example.com",
    "photo_url": "https://example.com/photo.jpg"
  }'
```

## Database Schema

The app automatically creates these tables:
- `users` - User accounts
- `sessions` - User sessions  
- `accounts` - OAuth connections
- `camera_data` - Camera records

## Next Steps

1. **Customize**: Modify the dashboard and components
2. **Deploy**: Follow DEPLOYMENT.md for Vercel deployment
3. **Extend**: Add more features like photo upload, maps, etc.

## Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Getting Help

- Check README.md for full documentation
- Check DEPLOYMENT.md for deployment guide
- Review API documentation in the dashboard
