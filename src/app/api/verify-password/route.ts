import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === process.env.ACCESS_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('access_password', password, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
