// app/api/userapi/mobiles/savemobile/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to get user data from token
async function getUserFromToken(request) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.userId, username: decoded.username };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function POST(request) {
  try {
    // Get user data from token
    const user = await getUserFromToken(request);
    
    // Get the mobile data from request body
    const mobileData = await request.json();

    // Connect to database
    const db = await connectDB();

    // Check if mobile with same brand and model exists
    const existingMobile = await db.collection('mobiles').findOne({
      brand: mobileData.brand,
      model: mobileData.model,
      isActive: true
    });

    if (existingMobile) {
      return NextResponse.json(
        { 
          status: 'error',
          message: `Mobile ${mobileData.brand} ${mobileData.model} already exists` 
        },
        { status: 400 }
      );
    }

    // Prepare the document to be inserted
    const now = new Date();
    const document = {
      ...mobileData,
      createdBy: user.userId,
      createdAt: now,
      updatedBy: user.userId,
      updatedAt: now,
      isActive: true
    };

    // Insert into database
    const result = await db.collection('mobiles').insertOne(document);

    if (!result.insertedId) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Failed to save mobile data'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        status: 'success',
        message: `${mobileData.brand} ${mobileData.model} saved successfully`,
        mobileId: result.insertedId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error saving mobile data:', error);
    
    if (error.message === 'No token found' || error.message === 'Invalid token') {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Please login to continue'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        status: 'error',
        message: 'Something went wrong while saving mobile data'
      },
      { status: 500 }
    );
  }
}

// PUT route for updating mobile data
export async function PUT(request) {
  try {
    // Get user data from token
    const user = await getUserFromToken(request);
    
    // Get the mobile data and ID from request body
    const { mobileId, ...updateData } = await request.json();

    if (!mobileId) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Mobile ID is required'
        },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectDB();

    // Check if another mobile with same brand and model exists
    const existingMobile = await db.collection('mobiles').findOne({
      _id: { $ne: new ObjectId(mobileId) },
      brand: updateData.brand,
      model: updateData.model,
      isActive: true
    });

    if (existingMobile) {
      return NextResponse.json(
        { 
          status: 'error',
          message: `Mobile ${updateData.brand} ${updateData.model} already exists` 
        },
        { status: 400 }
      );
    }

    // Prepare the update document
    const now = new Date();
    const updateDocument = {
      $set: {
        ...updateData,
        updatedBy: user.userId,
        updatedAt: now
      }
    };

    // Update in database
    const result = await db.collection('mobiles').updateOne(
      { _id: new ObjectId(mobileId) },
      updateDocument
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Mobile not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        status: 'success',
        message: `${updateData.brand} ${updateData.model} updated successfully`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating mobile data:', error);
    
    if (error.message === 'No token found' || error.message === 'Invalid token') {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Please login to continue'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        status: 'error',
        message: 'Something went wrong while updating mobile data'
      },
      { status: 500 }
    );
  }
}