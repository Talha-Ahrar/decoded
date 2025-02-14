// app/api/brands/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(request) {
  try {
    // Get the category type from the URL search params
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'mobile';

    const db = await connectDB();
    
    // Validate the type parameter
    const validTypes = ['mobile', 'gadget', 'news', 'article'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid category type'
      }, { status: 400 });
    }

    // Map type to collection name
    const collectionMap = {
      mobile: 'mobilebrands',
      gadget: 'gadgetcategories',
      news: 'newscategories',
      article: 'articlecategories'
    };

    const collectionName = collectionMap[type];
    
    // Check if collection exists
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === collectionName);
    
    if (!collectionExists) {
      return NextResponse.json({
        success: false,
        data: [],
        message: `Collection ${collectionName} not found`
      });
    }

    const items = await db.collection(collectionName)
      .find({ isActive: true })
      .project({ name: 1 })
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: items.map(item => ({
        id: item._id.toString(),
        name: item.name
      }))
    });

  } catch (error) {
    console.error(`Error in brands API:`, error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}