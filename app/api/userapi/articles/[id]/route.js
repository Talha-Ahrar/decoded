import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function DELETE(request, { params }) {
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

    if (!params || !params.id) {
      return NextResponse.json({ message: 'Invalid request: ID is required' }, { status: 400 });
    }

    const articleId = new ObjectId(params.id);

    const result = await db.collection('articles').deleteOne({
      _id: articleId,
      createdBy: decoded.userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Article not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
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

    if (!params || !params.id) {
      return NextResponse.json({ message: 'Invalid request: ID is required' }, { status: 400 });
    }

    const articleId = new ObjectId(params.id);
    const { isActive } = await request.json();

    const result = await db.collection('articles').updateOne(
      { _id: articleId, createdBy: decoded.userId },
      { $set: { isActive } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'Article not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: `Article ${isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
