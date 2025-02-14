// app/api/userapi/mobiles/toggleActive/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

async function getUserFromToken(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) throw new Error('No token found');
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    const db = await connectDB();

    const mobile = await db.collection('mobiles').findOne({
      _id: new ObjectId(params.id),
      createdBy: user.userId
    });

    if (!mobile) {
      return NextResponse.json(
        { status: 'error', message: 'Mobile not found' },
        { status: 404 }
      );
    }

    const result = await db.collection('mobiles').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          isActive: !mobile.isActive,
          updatedBy: user.userId,
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Failed to update status' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: `Mobile ${mobile.isActive ? 'deactivated' : 'activated'} successfully`
    });

  } catch (error) {
    console.error('Error updating mobile status:', error);
    
    if (error.message === 'No token found' || error.message === 'Invalid token') {
      return NextResponse.json(
        { status: 'error', message: 'Please login to continue' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}