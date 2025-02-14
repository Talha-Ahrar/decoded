import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

async function getUserFromToken(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) throw new Error('No token found');
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function GET(request) {
    try {
      const user = await getUserFromToken(request);
      const { searchParams } = new URL(request.url);
  
      // Extract search parameters
      const brand = searchParams.get('brand') || '';
      const model = searchParams.get('model') || '';
      const ram = searchParams.get('ram') || '';
      const storage = searchParams.get('storage') || '';
      const releaseDate = searchParams.get('releaseDate') || '';
      const releaseDateStart = searchParams.get('releaseDateStart') || '';
      const releaseDateEnd = searchParams.get('releaseDateEnd') || '';
      const createdDateStart = searchParams.get('createdDateStart') || '';
      const createdDateEnd = searchParams.get('createdDateEnd') || '';
      const minViews = parseInt(searchParams.get('minViews')) || 0;
      const minFavorites = parseInt(searchParams.get('minFavorites')) || 0;
      const page = parseInt(searchParams.get('page')) || 1;
      const limit = parseInt(searchParams.get('limit')) || 10;
      const isActive = searchParams.get('isActive');
  
      // Build query
      const query = {
        createdBy: user.userId,
      };
  
      // Handle isActive filter
      if (isActive !== null && isActive !== undefined) {
        query.isActive = isActive === 'true';
      }
  
      // Brand and Model filters
      if (brand) {
        query.brand = { $regex: brand, $options: 'i' };
      }
      if (model) {
        query.model = { $regex: model, $options: 'i' };
      }
  
      // RAM and Storage filters
      if (ram) query['ramStorage.ram'] = { $regex: ram, $options: 'i' };
      if (storage) query['ramStorage.storage'] = { $regex: storage, $options: 'i' };
  
      // Release Date handling
      if (releaseDate === 'coming_soon') {
        query.releaseDate = 'Coming Soon';
      } else if (releaseDate === 'released') {
        query.releaseDate = { $ne: 'Coming Soon', $exists: true };
      }
  
      // Release Date Range
      if (releaseDateStart || releaseDateEnd) {
        query.releaseDate = {};
        if (releaseDateStart) {
          query.releaseDate.$gte = new Date(releaseDateStart);
        }
        if (releaseDateEnd) {
          query.releaseDate.$lte = new Date(releaseDateEnd);
        }
      }
  
      // Created Date Range
      if (createdDateStart || createdDateEnd) {
        query.createdAt = {};
        if (createdDateStart) {
          query.createdAt.$gte = new Date(createdDateStart);
        }
        if (createdDateEnd) {
          query.createdAt.$lte = new Date(createdDateEnd);
        }
      }
  
      // Views and Favorites filters
      if (minViews > 0) query['views.default'] = { $gte: minViews };
      if (minFavorites > 0) query['favorites.default'] = { $gte: minFavorites };
  
      const db = await connectDB();
      const total = await db.collection('mobiles').countDocuments(query);
      const skip = (page - 1) * limit;
  
      const mobiles = await db.collection('mobiles')
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
  
      return NextResponse.json({
        status: 'success',
        data: {
          mobiles,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        }
      });
  
    } catch (error) {
      console.error('Error in list mobiles:', error);
      
      if (error.message === 'No token found' || error.message === 'Invalid token') {
        return NextResponse.json(
          { status: 'error', message: 'Please login to continue' },
          { status: 401 }
        );
      }
  
      return NextResponse.json(
        { status: 'error', message: 'Internal server error' },
        { status: 500 }
      );
    }
  }