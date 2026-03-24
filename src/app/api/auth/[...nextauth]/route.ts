import NextAuth, { NextAuthOptions } from 'next-auth';
import { sql } from '@/lib/db';
import { initDatabase } from '@/lib/db';

// Initialize database on startup (both dev and production)
if (process.env.DATABASE_URL) {
  initDatabase().catch(console.error);
}

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'demo',
      name: 'Demo',
      type: 'credentials',
      credentials: {
        demo: { label: 'Demo', value: 'demo', type: 'text' },
      },
      async authorize() {
        // Demo user - always succeed
        return {
          id: 'demo-user',
          email: process.env.DEMO_EMAIL || 'demo@example.com',
          name: 'Demo User',
          image: null,
        };
      },
    },
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
