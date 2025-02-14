import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

async function generateToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), username: user.username },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

export async function POST(request) {
  try {
    // Extracting username and password from the request body
    const { username, password } = await request.json();

    // Connecting to the database
    const db = await connectDB();
    
    // Finding the user in the database by username
    const user = await db.collection('usersadmin').findOne({ username });

    // Checking if the user exists and if the password matches the hashed password
    if (!user || !(await compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // If the user is inactive, return a forbidden error
    if (!user.isActive) {
      return NextResponse.json(
        { message: 'Your account is inactive. Please contact our admin.' },
        { status: 403 }
      );
    }

    // Generate JWT token for the authenticated user
    const token = await generateToken(user);

    // Prepare the response with the login success message
    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });

    // Set the JWT token as a secure HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 1 day
      path: '/',
    });

    // Store user data in the response headers (frontend can access this)
    response.headers.set('X-User-Data', JSON.stringify({
      userId: user._id.toString(),
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      routes: user.routes,
      createdAt: user.createdAt,
      lastModified: user.lastModified,
    }));

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
