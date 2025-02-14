import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

async function generateToken(user) {
  return jwt.sign(
    { 
      userId: user._id.toString(), 
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

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

// Login handler
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const db = await connectDB();
    
    const user = await db.collection('clientuser').findOne({ email });
    
    if (!user || !(await compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = await generateToken(user);

    const response = NextResponse.json({ 
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        country: user.country
      }
    }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Signup handler
export async function PUT(request) {
  try {
    const { email, password, name, avatar } = await request.json();
    const db = await connectDB();
    
    // Check if user exists
    const existingUser = await db.collection('clientuser').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    // Get user's country
    const country = await getCountryFromIP(request);

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const result = await db.collection('clientuser').insertOne({
      email,
      password: hashedPassword,
      name,
      avatar,
      country,
      createdAt: new Date(),
      isGoogle: false
    });

    const token = await generateToken({ _id: result.insertedId, email });

    const response = NextResponse.json({ 
      message: 'Signup successful',
      user: {
        id: result.insertedId.toString(),
        email,
        name,
        avatar,
        country
      }
    }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Google auth handler
export async function PATCH(request) {
  try {
    const { token } = await request.json();
    
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const db = await connectDB();
    
    // Check if user exists
    let user = await db.collection('clientuser').findOne({ email: payload.email });
    
    if (!user) {
      // Get user's country for new users
      const country = await getCountryFromIP(request);

      // Create new user
      const result = await db.collection('clientuser').insertOne({
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        country,
        isGoogle: true,
        createdAt: new Date()
      });
      
      user = {
        _id: result.insertedId,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        country,
        isGoogle: true
      };
    }

    const jwtToken = await generateToken(user);

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
    }, { status: 200 });

    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}