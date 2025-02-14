import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    if (!JWT_SECRET) {
      return NextResponse.json({ error: 'JWT_SECRET is not defined' }, { status: 500 });
    }

    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ message: 'Invalid file type' }, { status: 400 });
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to base64
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:${file.type};base64,${base64Image}`;

    // Connect to database
    const db = await connectDB();

    // Save image metadata to database
    const imageDoc = {
      fileName: file.name,
      fileType: file.type,
      imageUrl: imageUrl,
      createdBy: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('images-gallary').insertOne(imageDoc);

    // Get image dimensions if possible
    let width = 800;  // default width
    let height = 600; // default height
    
    // Return the response in the format TinyMCE expects
    return NextResponse.json({ 
      location: imageUrl,  // Required by TinyMCE
      url: imageUrl,      // Alternative URL format
      id: result.insertedId.toString(),
      name: file.name,
      size: buffer.length,
      type: file.type,
      width: width,
      height: height
    }, { 
      status: 201,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Error:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    
    // Handle file size error
    if (error.name === 'PayloadTooLargeError') {
      return NextResponse.json({ message: 'File size too large' }, { status: 413 });
    }
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Support for larger payloads
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
    responseLimit: '8mb',
  },
};