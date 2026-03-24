import { NextResponse } from 'next/server';
import { getCameraDataCount, getAllCameraData } from '@/lib/db/camera-data';

// GET /api/camera-data/stats - Get statistics
export async function GET() {
  try {
    // Get total count
    const total = await getCameraDataCount();

    // Get all data for calculating today and this week
    const allData = await getAllCameraData(1000);

    // Get today's count
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const today = allData.filter(
      (item) =>
        new Date(item.captured_date) >= startOfDay &&
        new Date(item.captured_date) < endOfDay
    ).length;

    // Get this week's count
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeek = allData.filter(
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
