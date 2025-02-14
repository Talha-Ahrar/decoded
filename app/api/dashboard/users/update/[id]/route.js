import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { hash } from 'bcryptjs';
import { GET as verify } from '../../../../auth/verify/route';

export async function PUT(request, { params }) {
  try {
    const isAuthenticated = await verify(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { username, FullName, email, password, isActive, routes } = await request.json();

    // Validate required fields
    if (!username || !FullName || !email) {
      return NextResponse.json(
        { error: 'Username, Full Name, and Email are required' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    
    // Check if email or username is taken by another user
    const existingUser = await db.collection('usersadmin').findOne({
      $and: [
        { _id: { $ne: new ObjectId(id) } },
        { $or: [{ email }, { username }] }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? 'Email already taken' : 'Username already taken' },
        { status: 400 }
      );
    }

    // Validate routes
    const validRoutes = ['news', 'articles', 'gadget', 'mobiles'];
    const invalidRoutes = routes.filter(route => !validRoutes.includes(route));
    if (invalidRoutes.length > 0) {
      return NextResponse.json(
        { error: 'Invalid routes specified' },
        { status: 400 }
      );
    }

    // Prepare update object
    const updateData = {
      username,
      FullName,
      email,
      isActive,
      routes,
      lastModified: new Date()
    };

    // Only update password if provided
    if (password) {
      updateData.password = await hash(password, 12);
    }

    const result = await db.collection('usersadmin').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'User updated successfully', user: result },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}