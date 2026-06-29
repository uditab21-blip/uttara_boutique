import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  const body = await request.json();
  const password = body.password;
  
  // Simple env-based password check
  const validPassword = process.env.DASHBOARD_PASSWORD || 'uttara2026';
  
  if (password === validPassword) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('dashboard-auth', 'authenticated', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/dashboard',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return response;
  }
  
  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
}