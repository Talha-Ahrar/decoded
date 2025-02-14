import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { hash } from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'list') {
      const db = await connectDB();
      const users = await db.collection('xadmins').find({}).toArray();
      return NextResponse.json({ users });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await connectDB();
    const data = await request.json();
    const { action } = data;

    switch (action) {
      case 'create': {
        const { email, password, role, isActive } = data;
        
        // Validate input
        if (!email || !password || !role) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await db.collection('xadmins').findOne({ email });
        if (existingUser) {
          return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        // Hash password and create user
        const hashedPassword = await hash(password, 10);
        await db.collection('xadmins').insertOne({
          email,
          password: hashedPassword,
          role,
          isActive
        });

        return NextResponse.json({ message: 'User created successfully' });
      }

      case 'updateStatus': {
        const { userId, isActive } = data;
        
        await db.collection('xadmins').updateOne(
          { _id: new ObjectId(userId) },
          { $set: { isActive } }
        );

        return NextResponse.json({ message: 'Status updated successfully' });
      }

      case 'updatePassword': {
        const { userId, newPassword } = data;
        
        if (!newPassword) {
          return NextResponse.json({ error: 'New password is required' }, { status: 400 });
        }

        const hashedPassword = await hash(newPassword, 10);
        await db.collection('xadmins').updateOne(
          { _id: new ObjectId(userId) },
          { $set: { password: hashedPassword } }
        );

        return NextResponse.json({ message: 'Password updated successfully' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}