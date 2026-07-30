import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      );
    }

    // 🔴 HARDCODED CREDENTIALS (Netlify Demo)
    const VALID_USERNAME = 'admin';
    const VALID_PASSWORD = 'sayo@2025';

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      return NextResponse.json({
        success: true,
        username: VALID_USERNAME,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('❌ Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}