// app/api/settings/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { compare, hash } from 'bcryptjs';
import { ObjectId } from 'mongodb';

// Get user data
export async function GET(request) {
  try {
    const authData = request.headers.get('Authorization');
    if (!authData) {
      return NextResponse.json({ message: 'Authorization required' }, { status: 401 });
    }

    const userId = authData.split(' ')[1];
    const db = await connectDB();
    
    const user = await db.collection('usersadmin').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Update user settings
export async function PATCH(request) {
  try {
    const { userId, FullName, oldPassword, newPassword } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const db = await connectDB();
    const user = await db.collection('usersadmin').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Handle password update
    if (oldPassword && newPassword) {
      const isValidPassword = await compare(oldPassword, user.password);
      if (!isValidPassword) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
      }
      
      const hashedPassword = await hash(newPassword, 12);
      await db.collection('usersadmin').updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            password: hashedPassword,
            lastModified: new Date()
          } 
        }
      );
      
      return NextResponse.json({ message: 'Password updated successfully' });
    }

    // Handle full name update
    if (FullName) {
      await db.collection('usersadmin').updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            FullName,
            lastModified: new Date()
          } 
        }
      );

      const updatedUser = await db.collection('usersadmin').findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } }
      );

      return NextResponse.json({ 
        message: 'Full name updated successfully',
        user: updatedUser
      });
    }

    return NextResponse.json({ message: 'No changes to update' }, { status: 400 });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}