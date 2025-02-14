// app/api/ClientApi/auth/verify/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ 
        message: 'No token found' 
      }, { 
        status: 401 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token.value, JWT_SECRET);
    
    if (!decoded?.userId) {
      return NextResponse.json({ 
        message: 'Invalid token' 
      }, { 
        status: 401 
      });
    }

    // Connect to database and verify user exists
    const db = await connectDB();
    const user = await db.collection('clientuser').findOne({ 
      _id: new ObjectId(decoded.userId) 
    });

    if (!user) {
      return NextResponse.json({ 
        message: 'User not found' 
      }, { 
        status: 401 
      });
    }

    // Update last activity
    await db.collection('clientuser').updateOne(
      { _id: user._id },
      { 
        $set: { 
          lastActive: new Date() 
        } 
      }
    );

    // Return user data without sensitive information
    return NextResponse.json({
      message: 'Token is valid',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isGoogle: user.isGoogle || false
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ 
        message: 'Token expired' 
      }, { 
        status: 401 
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ 
        message: 'Invalid token' 
      }, { 
        status: 401 
      });
    }

    return NextResponse.json({ 
      message: 'Authentication failed' 
    }, { 
      status: 500 
    });
  }
}

// Optional: Add a POST endpoint to refresh tokens
export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ 
        message: 'No token found' 
      }, { 
        status: 401 
      });
    }

    // Verify current token
    const decoded = jwt.verify(token.value, JWT_SECRET);
    
    if (!decoded?.userId) {
      return NextResponse.json({ 
        message: 'Invalid token' 
      }, { 
        status: 401 
      });
    }

    // Generate new token
    const newToken = jwt.sign(
      { 
        userId: decoded.userId,
        email: decoded.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create response
    const response = NextResponse.json({ 
      message: 'Token refreshed successfully' 
    });

    // Set new token cookie
    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ 
      message: 'Failed to refresh token' 
    }, { 
      status: 500 
    });
  }
}