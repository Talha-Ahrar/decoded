import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Fetch content types
export async function GET() {
  try {
    const db = await connectDB();
    const contentTypes = await db.collection('contentTypes')
      .find({})
      .sort({ title: 1 })
      .toArray();

    return NextResponse.json(contentTypes);
  } catch (error) {
    console.error('Error fetching content types:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Add new content type
export async function POST(request) {
  try {
    // Ensure JWT_SECRET is available
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'JWT_SECRET is not defined' }, { status: 500 });
    }

    // Retrieve the token from cookies
    const token = request.cookies.get('token')?.value;
    console.log('Token:', token);

    // If no token, return Unauthorized
    if (!token) {
      console.error('Unauthorized: Token not found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      // Verify token and decode it
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded Token:', decoded);
    } catch (err) {
      console.error('JWT verification error:', err);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Database connection
    const db = await connectDB();
    console.log('Database connection established');

    // Retrieve content type from request body
    const { type } = await request.json();
    console.log('Received content type:', type);

    // Validate content type
    if (!type || typeof type !== 'string' || type.trim().length === 0) {
      console.error('Invalid content type:', type);
      return NextResponse.json({ message: 'Invalid content type' }, { status: 400 });
    }

    // Check if the content type already exists
    const existingType = await db.collection('contentTypes').findOne({
      title: type.trim().toLowerCase(),
    });
    console.log('Existing type:', existingType);

    // If the content type exists, return a conflict error
    if (existingType) {
      console.error('Content type already exists');
      return NextResponse.json({ message: 'Content type already exists' }, { status: 409 });
    }

    // Create the new content type object
    const contentType = {
      title: type.trim(),
      createdBy: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log('New content type:', contentType);

    // Insert the new content type into the database
    const result = await db.collection('contentTypes').insertOne(contentType);
    console.log('Insert result:', result);

    return NextResponse.json({
      message: 'Content type created successfully',
      contentType: {
        _id: result.insertedId,
        ...contentType,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Full error details:', error); // Log full error details for debugging
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
