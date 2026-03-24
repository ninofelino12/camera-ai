import { config } from 'dotenv';
import { resolve } from 'path';
import { sql, initDatabase } from '@/lib/db';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function run() {
  try {
    console.log('Database URL:', process.env.DATABASE_URL ? 'Found ✓' : 'Not found ✗');
    console.log('Initializing database...');
    await initDatabase();
    console.log('Database initialized successfully!');
    
    // Verify tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('\nTables created:');
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
