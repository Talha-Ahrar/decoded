// app/api/ClientApi/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Create response
    const response = NextResponse.json({ 
      message: 'Logged out successfully' 
    });

    // Clear the auth token cookie
    response.cookies.delete('token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      message: 'Failed to logout' 
    }, { 
      status: 500 
    });
  }
}