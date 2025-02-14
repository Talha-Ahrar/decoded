import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    // Ensure JWT_SECRET is available, otherwise return an error
    if (!JWT_SECRET) {
      return NextResponse.json({ error: 'JWT_SECRET is not defined' }, { status: 500 });
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verifying the token and decoding it
    const decoded = jwt.verify(token, JWT_SECRET);

    return NextResponse.json({ authenticated: true, user: decoded }, { status: 200 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('JWT verification error:', error);

    // Return an unauthenticated response with more detailed error for debugging in development
    return NextResponse.json(
      {
        authenticated: false,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Invalid token',
      },
      { status: 401 }
    );
  }
}
