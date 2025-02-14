import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    if (!JWT_SECRET) {
      return NextResponse.json({ error: 'JWT_SECRET is not defined' }, { status: 500 });
    }

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const db = await connectDB();

    // Get all images for the user
    const images = await db.collection('images-gallary')
      .find({ createdBy: decoded.userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ 
      images: images.map(img => ({
        id: img._id.toString(),
        name: img.fileName,
        url: img.imageUrl,
        thumbnail: img.imageUrl,
        dateUploaded: img.createdAt
      }))
    });

  } catch (error) {
    console.error('Error:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}