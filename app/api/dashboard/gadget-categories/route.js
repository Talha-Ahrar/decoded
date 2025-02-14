import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verify } from 'jsonwebtoken';

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
    await ensureCollection(db, 'gadgetcategories');
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'list') {
      const categories = await db.collection('gadgetcategories')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return NextResponse.json({ success: true, categories });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Database operation failed' }, 
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
    await ensureCollection(db, 'gadgetcategories');
    
    const data = await request.json();
    const { action } = data;

    switch (action) {
      case 'create': {
        const { name, isActive } = data;

        if (!name) {
          return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
        }

        const existingCategory = await db.collection('gadgetcategories').findOne({ name });
        if (existingCategory) {
          return NextResponse.json({ success: false, error: 'Category already exists' }, { status: 400 });
        }

        const category = await db.collection('gadgetcategories').insertOne({
          name,
          isActive: isActive ?? true,
          createdBy: new ObjectId(userData.userId),
          createdAt: new Date(),
          updatedAt: new Date()
        });

        const createdCategory = {
          _id: category.insertedId,
          name,
          isActive: isActive ?? true,
          createdBy: userData.userId,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        return NextResponse.json(
          { 
            success: true, 
            message: 'Category created successfully', 
            category: createdCategory
          }, 
          { status: 201 }
        );
      }

      case 'updateStatus': {
        const { categoryId, isActive } = data;

        if (!categoryId || typeof isActive !== 'boolean') {
          return NextResponse.json({ success: false, error: 'Invalid category ID or status' }, { status: 400 });
        }

        const result = await db.collection('gadgetcategories').findOneAndUpdate(
          { _id: new ObjectId(categoryId) },
          { 
            $set: { 
              isActive, 
              updatedAt: new Date() 
            } 
          },
          { returnDocument: 'after' }
        );

        if (!result) {
          return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Category status updated', 
          category: result
        });
      }

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Database operation failed' }, 
      { status: 500 }
    );
  }
}