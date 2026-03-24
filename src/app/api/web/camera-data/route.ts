import { NextRequest, NextResponse } from 'next/server';
import { getAllCameraData, getCameraDataById } from '@/lib/db/camera-data';

// GET /api/web/camera-data - Public web service endpoint
// This endpoint can be called from external applications
export async function GET(request: NextRequest) {
  try {
    // Optional API key authentication
    const apiKey = request.headers.get('x-api-key');
    
    // If API key is configured, validate it
    if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get specific record by ID
    if (id) {
      const data = await getCameraDataById(parseInt(id));
      if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      // Remove sensitive data
      const { photo_data, ...publicData } = data;
      return NextResponse.json(publicData);
    }

    // Get all data (paginated)
    const data = await getAllCameraData(limit, offset);
    
    // Remove sensitive data (like binary photo_data)
    const publicData = data.map(({ photo_data, ...item }) => item);

    return NextResponse.json(publicData);
  } catch (error) {
    console.error('Error fetching camera data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
