import { neon } from '@neondatabase/serverless';

// Lazy initialization to avoid errors during build
function getSql() {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not defined. Database operations will fail.');
    // Return a dummy function for build time
    return async () => [];
  }
  return neon(process.env.DATABASE_URL);
}

// Export a function that returns the sql instance
export const getDb = () => getSql();

// For direct usage with template literals
export async function sql(strings: TemplateStringsArray, ...values: any[]) {
  const db = getSql();
  return db(strings, ...values);
}

export async function initDatabase() {
  try {
    const db = getSql();
    
    await db`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
        token_type TEXT,
        access_token TEXT,
        refresh_token TEXT,
        expires_at INTEGER,
        scope TEXT,
        id_token TEXT,
        UNIQUE(provider, provider_account_id)
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS camera_data (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        captured_date TIMESTAMP NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        email TEXT,
        photo_url TEXT,
        photo_data BYTEA,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db`CREATE INDEX IF NOT EXISTS idx_camera_data_user_id ON camera_data(user_id)`;
    await db`CREATE INDEX IF NOT EXISTS idx_camera_data_date ON camera_data(captured_date)`;
    await db`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
