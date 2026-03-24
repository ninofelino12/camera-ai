import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { sql } from '@/lib/db';
import { initDatabase } from '@/lib/db';

// Initialize database on startup (both dev and production)
if (process.env.DATABASE_URL) {
  initDatabase().catch(console.error);
}

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),
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
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const existingUser = await sql`
            SELECT * FROM users WHERE email = ${user.email}
          `;

          if (existingUser.length === 0) {
            // Create new user
            await sql`
              INSERT INTO users (id, email, name, image)
              VALUES (${user.id}, ${user.email}, ${user.name}, ${user.image})
            `;
          }

          // Update account info
          await sql`
            INSERT INTO accounts (
              id, user_id, type, provider, provider_account_id,
              access_token, refresh_token, expires_at, token_type, scope, id_token
            )
            VALUES (
              ${account.id}, ${user.id}, ${account.type}, ${account.provider},
              ${account.providerAccountId}, ${account.access_token},
              ${account.refresh_token}, ${account.expires_at},
              ${account.token_type}, ${account.scope}, ${account.id_token}
            )
            ON CONFLICT (provider, provider_account_id) DO UPDATE SET
              access_token = EXCLUDED.access_token,
              refresh_token = EXCLUDED.refresh_token,
              expires_at = EXCLUDED.expires_at
          `;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
