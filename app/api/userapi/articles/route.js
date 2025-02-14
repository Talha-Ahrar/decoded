import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
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
    const data = await request.json();

    const article = {
      ...data,
      createdBy: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: { type: Number, default: 0 },
      favorites: { type: Number, default: 0 },

    };

    const result = await db.collection('articles').insertOne(article);

    return NextResponse.json({ 
      message: 'Article created successfully',
      articleId: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}