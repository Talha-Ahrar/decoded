import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Connecting to the database...');
    const db = await connectDB();
    
    if (!db) {
      throw new Error('Database connection failed');
    }

    console.log('Fetching active brands...');
    const brands = await db.collection('mobilebrands')
      .find({ isActive: true })
      .project({ name: 1, _id: 1 })
      .sort({ name: 1 })
      .toArray();

    console.log('Brands retrieved:', brands);

    if (!brands || brands.length === 0) {
      console.warn('No active brands found.');
      return NextResponse.json([], { status: 200 }); // Return empty array instead of 404
    }

    return NextResponse.json(brands, { status: 200 }); // Return brands directly without wrapping
  } catch (error) {
    console.error('Error fetching brands:', error.message);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}