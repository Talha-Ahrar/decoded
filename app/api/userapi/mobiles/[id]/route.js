// app/api/userapi/mobiles/[id]/route.js
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function GET(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    const db = await connectDB();
    
    const mobile = await db.collection('mobiles').findOne({
      _id: new ObjectId(params.id),
      createdBy: user.userId,
      isActive: true
    });

    if (!mobile) {
      return NextResponse.json(
        { message: 'Mobile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mobile);

  } catch (error) {
    console.error('Error fetching mobile:', error);
    
    if (error.message === 'No token found' || error.message === 'Invalid token') {
      return NextResponse.json(
        { message: 'Please login to continue' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }





  
}



export async function PUT(request, { params }) {
    try {
      // Verify user authentication
      const user = await getUserFromToken(request);
      
      // Parse request body
      let mobileData;
      try {
        mobileData = await request.json();
      } catch (error) {
        console.error('Error parsing request body:', error);
        return NextResponse.json(
          { status: 'error', message: 'Invalid request body' },
          { status: 400 }
        );
      }
  
      // Basic validation
      if (!mobileData || typeof mobileData !== 'object') {
        return NextResponse.json(
          { status: 'error', message: 'Invalid mobile data' },
          { status: 400 }
        );
      }
  
      // Connect to database
      const db = await connectDB();
      
      // Prepare update data (remove _id if present)
      const { _id, ...updateData } = mobileData;
      
      // Add update metadata
      updateData.updatedAt = new Date();
      updateData.updatedBy = user.userId;
  
      // Perform update
      const result = await db.collection('mobiles').updateOne(
        {
          _id: new ObjectId(params.id),
          createdBy: user.userId,
          isActive: true
        },
        { $set: updateData }
      );
  
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { status: 'error', message: 'Mobile not found or unauthorized' },
          { status: 404 }
        );
      }
  
      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { status: 'info', message: 'No changes made to the mobile' },
          { status: 200 }
        );
      }
  
      return NextResponse.json({
        status: 'success',
        message: 'Mobile updated successfully'
      });
  
    } catch (error) {
      console.error('Error updating mobile:', error);
      
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