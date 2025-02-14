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

    // Parse query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');
    const viewsMin = url.searchParams.get('viewsMin');
    const viewsMax = url.searchParams.get('viewsMax');
    const isFavorite = url.searchParams.get('isFavorite') === 'true';

    // Build match query
    const matchQuery = {
      createdBy: decoded.userId,
      ...(search && {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      }),
      ...(status === 'active' && { isActive: true }),
      ...(status === 'inactive' && { isActive: false }),
      ...(viewsMin || viewsMax) && {
        'views.default': {
          ...(viewsMin && { $gte: parseInt(viewsMin) }),
          ...(viewsMax && { $lte: parseInt(viewsMax) })
        }
      },
      ...(isFavorite && { 'favorites.default': { $gt: 0 } })
    };

    // Get total count for pagination
    const total = await db.collection('articles').countDocuments(matchQuery);

    const articles = await db.collection('articles')
      .aggregate([
        { $match: matchQuery },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $addFields: {
            contentTypeObjectId: {
              $cond: {
                if: { $eq: [{ $type: "$contentType" }, "string"] },
                then: { $toObjectId: "$contentType" },
                else: "$contentType"
              }
            }
          }
        },
        {
          $lookup: {
            from: 'contentTypes',
            localField: 'contentTypeObjectId',
            foreignField: '_id',
            as: 'contentTypeData'
          }
        },
        {
          $addFields: {
            contentType: {
              $ifNull: [{ $arrayElemAt: ['$contentTypeData.title', 0] }, 'N/A']
            }
          }
        },
        { $project: { contentTypeData: 0, contentTypeObjectId: 0 } }
      ])
      .toArray();

    return NextResponse.json({
      articles,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}