// api/dashboard/mobile-brands/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verify } from 'jsonwebtoken';

// Helper function to verify token and get user data
async function verifyToken(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return {
      userId: decoded.userId,
      email: decoded.email
    };
  } catch (error) {
    return null;
  }
}

// Helper function to ensure collection exists
async function ensureCollection(db, collectionName) {
  const collections = await db.listCollections().toArray();
  if (!collections.some(col => col.name === collectionName)) {
    await db.createCollection(collectionName);
  }
}

export async function GET(request) {
  try {
    const userData = await verifyToken(request);
    if (!userData) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    await ensureCollection(db, 'mobilebrands');
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'list') {
      const brands = await db.collection('mobilebrands')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return NextResponse.json({ success: true, brands });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database operation failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const userData = await verifyToken(request);
    if (!userData) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    await ensureCollection(db, 'mobilebrands');
    
    const data = await request.json();
    const { action } = data;

    switch (action) {
      case 'create': {
        const { name, isActive } = data;

        if (!name) {
          return NextResponse.json({ success: false, error: 'Brand name is required' }, { status: 400 });
        }

        const existingBrand = await db.collection('mobilebrands').findOne({ name });
        if (existingBrand) {
          return NextResponse.json({ success: false, error: 'Brand already exists' }, { status: 400 });
        }

        const brand = await db.collection('mobilebrands').insertOne({
          name,
          isActive: isActive ?? true,
          createdBy: new ObjectId(userData.userId), // Using userId from decoded token
          createdAt: new Date(),
          updatedAt: new Date()
        });

        const createdBrand = {
          _id: brand.insertedId,
          name,
          isActive: isActive ?? true,
          createdBy: userData.userId,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        return NextResponse.json(
          { 
            success: true, 
            message: 'Brand created successfully', 
            brand: createdBrand
          }, 
          { status: 201 }
        );
      }

      case 'updateStatus': {
        const { brandId, isActive } = data;

        if (!brandId || typeof isActive !== 'boolean') {
          return NextResponse.json({ success: false, error: 'Invalid brand ID or status' }, { status: 400 });
        }

        const result = await db.collection('mobilebrands').findOneAndUpdate(
          { _id: new ObjectId(brandId) },
          { 
            $set: { 
              isActive, 
              updatedAt: new Date() 
            } 
          },
          { returnDocument: 'after' }
        );

        if (!result) {
          return NextResponse.json({ success: false, error: 'Brand not found' }, { status: 404 });
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Brand status updated', 
          brand: result
        });
      }

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database operation failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      }, 
      { status: 500 }
    );
  }
}