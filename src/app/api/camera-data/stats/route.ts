import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCameraDataCount, getCameraDataByUserId } from '@/lib/db/camera-data';

// GET /api/camera-data/stats - Get statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isDemo = session.user.email === process.env.DEMO_EMAIL;

    // Get total count
    const total = await getCameraDataCount(isDemo ? undefined : session.user.id);

    // Get today's count
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    let userData;
    if (isDemo) {
      userData = await getCameraDataByUserId(session.user.id, 1000);
    } else {
      userData = await getCameraDataByUserId(session.user.id, 1000);
    }

    const today = userData.filter(
      (item) =>
        new Date(item.captured_date) >= startOfDay &&
        new Date(item.captured_date) < endOfDay
    ).length;

    // Get this week's count
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeek = userData.filter(
      (item) => new Date(item.captured_date) >= startOfWeek
    ).length;

    return NextResponse.json({
      total,
      today,
      thisWeek,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
