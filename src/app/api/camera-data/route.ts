import { NextRequest, NextResponse } from 'next/server';
import {
  getCameraDataByUserId,
  getAllCameraData,
  createCameraData,
  getCameraDataById,
  deleteCameraData,
} from '@/lib/db/camera-data';

// GET /api/camera-data - Retrieve camera data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const all = searchParams.get('all');

    // Get specific record by ID
    if (id) {
      const data = await getCameraDataById(parseInt(id));
      if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json(data);
    }

    // Get all data
    const limit = parseInt(searchParams.get('limit') || '100');
    const data = await getAllCameraData(limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching camera data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST /api/camera-data - Create camera data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { captured_date, latitude, longitude, email, photo_url, photo_data } = body;

    if (!captured_date || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = await createCameraData({
      captured_date,
      latitude,
      longitude,
      email: email || '',
      photo_url: photo_url || null,
      photo_data: photo_data || null,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating camera data:', error);
    return NextResponse.json(
      { error: 'Failed to create data' },
      { status: 500 }
    );
  }
}

// DELETE /api/camera-data - Delete camera data
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await deleteCameraData(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting camera data:', error);
    return NextResponse.json(
      { error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
