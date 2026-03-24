# Camera AI

A Next.js application for managing camera data (date, GPS, email, photos) with Google Auth and demo login functionality. Built for deployment on Vercel with Neon database.

## ✅ Connected to Neon Database

This application is now connected to your Neon PostgreSQL database at:
- **Host**: ep-divine-silence-adi2om1u-pooler.c-2.us-east-1.aws.neon.tech
- **Database**: neondb

Database tables have been initialized:
- `users` - User accounts
- `sessions` - User sessions
- `accounts` - OAuth connections
- `camera_data` - Camera records
- `photos` - Photo metadata

Demo data has been seeded with 5 sample records.

## Features

- **Google Authentication** - Sign in with your Google account
- **Demo Login** - Quick access without Google account
- **Dashboard** - View statistics and recent data
- **Camera Data Management** - Add, view, and manage camera records
- **Web Service API** - RESTful API for external applications
- **Mobile PWA Camera** 📱 - Progressive Web App for mobile camera capture
  - Take photos with camera
  - Automatic GPS tagging
  - Store in local storage
  - Upload to cloud when ready
  - Works offline
  - Install on home screen

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Neon (Serverless PostgreSQL)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon database account
- Google OAuth credentials (optional, for Google Auth)

### Installation

1. Clone the repository:
```bash
git clone <your-repo>
cd camera-ai
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:

```env
# Neon Database
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Demo User
DEMO_EMAIL="demo@example.com"
DEMO_PASSWORD="demo123"

# Optional API Key for web service
API_KEY="your-api-key"
```

### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### Set Up Neon Database

1. Go to [Neon](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string
4. Paste it in `DATABASE_URL` in your `.env.local`

The database tables will be created automatically on first run.

### Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment on Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and import your repository

3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `DEMO_EMAIL`
   - `API_KEY` (optional)

4. Deploy!

## API Endpoints

### Public Web Service

```
GET /api/web/camera-data
```

Query parameters:
- `id` - Get specific record
- `limit` - Number of records (default: 100)
- `offset` - Pagination offset (default: 0)

Headers:
- `x-api-key: YOUR_API_KEY` (if API_KEY is configured)

### Authenticated Endpoints

```
GET /api/camera-data - Get user's camera data
POST /api/camera-data - Create new record
DELETE /api/camera-data?id=1 - Delete record
GET /api/camera-data/stats - Get statistics
```

## Project Structure

```
camera-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── camera-data/
│   │   │   └── web/camera-data/route.ts
│   │   ├── dashboard/
│   │   │   ├── camera-data/page.tsx
│   │   │   ├── api/page.tsx
│   │   │   └── page.tsx
│   │   ├── login/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── DashboardLayout.tsx
│   │   ├── DataTable.tsx
│   │   ├── StatsCard.tsx
│   │   └── Providers.tsx
│   └── lib/
│       ├── db/
│       │   ├── index.ts
│       │   ├── camera-data.ts
│       │   ├── users.ts
│       │   └── schema.sql
│       └── auth.ts
├── .env.example
└── package.json
```

## Database Schema

The application uses the following tables:

- `users` - User accounts
- `sessions` - User sessions
- `accounts` - OAuth accounts
- `camera_data` - Camera records (date, GPS, email, photo)

## Demo User

The demo login button allows quick access without Google authentication. Demo user:
- Email: `demo@example.com` (configurable)
- Has access to sample data
- Can test all features

## License

MIT
