import { config } from 'dotenv';
import { resolve } from 'path';
import { sql } from '@/lib/db';

config({ path: resolve(process.cwd(), '.env.local') });

async function seedDemoData() {
  try {
    console.log('Seeding demo data...');
    
    // Create demo user if not exists
    const demoEmail = process.env.DEMO_EMAIL || 'demo@example.com';
    
    await sql`
      INSERT INTO users (id, email, name, image)
      VALUES ('demo-user', ${demoEmail}, 'Demo User', NULL)
      ON CONFLICT (id) DO NOTHING
    `;
    
    console.log('Demo user created ✓');
    
    // Add sample camera data
    const sampleData = [
      {
        captured_date: '2026-03-24 08:30:00',
        latitude: -6.2088,
        longitude: 106.8456,
        email: 'user1@example.com',
        photo_url: 'https://picsum.photos/800/600?random=1',
      },
      {
        captured_date: '2026-03-24 09:15:00',
        latitude: -6.1751,
        longitude: 106.8650,
        email: 'user2@example.com',
        photo_url: 'https://picsum.photos/800/600?random=2',
      },
      {
        captured_date: '2026-03-24 10:00:00',
        latitude: -6.2297,
        longitude: 106.8175,
        email: 'user3@example.com',
        photo_url: 'https://picsum.photos/800/600?random=3',
      },
      {
        captured_date: '2026-03-23 14:30:00',
        latitude: -6.1944,
        longitude: 106.8222,
        email: 'user4@example.com',
        photo_url: 'https://picsum.photos/800/600?random=4',
      },
      {
        captured_date: '2026-03-23 16:45:00',
        latitude: -6.2615,
        longitude: 106.7810,
        email: 'user5@example.com',
        photo_url: 'https://picsum.photos/800/600?random=5',
      },
    ];
    
    for (const data of sampleData) {
      await sql`
        INSERT INTO camera_data (user_id, captured_date, latitude, longitude, email, photo_url)
        VALUES ('demo-user', ${data.captured_date}, ${data.latitude}, ${data.longitude}, ${data.email}, ${data.photo_url})
      `;
    }
    
    console.log(`Added ${sampleData.length} sample camera records ✓`);
    console.log('\nDemo data seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedDemoData();
