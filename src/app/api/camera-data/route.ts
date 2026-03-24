import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Get all data (for admin/demo) or user-specific data
    if (all === 'true' && session.user.email === process.env.DEMO_EMAIL) {
      const data = await getAllCameraData();
      return NextResponse.json(data);
    }

    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const data = await getCameraDataByUserId(
      session.user.id,
      limit,
      offset
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching camera data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/camera-data - Create new camera data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { captured_date, latitude, longitude, email, photo_url } = body;

    // Validate required fields
    if (!captured_date || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate GPS coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid GPS coordinates' },
        { status: 400 }
      );
    }

    const data = await createCameraData({
      user_id: session.user.id,
      captured_date: new Date(captured_date),
      latitude,
      longitude,
      email: email || null,
      photo_url: photo_url || null,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating camera data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/camera-data - Delete camera data
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter required' },
        { status: 400 }
      );
    }

    const data = await getCameraDataById(parseInt(id));
    
    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Check ownership (unless demo user)
    if (
      data.user_id !== session.user.id &&
      session.user.email !== process.env.DEMO_EMAIL
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteCameraData(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting camera data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
