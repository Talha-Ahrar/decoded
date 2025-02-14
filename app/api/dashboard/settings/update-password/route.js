import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { hash, compare } from 'bcryptjs';
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

    const { currentPassword, newPassword } = await request.json();

    // Validate new password
    if (!newPassword || newPassword.length < 8 ||
        !/[A-Z]/.test(newPassword) ||
        !/[a-z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword) ||
        !/[!@#$%^&*]/.test(newPassword)) {
      return NextResponse.json({ error: 'Password does not meet requirements' }, { status: 400 });
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

    // Hash and update new password
    const hashedPassword = await hash(newPassword, 10);
    await db.collection('xadmins').updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    );

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
