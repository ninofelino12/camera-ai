# Deployment Guide

## Deploy to Vercel with Neon Database

### Step 1: Set Up Neon Database

1. Go to [Neon](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (looks like `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)

### Step 2: Set Up Google OAuth (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Set application type to **Web application**
6. Add authorized redirect URI:
   - For production: `https://your-app.vercel.app/api/auth/callback/google`
   - For preview: `https://your-app-git-branch-username.vercel.app/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### Step 3: Deploy to Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and click **Add New Project**

3. Import your GitHub repository

4. In the **Configure Project** step, add the following environment variables:

```
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DEMO_EMAIL=demo@example.com
API_KEY=your-api-key-optional
```

5. Click **Deploy**

### Step 4: Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

### Step 5: Update Neon Database Allowed IPs (if needed)

By default, Neon allows connections from anywhere. If you have IP restrictions:

1. Go to your Neon project settings
2. Navigate to **Connection Pooling**
3. Ensure Vercel IPs are allowed (or disable IP restrictions)

### Step 6: Test Your Deployment

1. Visit your deployed URL
2. Click **Continue as Demo User** to test without Google
3. Or use **Sign in with Google** for full authentication

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon database connection string |
| `NEXTAUTH_URL` | Yes | Your app's URL (Vercel provides this) |
| `NEXTAUTH_SECRET` | Yes | Secret key for NextAuth (generate with openssl) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth Client Secret |
| `DEMO_EMAIL` | No | Demo user email (default: demo@example.com) |
| `API_KEY` | No | API key for web service endpoint |

## Post-Deployment Checklist

- [ ] Database tables are created (check Neon dashboard)
- [ ] Google Auth works (if configured)
- [ ] Demo login works
- [ ] Dashboard loads correctly
- [ ] API endpoints respond
- [ ] Web service endpoint is accessible

## Troubleshooting

### Database Connection Errors

1. Check DATABASE_URL format
2. Ensure SSL mode is set to `require`
3. Verify Neon project is active

### Authentication Errors

1. Verify NEXTAUTH_URL matches your domain
2. Check Google OAuth redirect URIs
3. Regenerate NEXTAUTH_SECRET

### Build Errors

1. Check all environment variables are set
2. Review build logs in Vercel dashboard
3. Run `npm run build` locally first

## Updating Your Deployment

Every push to your main branch will automatically trigger a new deployment on Vercel.

## Custom Domain

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add your custom domain
4. Update NEXTAUTH_URL to your custom domain

## Monitoring

- **Vercel Analytics**: Enable in project settings
- **Neon Dashboard**: Monitor database usage
- **Vercel Logs**: Check runtime logs for errors
