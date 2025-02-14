// app/api/ClientApi/auth/google/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const googleClient = new OAuth2Client({
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET
});

// Function to get user's country from IP
async function getCountryFromIP(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    if (!ip) return 'Unknown';

    const response = await fetch(`https://ipapi.co/${ip}/country_name`);
    if (!response.ok) return 'Unknown';
    
    const country = await response.text();
    return country.trim() || 'Unknown';
  } catch (error) {
    console.error('Error getting country:', error);
    return 'Unknown';
  }
}

export async function POST(request) {
  try {
    const { credential } = await request.json();
    
    if (!credential) {
      return NextResponse.json({ message: 'Google credential is required' }, { status: 400 });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      return NextResponse.json({ message: 'Invalid Google token' }, { status: 400 });
    }

    // Connect to database
    const db = await connectDB();
    
    // Check if user exists
    let user = await db.collection('clientuser').findOne({ email: payload.email });
    
    if (!user) {
      // Get country for new users
      const country = await getCountryFromIP(request);

      // Create new user if doesn't exist
      const result = await db.collection('clientuser').insertOne({
        email: payload.email,
        name: payload.name,
        avatar: payload.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${payload.email}`,
        country,
        isGoogle: true,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      user = {
        _id: result.insertedId,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${payload.email}`,
        country,
        isGoogle: true
      };
    } else {
      // Update last login time for existing user
      await db.collection('clientuser').updateOne(
        { _id: user._id },
        { 
          $set: {
            lastLogin: new Date(),
            name: payload.name,
            avatar: payload.picture || user.avatar
          }
        }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create response with user data
    const response = NextResponse.json({
      message: 'Google login successful',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        country: user.country,
        isGoogle: true
      }
    });

    // Set JWT cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Google authentication error:', error);
    return NextResponse.json({
      message: 'Authentication failed: ' + error.message
    }, {
      status: 500
    });
  }
}