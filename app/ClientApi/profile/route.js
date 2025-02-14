import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { hash } from 'bcryptjs';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
async function verifyToken(request) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Update profile handler
export async function POST(request) {
  try {
    const decoded = await verifyToken(request);
    const { name, avatar, country, newPassword } = await request.json();
    
    const db = await connectDB();
    const updateData = {
      name,
      avatar,
      country,
      lastModified: new Date()
    };

    // If password is provided, hash it
    if (newPassword) {
      updateData.password = await hash(newPassword, 12);
    }

    const result = await db.collection('clientuser').findOneAndUpdate(
      { _id: new ObjectId(decoded.userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: result._id.toString(),
        email: result.email,
        name: result.name,
        avatar: result.avatar,
        country: result.country,
        isGoogle: result.isGoogle
      }
    });
  } catch (error) {
    console.error(error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Create password for Google users
export async function PUT(request) {
  try {
    const decoded = await verifyToken(request);
    const { newPassword } = await request.json();
    
    const db = await connectDB();
    
    // Check if user exists and is a Google user
    const user = await db.collection('clientuser').findOne({
      _id: new ObjectId(decoded.userId)
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!user.isGoogle) {
      return NextResponse.json({ message: 'Operation not allowed' }, { status: 403 });
    }

    // Hash and set the new password
    const hashedPassword = await hash(newPassword, 12);
    
    await db.collection('clientuser').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { 
        $set: {
          password: hashedPassword,
          lastModified: new Date()
        }
      }
    );

    return NextResponse.json({ message: 'Password created successfully' });
  } catch (error) {
    console.error(error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}