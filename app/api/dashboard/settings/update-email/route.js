import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    // Get JWT token from cookies
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new ObjectId(decoded.userId);  // Ensure correct ObjectId

    const { currentPassword, newEmail } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const db = await connectDB();
    const user = await db.collection('xadmins').findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValid = await compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await db.collection('xadmins').findOne({ email: newEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Update email
    await db.collection('xadmins').updateOne(
      { _id: userId },
      { $set: { email: newEmail } }
    );

    return NextResponse.json({ message: 'Email updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
